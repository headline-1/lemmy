import { exec as execUnpromised, ExecOptions } from 'child_process';
import {
  exists as existsUnpromised,
  readdir as readdirUnpromised,
  readFile as readFileUnpromised,
  writeFile as writeFileUnpromised
} from 'fs';
import { promisify } from 'util';

const VERBOSE = !!process.env.LEMMY_VERBOSE || false;

const execBase = promisify(execUnpromised);
export const exec = VERBOSE
  ? async (command: string, options?: ExecOptions) => {
    console.log(`🔹 ${command}`);
    const result = await execBase(command, options);
    const out = result.stdout.trim();
    const err = result.stderr.trim();
    if (out) {
      console.log(`🔹 ${out}`);
    }
    if (err) {
      console.log(`🔸 ${err}`);
    }
    return result;
  }
  : execBase;
export const readFile = promisify(readFileUnpromised);
export const writeFile = promisify(writeFileUnpromised);
export const exists = promisify(existsUnpromised);
export const readdir = promisify(readdirUnpromised);
