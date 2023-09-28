import { writeFileSync, readFileSync, existsSync } from 'fs';
import { GPTKeys } from 'main/types/GPTKeys';

export default class GPTKeyFileManager {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  checkIfFileExists() {
    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify({ keys: [] }), 'utf8');
    }
  }

  saveKey(keys: GPTKeys) {
    this.checkIfFileExists();
    try {
      writeFileSync(this.filePath, JSON.stringify(keys, null, 2), 'utf8');
    } catch (error) {
      console.error(error);
    }
  }

  loadKeys(): GPTKeys {
    this.checkIfFileExists();
    const keys = readFileSync(this.filePath, 'utf8');
    const json = JSON.parse(keys) as GPTKeys;
    return json;
  }
}
