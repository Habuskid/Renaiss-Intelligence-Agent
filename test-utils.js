import { parseHref } from './src/utils/parseHref.js';
import { formatUSD } from './src/utils/formatters.js';
import assert from 'assert';

console.log('Running test suite for utilities...');

try {
  // Test parseHref
  const parsed = parseHref('/card/pokemon/base1/4/psa10');
  assert.strictEqual(parsed.game, 'pokemon');
  assert.strictEqual(parsed.set, 'base1');
  assert.strictEqual(parsed.card, '4');
  console.log('✅ parseHref works correctly.');

  // Test formatUSD
  const formatted = formatUSD(50050);
  assert.strictEqual(formatted, '$501');
  console.log('✅ formatUSD works correctly.');

  console.log('All tests passed!');
} catch (e) {
  console.error('❌ Test failed:', e.message);
  process.exit(1);
}
