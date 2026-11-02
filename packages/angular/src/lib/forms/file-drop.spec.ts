import { primalFileSize } from './file-drop';

describe('primalFileSize', () => {
  it('says a size the way a person reads it', () => {
    expect(primalFileSize(512)).toBe('512 B');
    expect(primalFileSize(1536)).toBe('1.5 KB');
    expect(primalFileSize(240_000)).toBe('234 KB');
    expect(primalFileSize(1_800_000)).toBe('1.7 MB');
  });
});
