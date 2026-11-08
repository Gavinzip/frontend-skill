#!/usr/bin/env node
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, isAbsolute, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(join(root, 'references/figures.json'), 'utf8'));
const [command = 'list', ...args] = process.argv.slice(2);
const find = name => {
  const entry = catalog.find(item => item.name.toLowerCase() === name?.toLowerCase());
  if (!entry) throw new Error(`Unknown figure: ${name}. Run list to see the catalog.`);
  return entry;
};
const describe = item => `${item.name} (${item.component})\n  ${item.description}\n  Intensity: ${item.intensity}`;

try {
  if (command === 'list') {
    console.log(catalog.map(describe).join('\n\n'));
  } else if (command === 'search') {
    const query = args.join(' ').trim().toLowerCase();
    if (!query) throw new Error('Usage: search <meaning or name>');
    const matches = catalog.filter(item => Object.values(item).join(' ').toLowerCase().includes(query));
    console.log(matches.length ? matches.map(describe).join('\n\n') : 'No built-in match. Review the full catalog before choosing a custom illustration.');
  } else if (command === 'show') {
    console.log(describe(find(args[0])));
  } else if (command === 'snippet') {
    const item = find(args[0]);
    if (args.includes('--vanilla')) {
      console.log(`import { ${item.name} } from '@lucasmarkes/hairline';\nconst figure = ${item.name}(hostElement, { intensity: 0.35, play: false, label: ${JSON.stringify(item.description)} });\n// On unmount:\nfigure.destroy();`);
    } else {
      console.log(`import { ${item.component} } from '@lucasmarkes/hairline/react';\n<${item.component} intensity={0.35} play={false} aria-label=${JSON.stringify(item.description)} />`);
    }
  } else if (command === 'verify') {
    const manifest = JSON.parse(await readFile(join(root, 'references/source-manifest.json'), 'utf8'));
    for (const [path, expected] of Object.entries(manifest.files)) {
      const bytes = await readFile(join(root, path));
      if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Hash mismatch: ${path}`);
    }
    const library = await import(pathToFileURL(join(root, 'assets/hairline/dist/index.js')).href);
    if (Object.keys(library).length !== catalog.length || catalog.length !== 33) throw new Error('Catalog/export count mismatch');
    for (const item of catalog) if (typeof library[item.name] !== 'function') throw new Error(`Missing function: ${item.name}`);
    const map = JSON.parse(await readFile(join(root, 'assets/hairline/dist/index.js.map'), 'utf8'));
    if (!map.sourcesContent?.length || map.sourcesContent.some(source => source === null)) throw new Error('Original sources missing from source map');
    console.log(`Verified ${Object.keys(manifest.files).length} upstream hashes, ${catalog.length} figure exports, and ${map.sourcesContent.length} original sources. Browser review remains separate.`);
  } else if (command === 'preview') {
    const index = args.indexOf('--out');
    const output = args[index + 1];
    if (index < 0 || !output || !isAbsolute(output)) throw new Error('Usage: preview --out <absolute-review-directory>');
    const files = {
      'index.html': await readFile(join(root, 'assets/gallery.html')),
      'hairline.js': await readFile(join(root, 'assets/hairline/dist/index.js')),
      'index.js.map': await readFile(join(root, 'assets/hairline/dist/index.js.map')),
      'figures.json': JSON.stringify(catalog, null, 2),
      'LICENSE': await readFile(join(root, 'assets/hairline/LICENSE')),
    };
    // Refuse existing destinations: review artifacts are not implicitly disposable.
    await mkdir(output, { recursive: false });
    for (const [name, content] of Object.entries(files)) await writeFile(join(output, name), content, { flag: 'wx' });
    console.log(`Offline gallery written to ${output}\nServe: python3 -m http.server 4332 --bind 127.0.0.1 --directory '${output.replaceAll("'", "'\\''")}'`);
  } else throw new Error('Commands: list | search <query> | show <name> | snippet <name> [--react|--vanilla] | verify | preview --out <absolute-directory>');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
