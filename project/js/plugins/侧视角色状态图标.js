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

(function(t){typeof define=="function"&&define.amd?define(t):t()})(function(){"use strict";function t(e,r){const p=e.prototype;for(const n in r)p[n]=r[n]}const i=PluginManager.parameters("侧视角色状态图标");let a=Number(i.stateIconOffsetX||0),c=Number(i.stateIconOffsetY||0),o=Number(i.stateIconScale||1);const s={Sprite_Actor:{initMembers:Sprite_Actor.prototype.initMembers,setBattler:Sprite_Actor.prototype.setBattler,update:Sprite_Actor.prototype.update}};t(Sprite_Actor,{initMembers:function(){s.Sprite_Actor.initMembers.call(this),this.createStateIconSprite()},createStateIconSprite:function(){this._stateIconSprite=new Sprite_StateIcon,this.addChild(this._stateIconSprite)},setBattler:function(e){s.Sprite_Actor.setBattler.call(this,e),this._stateIconSprite.setup(e)},update:function(){s.Sprite_Actor.update.call(this),this._actor&&this.updateStateSprite()},updateStateSprite:function(){this._stateIconSprite.y=-Math.round((this.mainSprite().height+40)*.9),this._stateIconSprite.y<20-this.y&&(this._stateIconSprite.y=20-this.y),this._stateIconSprite.y+=c,this._stateIconSprite.x=a,this._stateIconSprite.scale.x=o,this._stateIconSprite.scale.y=o}})});
