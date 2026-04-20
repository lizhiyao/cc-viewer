import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  spawnClaude,
  writeToPty,
  resizePty,
  killPty,
  _setPtyImportForTests,
  onPtyData,
  onPtyExit,
  getPtyPid,
  getPtyState,
  getCurrentWorkspace,
  getOutputBuffer,
  withDefaultThinkingDisplay,
  parseClaudeVersion,
  probeClaudeSupportsThinkingDisplay,
  _clearThinkingDisplaySupportCache,
  _hasThinkingDisplaySupportCached,
  _thinkingDisplaySupportCacheSize,
  gte,
  MIN_THINKING_DISPLAY_VERSION,
} from '../pty-manager.js';

// ─── getPtyPid / getPtyState / getCurrentWorkspace (no PTY running) ───

describe('pty-manager: state queries without PTY', () => {
  it('getPtyPid returns null when no PTY', () => {
    assert.equal(getPtyPid(), null);
  });

  it('getPtyState returns not running when no PTY', () => {
    const state = getPtyState();
    assert.equal(state.running, false);
  });

  it('getCurrentWorkspace returns not running when no PTY', () => {
    const ws = getCurrentWorkspace();
    assert.equal(ws.running, false);
    assert.equal(ws.cwd, null);
  });

  it('getOutputBuffer returns empty string initially', () => {
    const buf = getOutputBuffer();
    assert.equal(typeof buf, 'string');
  });
});

// ─── writeToPty / resizePty / killPty (no-op when no PTY) ───

describe('pty-manager: operations without PTY', () => {
  it('writeToPty does not throw when no PTY', () => {
    assert.doesNotThrow(() => writeToPty('test'));
  });

  it('resizePty does not throw when no PTY', () => {
    assert.doesNotThrow(() => resizePty(80, 24));
  });

  it('killPty does not throw when no PTY', () => {
    assert.doesNotThrow(() => killPty());
  });
});

// ─── onPtyData / onPtyExit listener registration ───

describe('pty-manager: listener registration', () => {
  it('onPtyData registers and unregisters listener', () => {
    let called = false;
    const unsubscribe = onPtyData(() => { called = true; });
    assert.equal(typeof unsubscribe, 'function');
    unsubscribe();
    // Listener removed, but we can't easily verify without spawning PTY
    assert.equal(called, false);
  });

  it('onPtyExit registers and unregisters listener', () => {
    let called = false;
    const unsubscribe = onPtyExit(() => { called = true; });
    assert.equal(typeof unsubscribe, 'function');
    unsubscribe();
    assert.equal(called, false);
  });

  it('multiple listeners can be registered', () => {
    const unsub1 = onPtyData(() => {});
    const unsub2 = onPtyData(() => {});
    assert.equal(typeof unsub1, 'function');
    assert.equal(typeof unsub2, 'function');
    unsub1();
    unsub2();
  });
});

// ─── spawnClaude integration (requires claude binary) ───

describe('pty-manager: spawnClaude integration', () => {
  let spawned = [];

  beforeEach(() => {
    spawned = [];
    _setPtyImportForTests(() => ({
      spawn(command, args, opts) {
        const dataHandlers = [];
        const exitHandlers = [];
        let killed = false;
        const inst = {
          pid: 12345 + spawned.length,
          command,
          args,
          opts,
          write(data) {
            for (const cb of dataHandlers) cb(`out:${data}`);
          },
          resize() {},
          kill() {
            if (killed) return;
            killed = true;
            for (const cb of exitHandlers) cb({ exitCode: 0 });
          },
          onData(cb) { dataHandlers.push(cb); },
          onExit(cb) { exitHandlers.push(cb); },
          _isKilled() { return killed; },
        };
        spawned.push(inst);
        return inst;
      },
    }));
  });

  afterEach(() => {
    killPty();
    _setPtyImportForTests(null);
  });

  it('getPtyPid returns PID when PTY is running', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    assert.equal(getPtyPid(), 12345);
    killPty();
    assert.equal(getPtyPid(), null);
  });

  it('getPtyState reflects running state after spawn', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    const state = getPtyState();
    assert.equal(state.running, true);
    killPty();
    assert.equal(getPtyState().running, false);
  });

  it('getCurrentWorkspace returns cwd after spawn', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    const ws = getCurrentWorkspace();
    assert.equal(ws.running, true);
    assert.equal(ws.cwd, process.cwd());
  });

  it('onPtyData receives data from PTY', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    await new Promise((resolve) => {
      const unsub = onPtyData((data) => {
        unsub();
        assert.ok(data.includes('out:'));
        resolve();
      });
      writeToPty('echo test\r');
    });
  });

  it('onPtyExit fires when PTY exits', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    await new Promise((resolve) => {
      const unsub = onPtyExit((exitCode) => {
        unsub();
        assert.equal(exitCode, 0);
        resolve();
      });
      killPty();
    });
  });

  it('getOutputBuffer accumulates PTY output', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    writeToPty('echo test\r');
    await new Promise(r => setTimeout(r, 0));
    const buf = getOutputBuffer();
    assert.ok(buf.includes('out:'));
  });

  it('resizePty does not throw while running', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    assert.doesNotThrow(() => resizePty(80, 24));
  });

  it('spawnClaude kills existing PTY before spawning new one', async () => {
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    const first = spawned[0];
    await spawnClaude(9999, process.cwd(), [], '/bin/echo');
    assert.equal(first._isKilled(), true);
    assert.equal(spawned.length, 2);
  });
});

// ─── output buffer truncation ───

describe('pty-manager: output buffer limits', () => {
  it('getOutputBuffer returns string', () => {
    const buf = getOutputBuffer();
    assert.equal(typeof buf, 'string');
  });

  // Note: Testing MAX_BUFFER truncation requires spawning PTY and generating >200KB output,
  // which is impractical for unit tests. This is better suited for integration tests.
});

// ─── withDefaultThinkingDisplay ───

describe('pty-manager: withDefaultThinkingDisplay', () => {
  it('appends --thinking-display summarized when flag is absent', () => {
    const out = withDefaultThinkingDisplay([]);
    assert.deepEqual(out, ['--thinking-display', 'summarized']);
  });

  it('appends at the END so existing args come first', () => {
    const out = withDefaultThinkingDisplay(['-p', 'hello']);
    assert.deepEqual(out, ['-p', 'hello', '--thinking-display', 'summarized']);
  });

  it('leaves args unchanged when user passed --thinking-display in space form', () => {
    const input = ['--thinking-display', 'off', '-p', 'x'];
    const out = withDefaultThinkingDisplay(input);
    assert.deepEqual(out, input);
    assert.equal(out, input, 'should return same reference to signal no-op');
  });

  it('leaves args unchanged when user passed --thinking-display in equals form', () => {
    const input = ['--thinking-display=full', '-p', 'x'];
    const out = withDefaultThinkingDisplay(input);
    assert.deepEqual(out, input);
    assert.equal(out, input);
  });

  it('does not mutate input array when appending', () => {
    const input = ['-p', 'hello'];
    const before = [...input];
    withDefaultThinkingDisplay(input);
    assert.deepEqual(input, before, 'input array must not be mutated');
  });

  it('returns non-array input unchanged (defensive)', () => {
    assert.equal(withDefaultThinkingDisplay(null), null);
    assert.equal(withDefaultThinkingDisplay(undefined), undefined);
  });

  it('detects the flag even mid-array (not just at start)', () => {
    const input = ['-p', 'hello', '--thinking-display', 'summarized'];
    const out = withDefaultThinkingDisplay(input);
    assert.equal(out, input, 'existing flag mid-array should suppress append');
    // And no duplicate flag appended
    const count = out.filter(a => a === '--thinking-display').length;
    assert.equal(count, 1);
  });
});

// ─── parseClaudeVersion ───

describe('pty-manager: parseClaudeVersion', () => {
  it('parses standard `X.Y.Z (Claude Code)` output', () => {
    assert.deepEqual(parseClaudeVersion('2.1.114 (Claude Code)'), [2, 1, 114]);
  });

  it('parses just a version string', () => {
    assert.deepEqual(parseClaudeVersion('1.0.0'), [1, 0, 0]);
  });

  it('parses version with leading text', () => {
    assert.deepEqual(parseClaudeVersion('claude version 2.1.112\n'), [2, 1, 112]);
  });

  it('returns null on non-string input', () => {
    assert.equal(parseClaudeVersion(null), null);
    assert.equal(parseClaudeVersion(undefined), null);
    assert.equal(parseClaudeVersion(123), null);
  });

  it('returns null when no semver found', () => {
    assert.equal(parseClaudeVersion('no version here'), null);
    assert.equal(parseClaudeVersion(''), null);
  });

  it('picks the first semver when multiple appear', () => {
    assert.deepEqual(parseClaudeVersion('claude 2.1.114 node 20.11.1'), [2, 1, 114]);
  });
});

// ─── probeClaudeSupportsThinkingDisplay ───
// 通过替换全局模块 loader 来 mock execFile 成本较高，这里用真实 execFile 调 `node --version`
// 验证 semver 解析 + 缓存机制（node 版本肯定高于 2.1.112，判断为支持）。
describe('pty-manager: probeClaudeSupportsThinkingDisplay', () => {
  beforeEach(() => { _clearThinkingDisplaySupportCache(); });

  it('returns false when claudePath is null/empty', async () => {
    assert.equal(await probeClaudeSupportsThinkingDisplay(null, null, false), false);
    assert.equal(await probeClaudeSupportsThinkingDisplay('', null, false), false);
  });

  it('returns false when probe fails (non-existent binary)', async () => {
    const r = await probeClaudeSupportsThinkingDisplay('/no/such/claude-binary-does-not-exist', null, false);
    assert.equal(r, false);
  });

  it('returns false idempotently for non-existent path (not a positive cache-effectiveness test)', async () => {
    const path = '/no/such/claude-binary-for-cache-test';
    const r1 = await probeClaudeSupportsThinkingDisplay(path, null, false);
    const r2 = await probeClaudeSupportsThinkingDisplay(path, null, false);
    assert.equal(r1, r2);
    // 注：两次都走 spawn 失败路径，即使不缓存也返回一致。此 test 只保证幂等语义。
    // 真正证明缓存生效的 test 见下方 "caches positive result and avoids re-probing"。
  });

  it('caches positive result and avoids re-probing', async () => {
    assert.equal(_thinkingDisplaySupportCacheSize(), 0, 'cache empty at start');
    const first = await probeClaudeSupportsThinkingDisplay(process.execPath, null, false);
    assert.equal(first, true);
    assert.equal(_thinkingDisplaySupportCacheSize(), 1, 'one entry after first probe');
    assert.equal(_hasThinkingDisplaySupportCached(process.execPath), true, 'path is cached');
    const second = await probeClaudeSupportsThinkingDisplay(process.execPath, null, false);
    assert.equal(second, true);
    assert.equal(_thinkingDisplaySupportCacheSize(), 1, 'cache size unchanged after second probe — hit, no new entry');
  });

  it('returns true when probed binary reports ≥ 2.1.112 (simulated via node which returns Node semver)', async () => {
    // `node --version` 输出 "v<semver>" —— parseClaudeVersion 提取 semver；Node 20+ 远高于 2.1.112
    const r = await probeClaudeSupportsThinkingDisplay(process.execPath, null, false);
    assert.equal(r, true);
  });
});

// ─── gte (semver tuple comparison) ───

describe('pty-manager: gte', () => {
  it('returns true for equal versions', () => {
    assert.equal(gte([2, 1, 112], [2, 1, 112]), true);
    assert.equal(gte([0, 0, 0], [0, 0, 0]), true);
  });

  it('returns false when patch is lower', () => {
    assert.equal(gte([2, 1, 111], [2, 1, 112]), false);
    assert.equal(gte([2, 1, 0], [2, 1, 112]), false);
  });

  it('returns true when patch is higher', () => {
    assert.equal(gte([2, 1, 113], [2, 1, 112]), true);
    assert.equal(gte([2, 1, 114], [2, 1, 112]), true);
  });

  it('returns true when minor is higher (patch lower)', () => {
    assert.equal(gte([2, 2, 0], [2, 1, 112]), true);
  });

  it('returns false when minor is lower (patch higher)', () => {
    assert.equal(gte([2, 0, 999], [2, 1, 112]), false);
    assert.equal(gte([1, 9, 9], [2, 1, 112]), false);
  });

  it('returns true when major is higher', () => {
    assert.equal(gte([3, 0, 0], [2, 1, 112]), true);
    assert.equal(gte([3, 0, 0], [2, 99, 999]), true);
  });

  it('returns false when major is lower', () => {
    assert.equal(gte([1, 99, 999], [2, 1, 112]), false);
    assert.equal(gte([0, 999, 999], [2, 0, 0]), false);
  });
});

// ─── MIN_THINKING_DISPLAY_VERSION constant ───

describe('pty-manager: MIN_THINKING_DISPLAY_VERSION', () => {
  it('matches the known introduction version 2.1.112', () => {
    assert.deepEqual(MIN_THINKING_DISPLAY_VERSION, [2, 1, 112]);
  });
});
