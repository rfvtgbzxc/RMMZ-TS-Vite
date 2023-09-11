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
type CloneFunctionType<C extends new (...args: any) => any, K extends keyof InstanceType<C>>
  = (this: InstanceType<C>, ...args: Parameters<InstanceType<C>[K]>) => ReturnType<InstanceType<C>[K]>;

function extendClass<C extends new (...args: any) => any>(classConstructor: C, funcs: {
  [K in keyof InstanceType<C>]?: CloneFunctionType<C, K>;
})
//: asserts classConstructor is C
{
  const prototype = classConstructor.prototype;
  for (const key in funcs) {
    prototype[key] = funcs[key];
  }
}

/**
 * 批量拓展原型，且提供alias以便访问原函数
 * 
 * alias中的函数是写时按需复制，在extendClassWithAlias调用即将结束时才会被正式复制，在此之前请勿使用解构方式直接获取alias中的函数
 */
export function extendClassWithAlias<C extends new (...args: any) => any>(classConstructor: C, makeFuncs: (alias: {
  [K in keyof InstanceType<C>]: CloneFunctionType<C, K>;
}) => {
    [K in keyof InstanceType<C>]?: CloneFunctionType<C, K>;
  })
//: asserts classConstructor is C
{
  const prototype = classConstructor.prototype;
  const alias: {
    [K in keyof InstanceType<C>]?: CloneFunctionType<C, K>;
  } = {};
  const rewrite = makeFuncs(alias as {
    [K in keyof InstanceType<C>]: CloneFunctionType<C, K>;
  });
  for (const key in rewrite) {
    if (!prototype[key]) {
      alias[key] = () => { throw `调用了不存在的原函数 ${prototype.constructor.name}:${key}` };
    }
    else{
      alias[key] = prototype[key];
    }
    prototype[key] = rewrite[key];
  }
}

const onSaveLoadedListeners: ((contents: DataManager.SaveContents) => void)[] = [];
let isUseOnSaveLoadedListener = false;
/**
 * 读档后调用，常用于拓展运行时数据
 */
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

const onDatabaseLoadedListeners: (() => void)[] = [];
let isUseOnDatabaseLoadedListeners = false;
/**
 * 数据库加载后调用，常用于拓展数据库数据
 */
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
function parseParameters(rawObject: any, structure: any): any {
  if (structure instanceof Array) {
    const result = [];
    const exampleValue = structure[0];
    const rawValues = rawObject;
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
          result.push(parseParameters(JSON.parse(rawValue), exampleValue));
        }
      }
      else if (exampleValue === "number") {
        result.push(Number(rawValue));
      }
      else if (exampleValue === "string") {
        result.push(rawValue);
      }
      else if (exampleValue === "boolean") {
        result.push(rawValue === "true");
      }
    }
    return result;
  }
  else {
    // structure instanceof Object
    const result: any = {};
    for (const key of Object.keys(rawObject)) {
      const exampleValue = structure[key];
      const rawValue = rawObject[key];
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
          result[key] = parseParameters(JSON.parse(rawValue), exampleValue);
        }
      }
      else if (exampleValue === "number") {
        result[key] = Number(rawValue);
      }
      else if (exampleValue === "string") {
        result[key] = rawValue;
      }
      else if (exampleValue === "boolean") {
        result[key] = rawValue === "true";
      }
    }
    return result;
  }
}

/**
 * 读取html式备注信息
 * 
 * 形如`<keyword>text</keyword>`的备注信息
 */
export function readDefineText(note: string, keyword: string) {
  // 临时生成正则可能有效率问题，考虑缓存，待优化
  const re = new RegExp(`<${keyword}>([^]*)<\/${keyword}>`);
  //const re = /<效果无效>([^]*)<\/效果无效>/;
  return note.match(re)?.[1] ?? null;
}

export { extendClass, addOnSaveLoadedListener, parseParameters };