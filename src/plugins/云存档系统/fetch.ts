//const serverUrl = "http://localhost:7305"
//const serverUrl = "https://cloudsave.test.newcenturyfans.cn:7305";
let serverUrl: string = "http://localhost:7305";

type RequestResult = {
  code: number;
  info: string;
}
function waitForSeconds(seconds: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export async function pingServer(): Promise<boolean> {
  return fetch(`${serverUrl}/ping`)
    .then(res => res.text())
    .then(text => text === "pong")
    .catch(err => false);
}

type RequestVerifyCodeResult = RequestResult;
export async function requestVerifyCode(email: string): Promise<RequestVerifyCodeResult> {
  const formData = new FormData();
  formData.append("email", email);

  //await waitForSeconds(10);

  return fetch(`${serverUrl}/register/request_email_confirm`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
}

type RegisterResult = RequestResult & {
  token?: string;
};
export async function registerAndLogin(email: string, verifyCode: string): Promise<RegisterResult> {
  // console.log(email);
  const formData = new FormData();
  formData.append("email", email);
  formData.append("verifyCode", verifyCode);

  return fetch(`${serverUrl}/register/login`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
}
/**
 * code=0 登录成功
 * 
 * code=1 token错误或过期
 */
type QuickLoginResult = RequestResult;
export async function quickLogin(email: string, authToken: string): Promise<QuickLoginResult> {
  const formData = new FormData();
  formData.append("email", email);

  return fetch(`${serverUrl}/quick_login`, {
    method: "POST",
    body: formData,
    headers: {
      "x-auth-token": authToken
    }
  })
    .then(res => res.json())
}

export type CloudSaveInfo = {
  title: string;
  characters: [string, number][];
  faces: [string, number][];
  playtime: string;
  timestamp: number;
  snapURL: string;
}

type CloudSaveInfoResult = RequestResult & {
  saveFileInfo?: CloudSaveInfo;
};

export async function getCloudsaveInfo(email: string, authToken: string): Promise<CloudSaveInfoResult> {
  const formData = new FormData();
  // formData.append("email", email);

  return fetch(`${serverUrl}/get_cloudsave_info`, {
    method: "POST",
    body: formData,
    headers: {
      "x-auth-token": authToken,
      "x-user-email": email
    }
  })
    .then(res => res.json())
}

export async function uploadCloudsave(
  email: string,
  authToken: string,
  //cloudsaveInfo: Blob,
  cloudsaveData: Blob): Promise<RequestResult> {
  const formData = new FormData();
  //formData.append("savefile", cloudsaveInfo);
  formData.append("savefile", cloudsaveData);

  return fetch(`${serverUrl}/upload_cloudsave`, {
    method: "POST",
    body: formData,
    headers: {
      "x-auth-token": authToken,
      "x-user-email": email
    }
  })
    .then(res => res.json());
}
type CloudSaveDownloadResult = RequestResult & {
  data?: string;
};

export async function downloadCloudsave(
  email: string,
  authToken: string): Promise<CloudSaveDownloadResult> {

  return fetch(`${serverUrl}/download_cloudsave`, {
    method: "POST",
    headers: {
      "x-auth-token": authToken,
      "x-user-email": email
    }
  })
    .then(res => res.json());
}
