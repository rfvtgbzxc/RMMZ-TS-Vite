const keys = new Map<string, typeof Scene_Base>();
let isInit = false;


let __Scene_Map__updateScene: any;
/**
 * 地图场景可用。按下指定的键时，跳转到指定的场景
 */
export function SetKeyToStartScene(key: string, scene: typeof Scene_Base) {
  if (!isInit) {
    isInit = true;
    __Scene_Map__updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function () {
      __Scene_Map__updateScene.apply(this);
      if (!SceneManager.isSceneChanging()) {
        for (const key of keys.keys()) {
          if (Input.isTriggered(key)) {
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

const keyInputSet = new Set<string>();
const keySceneMapEx = new Map<string, any>();
window.addEventListener("keydown", (e) => {
  keyInputSet.add(e.code);
});

window.addEventListener("keyup", (e) => {
  keyInputSet.delete(e.code);
});

const __Scene_Map__updateSceneEx = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function () {
  __Scene_Map__updateSceneEx.apply(this);
  if (!SceneManager.isSceneChanging()) {
    for (const key of keyInputSet) {
      if (keySceneMapEx.has(key)) {
        SceneManager.push(keySceneMapEx.get(key)!);
      }
    }
  }
}
/**
 * 地图场景可用。按下指定的键时，跳转到指定的场景，此为进阶版。
 * 
 * 可以使用键盘上任意按键，同时为更好支持热更新，重新调用时不再要求移除同一按键的绑定。
 * 
 * `key` event.code
 */
export function keyDownToStartSceneEx(key: string, scene: any) {
  keySceneMapEx.set(key, scene);
}

/**
 * 调用此函数，游戏加载完毕后会进入战斗测试
 */
export function enterBattleTest() {
  DataManager.isBattleTest = () => true;
}

/**
 * 调用此函数，游戏会处于Debug模式
 */
export function enterDebugMode() {
  Game_Temp.prototype.isPlaytest = () => true;
}