const keys = new Map<string, typeof Scene_Base>();
let isInit = false;


// @ts-expect-error
const __Scene_Map__updateScene = Scene_Map.prototype.updateScene;
/**
 * 地图场景可用。按下指定的键时，跳转到指定的场景
 */
export function SetKeyToStartScene(key: string, scene: typeof Scene_Base) {
  if (!isInit) {
    isInit = true;
    // const __Scene_Map__updateScene = Scene_Map.prototype.updateScene;
    // @ts-expect-error
    Scene_Map.prototype.updateScene = function () {
      __Scene_Map__updateScene.apply(this, arguments);
      if (!SceneManager.isSceneChanging()) {
        for(const key of keys.keys()){
          if(Input.isTriggered(key)){
            SceneManager.push(keys.get(key)!);
          }
        }
      }
    }
  }
  if (keys.has(key)) {
    throw new Error(`重复的按键${key}`);
  }
  keys.set(key, scene as typeof Scene_Base);
}

export function RemoveKeyToStartScene(key: string) {
  if (keys.has(key)) {
    keys.delete(key);
  }
}

// if (import.meta.hot) {
//   import.meta.hot.dispose((data) => {
//     // @ts-expect-error
//     Scene_Map.prototype.updateScene = __Scene_Map__updateScene;
//   })
// }
