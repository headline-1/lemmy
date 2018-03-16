import { exec as execUnpromised } from 'child_process';
import { exists as existsUnpromised, readdir as readdirUnpromised, readFile as readFileUnpromised } from 'fs';
import { promisify } from 'util';

export const exec = promisify(execUnpromised);
export const readFile = promisify(readFileUnpromised);
export const exists = promisify(existsUnpromised);
export const readdir = promisify(readdirUnpromised);
