import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const width = 1200;
const height = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07111f"/>
      <stop offset="62%" stop-color="#0d1b2f"/>
      <stop offset="100%" stop-color="#134e4a"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0.08"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000000" flood-opacity="0.34"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <path d="M96 114H1104V516H96Z" rx="42" fill="url(#panel)" stroke="#2dd4bf" stroke-opacity="0.22" filter="url(#shadow)"/>

  <text x="132" y="166" fill="#8dede1" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">
    KARBURANTI SOT
  </text>
  <text x="132" y="270" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="82" font-weight="800">
    Fuel Today
  </text>
  <text x="132" y="332" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="600">
    Live fuel prices, trends, rankings and nearby stations
  </text>

  <g transform="translate(132 398)">
    <rect x="0" y="0" width="196" height="72" rx="22" fill="#0f766e"/>
    <text x="24" y="45" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">Diesel</text>
    <text x="108" y="45" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">EUR/L</text>

    <rect x="216" y="0" width="216" height="72" rx="22" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="240" y="45" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">Europe map</text>

    <rect x="452" y="0" width="210" height="72" rx="22" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.14"/>
    <text x="476" y="45" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">30-day trends</text>
  </g>

  <g transform="translate(810 148)">
    <rect x="0" y="0" width="244" height="306" rx="34" fill="#07111f" stroke="#2dd4bf" stroke-opacity="0.28"/>
    <rect x="24" y="32" width="196" height="48" rx="16" fill="#2dd4bf" fill-opacity="0.16"/>
    <rect x="24" y="104" width="196" height="24" rx="12" fill="#ffffff" fill-opacity="0.16"/>
    <rect x="24" y="144" width="150" height="24" rx="12" fill="#ffffff" fill-opacity="0.10"/>
    <rect x="24" y="196" width="196" height="72" rx="20" fill="#2dd4bf" fill-opacity="0.12"/>
    <path d="M42 240 C72 210 100 250 130 220 C158 192 184 214 204 188" fill="none" stroke="#2dd4bf" stroke-width="8" stroke-linecap="round"/>
  </g>

  <text x="132" y="560" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600">
    karburantisot.com
  </text>
</svg>`;

const outPath = resolve("public", "og.png");
writeFileSync(resolve("public", "og-source.svg"), svg);
await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(outPath);
console.log(`Wrote ${outPath}`);
