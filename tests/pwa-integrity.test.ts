import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA, Manifest & Service Worker Integrity Suite', () => {
  const rootDir = process.cwd();
  const manifestPath = path.join(rootDir, 'public', 'manifest.json');
  const swPath = path.join(rootDir, 'public', 'service-worker.js');
  const icon192Path = path.join(rootDir, 'public', 'icons', 'icon-192.svg');
  const icon512Path = path.join(rootDir, 'public', 'icons', 'icon-512.svg');
  const indexHtmlPath = path.join(rootDir, 'index.html');

  test('Web App Manifest exists, parses as valid JSON, and meets PWA installability requirements', () => {
    assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist in public directory');
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    assert.ok(manifest.name && manifest.name.length > 0, 'Manifest must have a non-empty name');
    assert.ok(manifest.short_name && manifest.short_name.length > 0, 'Manifest must have a short_name');
    assert.equal(manifest.start_url, '/', 'start_url must be /');
    assert.equal(manifest.display, 'standalone', 'display must be standalone');
    assert.ok(manifest.theme_color, 'theme_color must be defined');
    assert.ok(manifest.background_color, 'background_color must be defined');

    assert.ok(Array.isArray(manifest.icons), 'Manifest must contain icons array');
    assert.ok(manifest.icons.length >= 2, 'Manifest must have at least 2 icon declarations');

    const has192 = manifest.icons.some((i: any) => i.sizes === '192x192' && i.src.includes('192'));
    const has512 = manifest.icons.some((i: any) => i.sizes === '512x512' && i.src.includes('512'));
    assert.ok(has192, 'Manifest must declare 192x192 icon');
    assert.ok(has512, 'Manifest must declare 512x512 icon');
  });

  test('Local PWA icon files exist on disk and contain valid SVG markup', () => {
    assert.ok(fs.existsSync(icon192Path), 'icon-192.svg must exist');
    assert.ok(fs.existsSync(icon512Path), 'icon-512.svg must exist');

    const svg192 = fs.readFileSync(icon192Path, 'utf8');
    const svg512 = fs.readFileSync(icon512Path, 'utf8');

    assert.ok(svg192.includes('<svg') && svg192.includes('</svg>'), 'icon-192.svg must be valid SVG markup');
    assert.ok(svg512.includes('<svg') && svg512.includes('</svg>'), 'icon-512.svg must be valid SVG markup');
    assert.ok(svg192.includes('viewBox'), 'icon-192.svg must include viewBox attribute');
    assert.ok(svg512.includes('viewBox'), 'icon-512.svg must include viewBox attribute');
  });

  test('Service worker script implements dynamic asset caching and versioned cache cleanup', () => {
    assert.ok(fs.existsSync(swPath), 'service-worker.js must exist in public directory');
    const swContent = fs.readFileSync(swPath, 'utf8');

    // Versioned cache name
    assert.match(swContent, /ai-career-mentor-v9-shell/, 'SW must use versioned cache identifier');

    // Event listeners
    assert.ok(swContent.includes("addEventListener('install'"), 'SW must handle install event');
    assert.ok(swContent.includes("addEventListener('activate'"), 'SW must handle activate event');
    assert.ok(swContent.includes("addEventListener('fetch'"), 'SW must handle fetch event');

    // Bypass rules
    assert.ok(swContent.includes('/api/'), 'SW must strictly bypass /api/ endpoints');
    assert.ok(swContent.includes('request.method !== \'GET\''), 'SW must only cache GET requests');

    // Offline app shell & asset caching
    assert.ok(swContent.includes('navigate'), 'SW must handle navigate requests');
    assert.ok(swContent.includes('/assets/'), 'SW must dynamically handle built /assets/ bundles');
    assert.ok(swContent.includes('caches.delete'), 'SW must purge obsolete versioned caches on activation');
  });

  test('HTML entrypoint links manifest, icons, theme-color, and mobile meta tags', () => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    assert.ok(html.includes('rel="manifest" href="/manifest.json"'), 'index.html must link manifest.json');
    assert.ok(html.includes('href="/icons/icon-192.svg"'), 'index.html must link icon-192.svg');
    assert.ok(html.includes('name="theme-color"'), 'index.html must specify theme-color');
    assert.ok(html.includes('name="apple-mobile-web-app-capable"'), 'index.html must specify apple-mobile-web-app-capable');
  });
});
