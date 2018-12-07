import "reflect-metadata";

export abstract class Model {
  constructor() {
    this.attrs = {};
  }

  save() {
    console.log()
  }

  public attrs: Object;
}

export function declare() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target);
  };
}

function enumerable(value: boolean) {

}

const SymbolORM = Symbol("ORM");

export function format(formatString: string) {
    return Reflect.metadata(SymbolORM, formatString);
}

export function getFormat(target: any, propertyKey: string) {
    return Reflect.getMetadata(SymbolORM, target, propertyKey);
}

export function field(option: Object = {}) {
  return Reflect.metadata(SymbolORM, option);
}

export function save() {
  
}