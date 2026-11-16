import Config from 'config';
import fs from 'fs/promises';
import path from 'path';

/** Liest und prüft eine Konfigurationsdatei. Wirft bei ungültigem JSON. */
export async function readConfigFile(file: string): Promise<Config> {
  const parsed = JSON.parse(await fs.readFile(file, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Ungültige Konfiguration');
  }
  return parsed as Config;
}

export async function writeConfigFile(
  file: string,
  config: Config
): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}
