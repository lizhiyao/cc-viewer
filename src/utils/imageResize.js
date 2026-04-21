// 图片上传前尺寸压缩：任意一边超过 maxDim 时，按比例缩放至 maxDim 以内。
// 非图片 / 不支持的格式 / 解码失败时，原样返回。

const RESIZABLE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

// 优先保留原格式；对超出画布上限的 PNG 回退到 JPEG 以降体积。
function pickOutputType(inputType) {
  if (inputType === 'image/jpg') return 'image/jpeg';
  if (RESIZABLE_TYPES.has(inputType)) return inputType;
  return 'image/jpeg';
}

function loadImageBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file).catch(() => loadViaImgElement(file));
  }
  return loadViaImgElement(file);
}

function loadViaImgElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      type,
      quality,
    );
  });
}

export async function resizeImageIfNeeded(file, maxDim = 2000) {
  if (!file || typeof file !== 'object') return file;
  const type = (file.type || '').toLowerCase();
  if (!type.startsWith('image/')) return file;
  if (!RESIZABLE_TYPES.has(type)) return file;

  let source;
  try {
    source = await loadImageBitmap(file);
  } catch {
    return file;
  }

  const srcW = source.width || source.naturalWidth;
  const srcH = source.height || source.naturalHeight;
  if (!srcW || !srcH) {
    try { source.close?.(); } catch {}
    return file;
  }

  const maxSide = Math.max(srcW, srcH);
  if (maxSide <= maxDim) {
    try { source.close?.(); } catch {}
    return file;
  }

  const scale = maxDim / maxSide;
  const dstW = Math.max(1, Math.round(srcW * scale));
  const dstH = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = dstW;
  canvas.height = dstH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    try { source.close?.(); } catch {}
    return file;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  try {
    ctx.drawImage(source, 0, 0, dstW, dstH);
  } catch {
    try { source.close?.(); } catch {}
    return file;
  }
  try { source.close?.(); } catch {}

  const outType = pickOutputType(type);
  const quality = outType === 'image/png' ? undefined : 0.92;

  let blob;
  try {
    blob = await canvasToBlob(canvas, outType, quality);
  } catch {
    return file;
  }

  if (blob.size >= file.size) return file;

  const nameOut = renameForType(file.name || 'image', outType);
  return new File([blob], nameOut, { type: outType, lastModified: Date.now() });
}

function renameForType(originalName, outType) {
  const ext = outType === 'image/jpeg' ? 'jpg'
    : outType === 'image/png' ? 'png'
    : outType === 'image/webp' ? 'webp'
    : 'img';
  const dot = originalName.lastIndexOf('.');
  const stem = dot > 0 ? originalName.slice(0, dot) : originalName;
  return `${stem}.${ext}`;
}
