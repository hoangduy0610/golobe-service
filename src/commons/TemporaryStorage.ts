
import { join } from 'path';
import * as fs from 'fs';
const dataDir = join(process.cwd(), 'data.json');

export class TemporaryStorage {
    data: any = {};

    constructor() {
        if (!fs.existsSync(dataDir)) {
            fs.writeFileSync(dataDir, '{}');
        }
        this.data = require(dataDir);
    }

    get(key: string) {
        return this.data[key];
    }

    set(key: string, value: any) {
        this.data[key] = value;
        this.save();
    }

    private save() {
        fs.writeFileSync(dataDir, JSON.stringify(this.data, null, 2));
    }
}