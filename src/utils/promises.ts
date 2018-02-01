import { exec as execUnpromised } from 'child_process';
import { readFile as readFileUnpromised } from 'fs';
import { promisify } from 'util';

export const exec = promisify(execUnpromised);
export const readFile = promisify(readFileUnpromised);
