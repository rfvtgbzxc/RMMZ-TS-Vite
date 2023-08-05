import { extendClass } from "../utils/PluginCommon";
import { CloudSaveManager } from "./CloudSaveManager";

declare global {
  interface Window_SavefileList {
    _cloudSave: boolean;
    _cloudSaveInfoRefreshed: boolean;
    setCloudSave(enabled: boolean): void;
  }
}
const alias = {
  Scene_File: {
    // @ts-ignore
    createListWindow: Scene_File.prototype.createListWindow
  },
  Scene_Load: {
    // @ts-ignore
    executeLoad: Scene_Load.prototype.executeLoad
  },
  Scene_Save: {
    // @ts-ignore
    executeSave: Scene_Save.prototype.executeSave
  },
  Window_SavefileList: {
    initialize: Window_SavefileList.prototype.initialize,
    maxItems: Window_SavefileList.prototype.maxItems,
    indexToSavefileId: Window_SavefileList.prototype.indexToSavefileId,
    savefileIdToIndex: Window_SavefileList.prototype.savefileIdToIndex,
    isEnabled: Window_SavefileList.prototype.isEnabled,
    update: Window_SavefileList.prototype.update,
    drawContents: Window_SavefileList.prototype.drawContents,
  }
}

// @ts-ignore
Scene_File.prototype.createListWindow = function () {
  alias.Scene_File.createListWindow.call(this);
  this._listWindow.setCloudSave(true);
};

extendClass(Window_SavefileList, {
  initialize(rect: Rectangle) {
    alias.Window_SavefileList.initialize.call(this, rect);
    this._cloudSave = CloudSaveManager.enabledCloudSave;
    this._cloudSaveInfoRefreshed = false;
    CloudSaveManager.refreshCloudSave();
  },
  setCloudSave(enabled: boolean) {
    this._cloudSave = enabled;
    this.refresh();
  },
  maxItems() {
    return alias.Window_SavefileList.maxItems.call(this) - (this._cloudSave ? 0 : 1);
  },
  indexToSavefileId(index: number) {
    return alias.Window_SavefileList.indexToSavefileId.call(this, index) + (this._cloudSave ? 0 : 1);
  },
  savefileIdToIndex(savefileId: number) {
    return alias.Window_SavefileList.savefileIdToIndex.call(this, savefileId) - (this._cloudSave ? 0 : 1);
  },
  // 云存档需要加载完毕才能使用
  isEnabled(savefileId: number) {
    if (this._cloudSave && savefileId === 1) {
      if (!CloudSaveManager.isCloudSaveRefreshFinished()) {
        return false;
      }
      if (this._mode === "save") {
        return true;
      }
      else {
        return CloudSaveManager.isCloudSaveDataPrepared();
      }
    } else {
      return alias.Window_SavefileList.isEnabled.call(this, savefileId);
    }
  },
  drawTitle(savefileId: number, x: number, y: number) {
    if (savefileId === 0) {
      this.drawText(TextManager.autosave, x, y, 180);
    }
    else if (savefileId === 1) {
      this.drawText("云存档", x, y, 180);
    }
    else {
      this.drawText(TextManager.file + " " + (savefileId + 1), x, y, 180);
    }
  },
  drawItem(index: number) {
    const savefileId = this.indexToSavefileId(index);
    const info = DataManager.savefileInfo(savefileId);
    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.changePaintOpacity(this.isEnabled(savefileId));
    this.drawTitle(savefileId, rect.x, rect.y + 4);
    if (savefileId===1 && !CloudSaveManager.isCloudSaveDataPrepared()) {
      return;
    }
    if(info){
      this.drawContents(info, rect);
    }
  },
  update() {
    alias.Window_SavefileList.update.call(this);
    if (this._cloudSave && !this._cloudSaveInfoRefreshed && CloudSaveManager.isCloudSaveRefreshFinished() && CloudSaveManager.isCloudSaveDataPrepared()) {
      DataManager._globalInfo[1] = CloudSaveManager.cloudSaveInfo;
      this.refresh();
      this._cloudSaveInfoRefreshed = true;
    }
  }
});

// @ts-ignore
Scene_Load.prototype.executeLoad = function (savefileId: number) {
  if (savefileId === 1 && CloudSaveManager.enabledCloudSave) {
    CloudSaveManager.loadGame()
      .then(() => this.onLoadSuccess())
      .catch((e) => this.onLoadFailure());
  } else {
    alias.Scene_Load.executeLoad.call(this, savefileId);
  }
}
// @ts-ignore
Scene_Save.prototype.executeSave = function (savefileId: number) {
  if (savefileId === 1 && CloudSaveManager.enabledCloudSave) {
    $gameSystem.setSavefileId(savefileId);
    $gameSystem.onBeforeSave();
    CloudSaveManager.saveGame()
      .then(() => this.onSaveSuccess())
      .catch((e) => this.onSaveFailure());
  }
  else {
    alias.Scene_Save.executeSave.call(this, savefileId);
  }
};

DataManager.removeInvalidGlobalInfo = function () {
  const globalInfo = this._globalInfo;
  for (const info of globalInfo) {
    const savefileId = globalInfo.indexOf(info);
    // 云存档位不删除
    if (savefileId === 1) {
      continue;
    }
    if (!this.savefileExists(savefileId)) {
      delete globalInfo[savefileId];
    }
  }
};


export { };