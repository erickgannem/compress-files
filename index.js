import { dirname, join } from 'path';
import debug from 'debug';
import zlib from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createReadStream, createWriteStream, promises } from 'fs';
const {readdir} = promises;

const { pathname: entryFile } = new URL(import.meta.url);
const workingDirectory = dirname(entryFile);
const sourceDir = join(workingDirectory, 'src', 'files');
const compressedDir = join(workingDirectory, 'src', 'compressed');
const log = debug('app-compress');
const { createGzip } = zlib;
const asyncPipeline = promisify(pipeline);
const input = (await readdir(sourceDir)).filter(file => !!~file.indexOf('.csv'))[0];

log('Compressing... \n')
const ONE_SECOND = 1000;
setInterval(() => process.stdout.write('='), ONE_SECOND).unref();

const gzip = createGzip();
const source = createReadStream(`${sourceDir}/${input}`);
const output = createWriteStream(`${compressedDir}/${input.split('.')[0]}.${input.split('.')[1]}.gz`);

asyncPipeline(  
  source,
  gzip,
  output
);