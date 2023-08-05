declare global {
  var Imported: { [key: string]: string };
}

// function extendPrototype(prototype: any, alias: any) {
//   for (const key in alias) {
//     prototype[key] = alias[key];
//   }
// }

/**
 * 批量拓展原型
 */
function extendClass<C extends new (...args: any) => any>(classConstructor: C, funcs: {
  [K in keyof InstanceType<C>]?: (this: InstanceType<C>, ...args: Parameters<InstanceType<C>[K]>) => ReturnType<InstanceType<C>[K]>;
})
//: asserts classConstructor is C
{
  const prototype = classConstructor.prototype;
  for (const key in funcs) {
    prototype[key] = funcs[key];
  }
}

/**
 * 拓展运行时数据
 */
const onSaveLoadedListeners: ((contents: DataManager.SaveContents) => void)[] = [];
let isUseOnSaveLoadedListener = false;
function addOnSaveLoadedListener(onSaveLoaded: (contents: DataManager.SaveContents) => void) {
  onSaveLoadedListeners.push(onSaveLoaded);
  if (!isUseOnSaveLoadedListener) {
    isUseOnSaveLoadedListener = true;
    const alias_DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents: DataManager.SaveContents) {
      alias_DataManager_extractSaveContents.call(this, contents);
      onSaveLoadedListeners.forEach(listener => listener(contents));
    };
  }
}

/**
 * 拓展数据库数据
 */
const onDatabaseLoadedListeners: (() => void)[] = [];
let isUseOnDatabaseLoadedListeners = false;
export function addOnDatabaseLoadedListener(onLoadDatabase: () => void) {
  onDatabaseLoadedListeners.push(onLoadDatabase);
  if (!isUseOnDatabaseLoadedListeners) {
    isUseOnDatabaseLoadedListeners = true;
    const __Scene_Boot__onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
    Scene_Boot.prototype.onDatabaseLoaded = function () {
      __Scene_Boot__onDatabaseLoaded.apply(this);
      onDatabaseLoadedListeners.forEach(listener => listener());
    }
  }
}

/**
 * 基于指定数据结构解析数据
 */
function readParams(object: any, structure: any): any {
  if (structure instanceof Array) {
    const result = [];
    const exampleValue = structure[0];
    const rawValues = object;
    for (const rawValue of rawValues) {
      if (exampleValue instanceof Object) {
        if (rawValue === "") {
          if (exampleValue["@nullable"]) {
            result.push(null);
          }
          else {
            throw new Error(`Expecting a non-empty string as a non-null array, but recived a empty string`);
          }
        }
        else {
          result.push(readParams(JSON.parse(rawValue), exampleValue));
        }
      }
      else if (exampleValue === "number") {
        result.push(Number(rawValue));
      }
      else if (exampleValue === "string") {
        result.push(rawValue);
      }
    }
    return result;
  }
  else {
    // structure instanceof Object
    const result: any = {};
    for (const key of Object.keys(object)) {
      const exampleValue = structure[key];
      const rawValue = object[key];
      if (exampleValue instanceof Object) {
        if (rawValue === "") {
          if (exampleValue["@nullable"]) {
            result[key] = null;
          }
          else {
            throw new Error(`Expecting a non-empty string as a non-null object, but recived a empty string`);
          }
        }
        else {
          result[key] = readParams(JSON.parse(rawValue), exampleValue);
        }
      }
      else if (exampleValue === "number") {
        result[key] = Number(rawValue);
      }
      else if (exampleValue === "string") {
        result[key] = rawValue;
      }
    }
    return result;
  }
}

export { extendClass, addOnSaveLoadedListener, readParams };