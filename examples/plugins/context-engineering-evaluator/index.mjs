import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const logDir = process.env.CCV_LOG_DIR || join(homedir(), '.claude', 'cc-viewer');
const outputFile = join(logDir, 'tmp', 'context-engineering-evaluator-report.json');
const serviceInfoFile = join(logDir, 'tmp', 'context-engineering-evaluator-service.json');
const DEFAULT_REPORT_PORT = 7799;

let loaded = false;
let report = {
  updatedAt: null,
  totalEntries: 0,
  groups: {},
};
let reportServer = null;
let reportServerUrl = null;
let announcedReady = false;

function ensureDir() {
  const dir = dirname(outputFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadReport() {
  if (loaded) return;
  loaded = true;
  try {
    if (existsSync(outputFile)) {
      const data = JSON.parse(readFileSync(outputFile, 'utf-8'));
      if (data && typeof data === 'object' && data.groups) {
        report = data;
      }
    }
  } catch { }
}

function saveReport() {
  try {
    ensureDir();
    report.updatedAt = new Date().toISOString();
    writeFileSync(outputFile, JSON.stringify(report, null, 2));
    writeServiceInfo();
  } catch { }
}

function writeServiceInfo() {
  try {
    ensureDir();
    const rows = buildRows();
    writeFileSync(serviceInfoFile, JSON.stringify({
      reportServerUrl,
      reportFile: outputFile,
      updatedAt: report.updatedAt || null,
      totalEntries: Number(report.totalEntries || 0),
      rowCount: rows.length,
      ready: rows.length > 0,
    }, null, 2));
  } catch { }
}

function extractTextMessages(messages) {
  if (!Array.isArray(messages)) return [];
  const out = [];
  for (const msg of messages) {
    if (!msg || msg.role !== 'user') continue;
    if (typeof msg.content === 'string') {
      out.push(msg.content);
    } else if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (block?.type === 'text' && typeof block.text === 'string') out.push(block.text);
      }
    }
  }
  return out;
}

function extractTag(texts, keys) {
  for (const text of texts) {
    for (const key of keys) {
      const re = new RegExp(`\\[${key}\\s*[:=]\\s*([^\\]\\s]+)\\]`, 'i');
      const m = text.match(re);
      if (m?.[1]) return m[1];
    }
  }
  return null;
}

function countToolUses(body) {
  const content = body?.content;
  if (!Array.isArray(content)) return 0;
  let count = 0;
  for (const block of content) {
    if (block?.type === 'tool_use') count++;
  }
  return count;
}

function ensureGroup(groupKey, tags) {
  if (!report.groups[groupKey]) {
    report.groups[groupKey] = {
      ...tags,
      requestCount: 0,
      errorCount: 0,
      durationMsTotal: 0,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheCreationTokens: 0,
      toolUseCount: 0,
      firstSeenAt: null,
      lastSeenAt: null,
    };
  }
  return report.groups[groupKey];
}

function updateGroup(group, entry) {
  group.requestCount += 1;
  group.durationMsTotal += Number(entry.duration || 0);
  if (entry.response?.status >= 400) group.errorCount += 1;

  const usage = entry.response?.body?.usage || {};
  group.inputTokens += Number(usage.input_tokens || 0);
  group.outputTokens += Number(usage.output_tokens || 0);
  group.cacheReadTokens += Number(usage.cache_read_input_tokens || 0);
  group.cacheCreationTokens += Number(usage.cache_creation_input_tokens || 0);
  group.toolUseCount += countToolUses(entry.response?.body);

  const ts = entry.timestamp || new Date().toISOString();
  if (!group.firstSeenAt) group.firstSeenAt = ts;
  group.lastSeenAt = ts;
}

function buildRows() {
  const groups = report?.groups && typeof report.groups === 'object' ? Object.values(report.groups) : [];
  return groups.map((g) => {
    const requestCount = Number(g.requestCount || 0);
    const inputTokens = Number(g.inputTokens || 0);
    const outputTokens = Number(g.outputTokens || 0);
    const cacheReadTokens = Number(g.cacheReadTokens || 0);
    const cacheCreationTokens = Number(g.cacheCreationTokens || 0);
    const durationMsTotal = Number(g.durationMsTotal || 0);
    const toolUseCount = Number(g.toolUseCount || 0);
    const errorCount = Number(g.errorCount || 0);
    return {
      artifact_type: g.artifact_type || 'unknown',
      variant: g.variant || 'unknown',
      teammate: g.teammate || 'main',
      sample_id: g.sample_id || 'unknown',
      requestCount,
      errorCount,
      durationMsTotal,
      avgDurationMs: requestCount > 0 ? durationMsTotal / requestCount : 0,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      cacheReadTokens,
      cacheCreationTokens,
      toolUseCount,
      firstSeenAt: g.firstSeenAt || null,
      lastSeenAt: g.lastSeenAt || null,
    };
  });
}

function buildSummary(rows) {
  const byVariant = {};
  for (const row of rows) {
    const key = `${row.artifact_type}::${row.variant}`;
    if (!byVariant[key]) {
      byVariant[key] = {
        artifact_type: row.artifact_type,
        variant: row.variant,
        groupCount: 0,
        requestCount: 0,
        errorCount: 0,
        durationMsTotal: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        cacheReadTokens: 0,
        cacheCreationTokens: 0,
        toolUseCount: 0,
      };
    }
    const item = byVariant[key];
    item.groupCount += 1;
    item.requestCount += row.requestCount;
    item.errorCount += row.errorCount;
    item.durationMsTotal += row.durationMsTotal;
    item.inputTokens += row.inputTokens;
    item.outputTokens += row.outputTokens;
    item.totalTokens += row.totalTokens;
    item.cacheReadTokens += row.cacheReadTokens;
    item.cacheCreationTokens += row.cacheCreationTokens;
    item.toolUseCount += row.toolUseCount;
  }
  return Object.values(byVariant).map((item) => ({
    ...item,
    avgDurationMs: item.requestCount > 0 ? item.durationMsTotal / item.requestCount : 0,
    errorRate: item.requestCount > 0 ? item.errorCount / item.requestCount : 0,
  })).sort((a, b) => {
    const c1 = a.artifact_type.localeCompare(b.artifact_type);
    if (c1 !== 0) return c1;
    return a.variant.localeCompare(b.variant);
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function filterRows(rows, query = {}) {
  const artifactType = query.artifact_type;
  const variant = query.variant;
  const teammate = query.teammate;
  const sampleId = query.sample_id;
  return rows.filter((row) => {
    if (artifactType && row.artifact_type !== artifactType) return false;
    if (variant && row.variant !== variant) return false;
    if (teammate && row.teammate !== teammate) return false;
    if (sampleId && row.sample_id !== sampleId) return false;
    return true;
  }).sort((a, b) => {
    const c1 = a.artifact_type.localeCompare(b.artifact_type);
    if (c1 !== 0) return c1;
    const c2 = a.variant.localeCompare(b.variant);
    if (c2 !== 0) return c2;
    const c3 = a.teammate.localeCompare(b.teammate);
    if (c3 !== 0) return c3;
    return a.sample_id.localeCompare(b.sample_id);
  });
}

function toPayload(query = {}) {
  loadReport();
  const rows = filterRows(buildRows(), query);
  return {
    updatedAt: report.updatedAt || null,
    totalEntries: Number(report.totalEntries || 0),
    rowCount: rows.length,
    summary: buildSummary(rows),
    rows,
    reportServerUrl,
  };
}

function toHtml(query = {}) {
  const payload = toPayload(query);
  const rowsHtml = payload.summary.map((row) => (
    `<tr><td>${escapeHtml(row.artifact_type)}</td><td>${escapeHtml(row.variant)}</td><td>${row.requestCount}</td><td>${row.errorCount}</td><td>${(row.errorRate * 100).toFixed(2)}%</td><td>${Math.round(row.avgDurationMs)}</td><td>${row.totalTokens}</td><td>${row.cacheReadTokens}</td><td>${row.toolUseCount}</td></tr>`
  )).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><title>Context Engineering Report</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:20px;color:#1f2937}h1{margin:0 0 8px}p{margin:0 0 14px;color:#4b5563}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid #e5e7eb;padding:8px 10px;text-align:left}th{background:#f9fafb}tr:nth-child(even){background:#fcfcfd}a{color:#2563eb;text-decoration:none}</style></head><body><h1>Context Engineering Evaluation Report</h1><p>updatedAt: ${escapeHtml(payload.updatedAt || '-')} · groups: ${payload.summary.length} · entries: ${payload.totalEntries}</p><p>api: <a href="/api/report">/api/report</a></p><table><thead><tr><th>artifact_type</th><th>variant</th><th>requests</th><th>errors</th><th>error rate</th><th>avg ms</th><th>total tokens</th><th>cache read</th><th>tool uses</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
}

async function startReportServer() {
  if (reportServer) return;
  const configuredPort = Number(process.env.CCV_CONTEXT_EVAL_PORT || DEFAULT_REPORT_PORT);
  const preferredPort = Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535
    ? configuredPort
    : DEFAULT_REPORT_PORT;
  const host = '127.0.0.1';
  const boot = (port) => new Promise((resolve, reject) => {
    const srv = createServer((req, res) => {
      try {
        const parsed = new URL(req.url || '/', 'http://127.0.0.1');
        const query = Object.fromEntries(parsed.searchParams.entries());
        if (parsed.pathname === '/api/report') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(toPayload(query)));
          return;
        }
        if (parsed.pathname === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, service: 'context-engineering-evaluator' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(toHtml(query));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    srv.once('error', reject);
    srv.listen(port, host, () => resolve(srv));
  });
  try {
    reportServer = await boot(preferredPort);
  } catch {
    reportServer = await boot(0);
  }
  const address = reportServer.address();
  const port = typeof address === 'object' && address?.port ? address.port : preferredPort;
  reportServerUrl = `http://${host}:${port}`;
  writeServiceInfo();
  console.error(`[context-engineering-evaluator] report service started: ${reportServerUrl}`);
}

async function stopReportServer() {
  if (!reportServer) return;
  await new Promise((resolve) => reportServer.close(() => resolve()));
  reportServer = null;
  reportServerUrl = null;
}

export default {
  name: 'context-engineering-evaluator',
  hooks: {
    async onNewEntry(entry) {
      if (!entry || (!entry.mainAgent && !entry.teammate)) return;
      loadReport();
      report.totalEntries += 1;

      const texts = extractTextMessages(entry.body?.messages);
      const variant = extractTag(texts, ['variant']) || 'unknown';
      const sampleId = extractTag(texts, ['sample_id', 'sample', 'case']) || 'unknown';
      const artifactType = extractTag(texts, ['artifact_type']) || 'unknown';
      const teammate = entry.teammate || 'main';
      const groupKey = `${artifactType}::${variant}::${teammate}::${sampleId}`;

      const group = ensureGroup(groupKey, { artifact_type: artifactType, variant, teammate, sample_id: sampleId });
      updateGroup(group, entry);
      saveReport();
      if (!announcedReady) {
        announcedReady = true;
        console.error(`[context-engineering-evaluator] report ready: ${reportServerUrl || 'http://127.0.0.1:7799'}`);
      }
    },
    async reportData({ query = {} } = {}) {
      return toPayload(query);
    },
    async reportPage({ query = {} } = {}) {
      return {
        html: toHtml(query),
      };
    },
    async serverStarted() {
      await startReportServer();
    },
    async serverStopping() {
      await stopReportServer();
    },
  },
};
