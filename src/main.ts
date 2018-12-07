/*import { App } from './app';

const app = new App();

app.deploy({
  port : 8080,
});*/

import { Model, declare, format, getFormat } from './domain/model';

class Cat extends Model {
  constructor() {
    super();

    this.roar = "Maow";
  }

  greeting() {
    return getFormat(this, "greeting");
  }

  @format("Hello, %s")
  private roar: String;
}

import "reflect-metadata";

const SymbolORM = Symbol("ORM");

function ORM<T extends { new(...args: any[]): {} }>(constructor: T) {
  class Model extends constructor {
    constructor(...args: any[]) {
      super(...args);

      // Only iterate on final class
      if (this.constructor === Model) {
        let meta_fields: any = {};

        for (let key of Object.keys(this)) {
          if (Reflect.hasMetadata(SymbolORM, this, key)) {
            meta_fields[key] = {
              type: Reflect.getMetadata("design:type", this, key),
              option: Reflect.getMetadata(SymbolORM, this, key),
            }
          }
        }

        Reflect.defineMetadata(SymbolORM, meta_fields, this);
      }
    }
  }

  return Model;
}

function field(option: Object = {}) {
  return Reflect.metadata(SymbolORM, option);
}

function save(model: any) {
  console.log(Reflect.getMetadata(SymbolORM, model));
}

function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

@ORM
class Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  @field()
  private x: number;

  @field()
  private y: number;
}

@ORM
class Point3D extends Point {
  constructor(x: number, y: number, z: number) {
    super(x, y);

    this.z = z;
  }

  @field()
  private z: number;
}

let p = new Point(0, 0);
let p3 = new Point3D(0, 0, 0);

save(p);
save(p3);