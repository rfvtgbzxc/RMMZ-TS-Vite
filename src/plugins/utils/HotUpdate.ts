/**
 * 热更新，重载Scene
 */

// function handleHotUpdate(sceneConstructor: any, setNew: (newModule: any) => void, hot: ImportMeta["hot"]) {
//   return (newModule: any) => {
//     const sceneMap = hot!.data.winMap || new Map<string, typeof WindowMZ>();
//     const scene = sceneMap.get(sceneConstructor.name) || sceneConstructor;

//     sceneMap.set(sceneConstructor.name, scene);
//     hot!.data.winMap = sceneMap;
//     setNew(newModule);
//     // @ts-ignore
//     if (SceneManager._scene instanceof sceneConstructor) {
//       // @ts-ignore
//       SceneManager.goto(sceneConstructor);
//     }
//   }
// }

// export function createHotUpdate(any: any, hot: ImportMeta["hot"]) {
  
// }
