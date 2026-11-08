#!/usr/bin/env node

const registry = 'https://reactbits.dev/r/';

async function fetchRegistry(file) {
  const response = await fetch(`${registry}${file}.json`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Official React Bits registry returned HTTP ${response.status} for ${file}`);
  return response.json();
}

function summarize(item) {
  return {
    name: item.name,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files: (item.files ?? []).map(file => file.path),
  };
}

async function main([command, ...parts]) {
  if (command === '--help' || command === undefined) {
    console.log('Usage: registry.mjs search <keywords> | view <exact-component-name>');
    return;
  }

  if (command === 'search' && parts.length) {
    const words = parts.join(' ').trim().toLowerCase().split(/\s+/);
    const { items } = await fetchRegistry('registry');
    if (!Array.isArray(items)) throw new Error('Official registry index has no item list');
    const matches = items.filter(item => {
      const text = [item.name, item.title, item.description].join(' ').toLowerCase();
      return words.every(word => text.includes(word));
    });
    console.log(JSON.stringify({ matches: matches.length, results: matches.slice(0, 25).map(summarize) }, null, 2));
    return;
  }

  if (command === 'view' && parts.length === 1) {
    const name = parts[0].replace(/^@react-bits\//, '');
    if (!/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(name)) throw new Error('Use an exact registry component name');
    const item = await fetchRegistry(name);
    if (item.name !== name || !Array.isArray(item.files)) {
      throw new Error(`Official registry did not return the requested component: ${name}`);
    }
    console.log(JSON.stringify(summarize(item), null, 2));
    return;
  }

  throw new Error('Usage: registry.mjs search <keywords> | view <exact-component-name>');
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  console.error(`react-skills: ${error.message}`);
  process.exitCode = 1;
}
