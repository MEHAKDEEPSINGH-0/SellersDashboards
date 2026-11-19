import test from 'node:test';
import assert from 'node:assert';
import { generateProductId, formatDate } from '../src/utils/helpers.js';

test('generateProductId generates unique IDs starting with PRD-', () => {
  const id1 = generateProductId();
  const id2 = generateProductId();
  assert.ok(id1.startsWith('PRD-'), 'ID 1 should start with PRD-');
  assert.ok(id2.startsWith('PRD-'), 'ID 2 should start with PRD-');
  assert.notStrictEqual(id1, id2, 'Generated IDs should be unique');
});

test('formatDate formats timestamps gracefully', () => {
  const result = formatDate(new Date().toISOString());
  assert.ok(result.length > 0, 'Formatted date should not be empty');
  assert.strictEqual(formatDate(null), 'Just now');
});
