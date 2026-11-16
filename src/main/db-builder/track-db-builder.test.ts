/**
 * @jest-environment node
 */
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import buildTrackDb, { loadTrackDb } from './track-db-builder';

jest.mock('../playlist-loader/music-tag-loader', () => ({
  __esModule: true,
  default: jest.fn(async (file: string, id: number) => {
    if (file.includes('broken')) throw new Error('broken file');
    return [
      {
        id,
        title: path.basename(file),
        url: file,
        duration: 0,
        hasImage: true,
        artist: ['A'],
        genre: [],
      },
      Buffer.from('png'),
    ];
  }),
}));

describe('buildTrackDb', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'juricane-'));
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('builds the db and returns the track count, skipping broken files', async () => {
    await fs.writeFile(path.join(dir, 'a.mp3'), '');
    await fs.writeFile(path.join(dir, 'b.mp3'), '');
    await fs.writeFile(path.join(dir, 'broken.mp3'), '');
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const count = await buildTrackDb(dir, [], []);

    expect(count).toBe(2);
    const db = await loadTrackDb(dir);
    expect(db.tracks).toHaveLength(2);
    expect(await fs.readdir(path.join(dir, '.trackimages'))).toHaveLength(2);
    expect((await fs.readdir(dir)).sort()).toEqual(
      ['.trackimages', 'a.mp3', 'b.mp3', 'broken.mp3', 'trackdb.json'].sort()
    );
  });

  it('picks up new files and drops stale images on rebuild', async () => {
    await fs.writeFile(path.join(dir, 'a.mp3'), '');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(await buildTrackDb(dir, [], [])).toBe(1);

    await fs.writeFile(path.join(dir, 'b.mp3'), '');
    await fs.rm(path.join(dir, 'a.mp3'));
    await fs.writeFile(path.join(dir, 'c.mp3'), '');
    expect(await buildTrackDb(dir, [], [])).toBe(2);
    expect(await fs.readdir(path.join(dir, '.trackimages'))).toHaveLength(2);
  });

  it('keeps the existing trackdb.json when the build fails', async () => {
    const dbFile = path.join(dir, 'trackdb.json');
    await fs.writeFile(dbFile, '{"old":true}');

    await expect(
      buildTrackDb(path.join(dir, 'does-not-exist'), [], [])
    ).rejects.toThrow();

    // Fehler beim Schreiben der Datenbank: trackdb.json ist ein Verzeichnis
    const dir2 = await fs.mkdtemp(path.join(os.tmpdir(), 'juricane-'));
    try {
      await fs.writeFile(path.join(dir2, 'a.mp3'), '');
      await fs.writeFile(path.join(dir2, 'trackdb.json'), 'old');
      await fs.mkdir(path.join(dir2, 'trackdb.json.tmp'));
      await expect(buildTrackDb(dir2, [], [])).rejects.toThrow();
      expect(await fs.readFile(path.join(dir2, 'trackdb.json'), 'utf8')).toBe(
        'old'
      );
    } finally {
      await fs.rm(dir2, { recursive: true, force: true });
    }
    expect(await fs.readFile(dbFile, 'utf8')).toBe('{"old":true}');
  });
});
