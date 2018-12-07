import fs from "fs";
import { resolve as resolve_path } from "path"

export async function InitializeStore(path: string): Promise<Store> {
  return new Promise<Store>((resolve, reject) => {
    const basePath = resolve_path(path, "index.guess");

    fs.access(basePath, fs.constants.F_OK | fs.constants.W_OK, (err: Error) => {
      if (err) {
        reject("Cannot setup the base, did you create this before?");
        return;
      }

      // console.log(`${file} exists, and it is writable`);
    });
  });
}


class Store {
  constructor(private path: string) { }
}
