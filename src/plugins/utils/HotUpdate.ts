
/**
 * 热更新，重载Scene
 * 
 * 以下四个参数都是必须的
 * @param identifier 字符串，用于唯一地标识一个Scene
 * @param current Scene，当前的Scene
 * @param setNew 传入一个newMoudule，用于设置新的Scene，同时需要返回新的Scene，供热重载使用
 * @param hot import.meta.hot
 * 
 */

export function acceptSceneHotUpdate(identifier: string, current: any, setNew: (newModule: any) => any, hot: ImportMeta["hot"]) {
  return (newModule: any) => {
    const setterMap = hot!.data.setterMap || new Map();
    const validSetNew = setterMap.get(identifier) || setNew;
    setterMap.set(identifier, validSetNew);
    hot!.data.setterMap = setterMap;
    const newScene = validSetNew(newModule);
    if (SceneManager._scene instanceof current) {
      SceneManager.resume();
      Graphics.eraseError();
      SceneManager.goto(newScene);
    }
  }
}