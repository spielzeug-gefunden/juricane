import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import createDefaultConfig from './default-config';
import { readConfigFile, writeConfigFile } from './config-file';

describe('config-file', () => {
  it('schreibt und liest eine Konfiguration', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'juricane-'));
    const file = path.join(dir, 'sub', 'config.json');
    const config = createDefaultConfig(path.join(dir, 'music'));

    await writeConfigFile(file, config);

    expect(await readConfigFile(file)).toEqual(config);
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('lehnt Nicht-Objekte ab', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'juricane-'));
    const file = path.join(dir, 'config.json');
    await fs.writeFile(file, '[1]', 'utf8');

    await expect(readConfigFile(file)).rejects.toThrow();
    await fs.rm(dir, { recursive: true, force: true });
  });
});
