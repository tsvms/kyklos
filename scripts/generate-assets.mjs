// Generates every Kyklos brand asset from code — no downloads, no image tools.
// The ring geometry matches components/RingMark.tsx.
//   node scripts/generate-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const PAPER = [0xf6, 0xf3, 0xee, 255];
const CHARCOAL = [0x0e, 0x0c, 0x0b, 255];
const TERRACOTTA = [0xe0, 0x59, 0x2f, 255];
const TERRACOTTA_DARK = [0xff, 0x70, 0x43, 255];
const WHITE = [255, 255, 255, 255];
const CLEAR = [0, 0, 0, 0];

// ——— PNG encoding ———
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ——— the ring ———
// Arc starts at -70° (SVG convention: clockwise, 0° = 3 o'clock) and covers
// 91% of the circle, leaving a small opening near 12 o'clock. Round caps.
const START = (-70 * Math.PI) / 180;
const SWEEP = 2 * Math.PI * 0.91;

function ringCoverage(px, py, cx, cy, r, stroke) {
  const half = stroke / 2;
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);
  let a = Math.atan2(dy, dx) - START;
  a = ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (a <= SWEEP && Math.abs(dist - r) <= half) return true;
  for (const ang of [START, START + SWEEP]) {
    const ex = cx + r * Math.cos(ang);
    const ey = cy + r * Math.sin(ang);
    if (Math.hypot(px - ex, py - ey) <= half) return true;
  }
  return false;
}

/**
 * size: canvas px; ringDiameter: outer diameter as a fraction of the canvas.
 * 4×4 supersampling for smooth edges.
 */
function render({ size, bg, fg, ringDiameter, strokeRatio = 0.14 }) {
  const buf = Buffer.alloc(size * size * 4);
  const outer = size * ringDiameter;
  const stroke = outer * strokeRatio;
  const r = (outer - stroke) / 2;
  const c = size / 2;
  const S = 4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < S; sy++)
        for (let sx = 0; sx < S; sx++)
          if (ringCoverage(x + (sx + 0.5) / S, y + (sy + 0.5) / S, c, c, r, stroke)) hits++;
      const t = hits / (S * S);
      // Composite fg over bg (straight alpha).
      const fa = (fg[3] / 255) * t;
      const ba = bg[3] / 255;
      const oa = fa + ba * (1 - fa);
      const i = (y * size + x) * 4;
      for (let k = 0; k < 3; k++) {
        buf[i + k] = oa === 0 ? 0 : Math.round((fg[k] * fa + bg[k] * ba * (1 - fa)) / oa);
      }
      buf[i + 3] = Math.round(oa * 255);
    }
  }
  return encodePNG(size, size, buf);
}

mkdirSync('assets', { recursive: true });
const out = (name, opts) => {
  writeFileSync(`assets/${name}`, render(opts));
  console.log('wrote assets/' + name);
};

// iOS + legacy icon: full-bleed paper square (the OS rounds the corners).
out('icon.png', { size: 1024, bg: PAPER, fg: TERRACOTTA, ringDiameter: 0.56 });
// Android adaptive foreground: ring inside the 66% safe zone, transparent.
out('adaptive-icon.png', { size: 1024, bg: CLEAR, fg: TERRACOTTA, ringDiameter: 0.4 });
// Android 13+ themed icon: white silhouette.
out('adaptive-icon-monochrome.png', { size: 1024, bg: CLEAR, fg: WHITE, ringDiameter: 0.4 });
// Splash marks (background colour comes from app.json).
out('splash-icon.png', { size: 512, bg: CLEAR, fg: TERRACOTTA, ringDiameter: 0.9 });
out('splash-icon-dark.png', { size: 512, bg: CLEAR, fg: TERRACOTTA_DARK, ringDiameter: 0.9 });
// Android status-bar icon: 96×96 white on transparent, slightly heavier stroke.
out('notification-icon.png', { size: 96, bg: CLEAR, fg: WHITE, ringDiameter: 0.8, strokeRatio: 0.18 });
out('favicon.png', { size: 48, bg: PAPER, fg: TERRACOTTA, ringDiameter: 0.7, strokeRatio: 0.18 });
// Store listing preview on charcoal (not referenced by app.json).
out('icon-dark-preview.png', { size: 512, bg: CHARCOAL, fg: TERRACOTTA_DARK, ringDiameter: 0.56 });
