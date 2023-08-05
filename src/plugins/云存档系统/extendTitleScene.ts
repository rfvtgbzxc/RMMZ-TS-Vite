import { CloudSaveManager, type OnlineState } from "./CloudSaveManager.js";
import { Scene_CloudSave } from "./Scene_CloudSave.js";
const alias = {
  Scene_Title: {
    create: Scene_Title.prototype.create,
  },
  Window_TitleCommand: {
    makeCommandList: Window_TitleCommand.prototype.makeCommandList,
  },
  DataManager: {
    isAnySavefileExists: DataManager.isAnySavefileExists,
  }
};

declare global {
  interface Scene_Title {
    _saveButton: Sprite_CloudSaveIcon;
    createCloudSaveButton(): void;
  }
}

Scene_Title.prototype.create = function () {
  alias.Scene_Title.create.call(this);

  //this.createCloudSaveButton();
  this._commandWindow.setHandler("cloudSave", () => SceneManager.push(Scene_CloudSave));
}

Scene_Title.prototype.createCloudSaveButton = function () {
  this._saveButton = new Sprite_CloudSaveIcon();
  this.addChild(this._saveButton);
}

Scene_Title.prototype.commandWindowRect = function () {
  const offsetX = $dataSystem.titleCommandWindow.offsetX;
  const offsetY = $dataSystem.titleCommandWindow.offsetY;
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(4, true);
  const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
  const wy = Graphics.boxHeight - wh - 96 + offsetY;
  return new Rectangle(wx, wy, ww, wh);
}

const iconIndexMap = {
  "offline": 33,
  "notLogin": 34,
  "login": 35
}

class Sprite_CloudSaveIcon extends Sprite_Clickable {
  _state: OnlineState;
  constructor() {
    super();
    this.updateState();
  }
  update(): void {
    super.update();
    this.updateState();
  }
  updateState(): void {
    if (CloudSaveManager.onlineState !== this._state) {
      this._state = CloudSaveManager.onlineState;
      this.refresh();
    };
  }

  refresh(): void {
    this.bitmap = ImageManager.loadSystem("IconSet");
    const iconIndex = iconIndexMap[this._state];
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;

    this.setFrame(sx, sy, pw, ph);
  }

  onClick(): void {
    SceneManager.push(Scene_CloudSave);
  }
}

Window_TitleCommand.prototype.makeCommandList = function () {
  alias.Window_TitleCommand.makeCommandList.call(this);
  this.addCommand("云存档", "cloudSave");
}

DataManager.isAnySavefileExists = function () {
  return alias.DataManager.isAnySavefileExists.call(this) || CloudSaveManager.onlineState === "login";
};


export { alias };