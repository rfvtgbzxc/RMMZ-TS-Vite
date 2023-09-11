const classRefs = new Map<string, new (...args: any[]) => any>();
const reClassRefs = new Map<Function, string>();

/**
 * 序列化支持
 */
export function serializable(className: string) {
  return function (constructor: new (...args: any[]) => any) {
    classRefs.set(className, constructor);
    reClassRefs.set(constructor, className);
  };
}

const alias_JsonEX___encode = JsonEx._encode;
JsonEx._encode = function (value: any, depth: number) {
  alias_JsonEX___encode.call(this, value, depth);
  const type = Object.prototype.toString.call(value);
  if (type === "[object Object]" || type === "[object Array]") {
    if (reClassRefs.has(value.constructor)) {
      value["@"] = reClassRefs.get(value.constructor);
    }
  }
  return value;
}

const alias_JsonEX___decode = JsonEx._decode;
JsonEx._decode = function (value) {
  alias_JsonEX___decode.call(this, value);
  const type = Object.prototype.toString.call(value);
  if (type === "[object Object]" || type === "[object Array]") {
    if (value["@"]) {
      const className = value["@"];
      if(classRefs.has(className)) {
        Object.setPrototypeOf(value, classRefs.get(className)!.prototype);
      }
    }
  }
  return value;
};