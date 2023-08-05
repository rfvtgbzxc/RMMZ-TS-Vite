/*:
 * @target MZ
 * @plugindesc  云存档系统
 * @author Xu Chen
 * @url https://www.newcenturyfans.cn
 * @help [轮回插件组]云存档系统.js
 * 
 * 包含登录注册、云存档上传下载等功能。
 * 
 * 注意：非生产环境下，默认访问本机本地服务器，如果没有服务器，插件无法运行。
 * */
// import "./云存档系统/LoginAndRegister";
import { CloudSaveManager as __CM } from "./云存档系统/CloudSaveManager";
import "./云存档系统/extendTitleScene";
import "./云存档系统/extendSaveFileWindows";

CloudSaveManager = __CM;

CloudSaveManager.refreshOnlineState().then(() => console.log("onlineState:", CloudSaveManager.onlineState));


export { };
