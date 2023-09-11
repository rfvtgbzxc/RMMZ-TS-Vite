import { extendClass } from "./utils/PluginCommon";

/*:
 * @target MZ
 * @plugindesc 令侧视角色的状态图标显示在角色头顶
 * @author rfvtgbzxc
 * @url https://rpg.blue/home.php?mod=space&uid=137239
 * @help 侧视角色状态图标.js
 * 
 * @param stateIconOffsetX
 * @text 状态图标X偏移
 * @desc 状态图标相对于角色头顶的X偏移，用于微调
 * @type string
 * @default 0
 * 
 * @param stateIconOffsetY
 * @text 状态图标Y偏移
 * @desc 状态图标相对于角色头顶的Y偏移，用于微调
 * @type string
 * @default 0
 * 
 * @param stateIconScale
 * @text 状态图标缩放
 * @desc 状态图标的缩放比例，用于微调
 * @type string
 * @default 1
 * 
 * */
declare global {
  interface Sprite_Actor {
    _stateIconSprite: Sprite_StateIcon;
    createStateIconSprite(): void;
    updateStateSprite(): void;
  }
}

const params = PluginManager.parameters("侧视角色状态图标");
let stateIconOffsetX = Number(params["stateIconOffsetX"] || 0);
let stateIconOffsetY = Number(params["stateIconOffsetY"] || 0);
let stateIconScale = Number(params["stateIconScale"] || 1);

const alias = {
  Sprite_Actor: {
    initMembers: Sprite_Actor.prototype.initMembers,
    setBattler: Sprite_Actor.prototype.setBattler,
    update: Sprite_Actor.prototype.update,
  }
}

extendClass(Sprite_Actor, {
  initMembers() {
    alias.Sprite_Actor.initMembers.call(this);
    this.createStateIconSprite();
  },
  createStateIconSprite() {
    this._stateIconSprite = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite);
  },
  setBattler(battler: Game_Actor) {
    alias.Sprite_Actor.setBattler.call(this, battler);
    this._stateIconSprite.setup(battler);
  },
  update() {
    alias.Sprite_Actor.update.call(this);
    if (this._actor) {
      this.updateStateSprite();
    }
  },
  updateStateSprite() {
    this._stateIconSprite.y = -Math.round((this.mainSprite().height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
      this._stateIconSprite.y = 20 - this.y;
    }
    this._stateIconSprite.y += stateIconOffsetY;
    this._stateIconSprite.x = stateIconOffsetX;
    this._stateIconSprite.scale.x = stateIconScale;
    this._stateIconSprite.scale.y = stateIconScale;
  }

});


export { };