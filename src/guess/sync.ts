import fs from 'fs';
import { Stream } from 'stream';

fs.open('./store.guess', 'w', (openErr: Error, fd: number) => {
  if (openErr) { throw openErr; }

  const rstream = fs.createReadStream('', { fd });
  const wstream = fs.createWriteStream('', { fd });

  rstream.read(10);

  wstream.write('Hello world', () => {
    fs.close(fd, (closeErr: Error) => {
      if (closeErr) { throw closeErr; }
    });
  });
});