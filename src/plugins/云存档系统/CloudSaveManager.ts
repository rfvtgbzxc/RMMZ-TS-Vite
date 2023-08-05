import { close, open } from "./LoginAndRegister";
import { type CloudSaveInfo, pingServer, quickLogin, uploadCloudsave, downloadCloudsave } from "./fetch";
import { decode, encode } from "base64-arraybuffer";
export type OnlineState = "offline" | "notLogin" | "login";
export type CloudSaveState = "off" | "fetching" | "prepared";
type openOptions = {
  onLoginSuccess?: () => void,
  onClose?: () => void
}
class CloudSaveManager {
  enabledCloudSave: boolean = true;

  onlineState: OnlineState = "offline";
  cloudSaveRefreshState: CloudSaveState = "off";
  /**
   * 云存档信息，已经parse
   */
  cloudSaveInfo: CloudSaveInfo | null = null;
  /**
   * 云存档数据，是由pako压缩的状态
   */
  cloudSaveData: string | null = null;

  openLoginAndRegisterWindow(options: openOptions = {}) {
    open({
      onLoginSuccess: () => {
        this.onlineState = "login";
        options.onLoginSuccess?.();
        close();
        options.onClose?.();
      },
      onClose: () => {
        options.onClose?.();
      }
    });
  }

  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  hasAuthToken() {
    return localStorage.getItem("authToken") !== null;
  }

  setAuthToken(token: string) {
    localStorage.setItem("authToken", token);
  }

  clearAuthToken() {
    localStorage.removeItem("authToken");
  }

  setLocalUserEmail(account: string) {
    localStorage.setItem("userEmail", account);
  }

  getLocalUserEmail() {
    return localStorage.getItem("userEmail");
  }

  clearLocalUserEmail() {
    localStorage.removeItem("userEmail");
  }


  /**
   * 在平时使用，会争取登录成功，而之前已经登录成功的，会保持登录状态（登录状态降级由其他函数完成）
   * 
   * 每次登录都需要访问服务器，所以降级部分由其他函数完成
   */
  async refreshOnlineState() {
    const serverAvailable = await pingServer();
    if (!serverAvailable) {
      this.onlineState = "offline";
      return;
    }

    // 此时服务器可用
    this.onlineState = "notLogin";
    const userEmail = this.getLocalUserEmail();
    const authToken = this.getAuthToken();
    if (userEmail && authToken) {
      const loginResult = await quickLogin(userEmail, authToken);
      if (loginResult.code === 1) {
        this.clearAuthToken();
      }
      else if (loginResult.code === 0) {
        this.onlineState = "login";
      }
    }
  }

  makeCloudSaveInfo(): CloudSaveInfo {
    return DataManager.makeSavefileInfo() as CloudSaveInfo;
  }

  async makeCloudSaveData() {
    const object = DataManager.makeSaveContents();
    // @ts-ignore
    return StorageManager.objectToJson(object)
      // @ts-ignore
      .then((json: string) => StorageManager.jsonToZip(json)) as Promise<string>;
  }

  async saveToCloud() {
    if (this.onlineState !== "login") {
      return;
    }

    const cloudSaveInfo = this.makeCloudSaveInfo();
    DataManager._globalInfo[1] = cloudSaveInfo;
    DataManager.saveGlobalInfo();
    const cloudSaveData = await this.makeCloudSaveData();
    const data = {
      cloudSaveInfo: JSON.stringify(cloudSaveInfo),
      cloudSaveData
    }

    const ec = new TextEncoder();
    const bin = ec.encode(JSON.stringify(data));

    const blob = new Blob([bin]);
    const email = this.getLocalUserEmail()!;
    const authToken = this.getAuthToken()!;

    const result = await uploadCloudsave(email, authToken, blob);

    // console.log(result);

  }

  async loadFromCloud() {
    if (this.onlineState !== "login") {
      return;
    }

    const email = this.getLocalUserEmail()!;
    const authToken = this.getAuthToken()!;

    const fetchResult = await downloadCloudsave(email, authToken);
    if (fetchResult.code !== 0) {
      return;
    }
    const resultBase64 = fetchResult.data!;
    var dataUrl = "data:application/octet-binary;base64," + resultBase64;

    const data = await fetch(dataUrl)
      .then(res => res.arrayBuffer());

    const dc = new TextDecoder();
    const result = dc.decode(data); // 这就是上传时的JSON字符串

    return JSON.parse(result);

  }

  /**
   * 从服务器拉取云存档数据，并更新状态
   */
  async refreshCloudSave() {
    this.cloudSaveRefreshState = "fetching";
    this.cloudSaveData = null;
    this.cloudSaveInfo = null;
    try {
      const result = await this.loadFromCloud();

      if (!result) {
        this.cloudSaveRefreshState = "off";
        return;
      }

      this.cloudSaveData = result.cloudSaveData;
      this.cloudSaveInfo = JSON.parse(result.cloudSaveInfo);

      this.cloudSaveRefreshState = "off";
    }
    catch (e) {
      console.error(e);
      this.cloudSaveRefreshState = "off";
    }
  }
  /**
   * 本次云存档访问是否结束
   */
  isCloudSaveRefreshFinished() {
    return this.cloudSaveRefreshState === "off";
  }

  /**
   * 是否下载了云存档数据
   */
  isCloudSaveDataPrepared() {
    return this.cloudSaveData !== null;
  }


  async loadGame() {
    let object: DataManager.SaveContents;
    // @ts-ignore
    object = await StorageManager.zipToJson(this.cloudSaveData!)
      // @ts-ignore
      .then(json => StorageManager.jsonToObject(json));

    DataManager.createGameObjects();
    DataManager.extractSaveContents(object);
    DataManager.correctDataErrors();
    return 0;
  }

  async saveGame() {
    await this.saveToCloud();
    return 0;
  }

  logout() {
    this.clearAuthToken();
    this.clearLocalUserEmail();
    this.onlineState = "notLogin";
  }
}
const __CM = new CloudSaveManager();
type __CMT = typeof __CM;

export { __CM as CloudSaveManager, type __CMT as CloudSaveManagerType };