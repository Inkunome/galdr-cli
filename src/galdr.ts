#!/usr/bin/env node

import fs, { mkdir, writeFile, readFile } from "fs";
import path from "path";
import { promisify } from "util";

import parseArgs from "minimist"
import { renderString as render } from "nunjucks";
import { exec } from "child_process";


const args = parseArgs(process.argv.slice(2));

const commands = args._;
const root = path.dirname(__dirname);

function put(str: string) {
  process.stdout.write(str);
}

function template(file: string) : string {
  return `${root}/templates/${file}`;
}

interface GaldrConf {

}

async function galdr_conf() : Promise<GaldrConf> {
  return JSON.parse(await promisify(readFile)("galdr.json", "utf-8"));
}

if (commands.length === 0) {
  process.stderr.write("No command specified\n");
  help();
  process.exit(0);
}

switch (commands[0]) {
  case "create":
    create();
    break;
  default:
    process.stderr.write(`Command ${commands[0]} is unavailable\n`);
    help();
}

function help() {
  process.stderr.write("  - create");
}

function create() {
  if (commands.length < 2) {
    process.stderr.write("No subject for create\n");
    help();
    process.exit(0);
  }

  if (commands.length < 3) {
    process.stderr.write("No target for create\n");
    help();
    process.exit(0);
  }

  let subject = commands[1];
  let target = commands[2];

  switch (subject) {
    case "platform":
      platform();
      break;
    case "app":
    case "application":
      app();
      break;
    default:
      process.stderr.write(`Subject ${subject} is unavailable\n`);
      help();
  }

  function help() {

  }

  async function platform() {
    let twd = `${process.cwd()}/${target}`;

    put("Creating platform\n");
    await promisify(mkdir)(twd);
    await promisify(mkdir)(`${twd}/src`);
    await promisify(mkdir)(`${twd}/dist`);
    await promisify(exec)("npm init -y", { cwd : twd });

    await Promise.all([
      promisify(exec)("npm install --save-dev tslint", { cwd : twd }),
      promisify(exec)("npm install --save typeorm", { cwd : twd }),
      promisify(exec)("npm install --save reflect-metadata", { cwd : twd }),
      promisify(exec)("npm install --save koa", { cwd : twd }),
      promisify(exec)("npm install --save koa-router", { cwd : twd }),
      promisify(exec)("npm install --save-dev typescript", { cwd : twd }),
      promisify(exec)("npm install --save-dev @types/node", { cwd : twd }),
      promisify(exec)("npm install --save-dev @types/koa", { cwd : twd }),
      promisify(exec)("npm install --save-dev @types/koa-router", { cwd : twd }),
    ]);

    let tslint = await promisify(readFile)(template("conf/tslint.json"), "utf-8");
    let tsconfig = await promisify(readFile)(template("conf/tsconfig.json"), "utf-8");
    let galdr = await promisify(readFile)(template("conf/galdr.json"), "utf-8");

    await promisify(writeFile)(`${twd}/tslint.json`, tslint);
    await promisify(writeFile)(`${twd}/tsconfig.json`, tsconfig);
    await promisify(writeFile)(`${twd}/galdr.json`, galdr);
  }

  async function app() {
    let conf = await galdr_conf();

    let app = await promisify(readFile)(template("app/app.tpl"), "utf-8");
    let deploy = await promisify(readFile)(template("app/deploy.tpl"), "utf-8");

    await promisify(writeFile)(`${process.cwd()}/src/${target}.app.ts`, render(app, { target }));
    await promisify(writeFile)(`${process.cwd()}/src/${target}.deploy.ts`, render(deploy, { target }));
  }
}