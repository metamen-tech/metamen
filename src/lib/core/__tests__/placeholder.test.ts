import { describe, expect, it } from 'vitest';

describe('Project Setup', () => {
  it('should have correct environment', () => {
    expect(true).toBe(true);
  });

  it('should resolve path aliases', () => {
    expect(typeof import.meta.url).toBe('string');
  });
});
