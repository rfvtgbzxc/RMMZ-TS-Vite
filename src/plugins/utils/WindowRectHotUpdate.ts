/**
 * !! 暂不可用，此函数未实装，目前仅支持 Scene 的热重载，详见`HotUpdate.ts`
 * 
 * Window 类的通用热更新处理函数
 */
function windowRectHotUpdate(currentWin: typeof WindowMZ, hot: ImportMeta["hot"], setNew: (newModule: any) => void) {
  return (newModule: any) => {
    const winMap = hot!.data.winMap || new Map<string, typeof WindowMZ>();
    const win = winMap.get(currentWin.name) || currentWin;

    winMap.set(currentWin.name, win);
    hot!.data.winMap = winMap;

    if (newModule) {
      setNew(newModule);   
    }
  };
}

