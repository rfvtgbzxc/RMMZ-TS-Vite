import { CloudSaveManager } from "./CloudSaveManager";
import { recoverSystemInputOccupation, releaseSystemInputOccupation } from "./SystemInputOccupationRelease";
import "./cloudsave.css";
import { registerAndLogin, requestVerifyCode } from "./fetch";

class LoginSystem {
  container: HTMLDivElement;
  title: HTMLDivElement;
  loding: boolean = false;
  options: openOptions

  constructor(options: openOptions) {
    this.options = options;
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.id = "cloudsave_container";
    this.container.innerHTML = `<svg id="${this.createId("close")}" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 42L33 33M6 6L15 15L6 6Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 42L15 33M42 6L33 15L42 6Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    const closeButton = this.container.querySelector(`#${this.createId("close")}`) as HTMLDivElement;
    closeButton.onclick = () => {
      close();
      this.options.onClose?.();
    }
    document.body.appendChild(this.container);
  }
  createTitle() {
    this.title = document.createElement("div");
    this.title.textContent = "云存档登录"
    this.title.id = this.createId("title");
    this.container.appendChild(this.title);
  }
  createForm() {
    const form = document.createElement("form");
    form.id = this.createId("form");
    
    form.innerHTML = `   
      <div class="${this.createId("input_containter")}">
        <input type="text" autocomplete="off" name="account" placeholder="输入邮箱" class="${this.createId("input")}" id="${this.createId("account")}">
        <div id="${this.createId("send_email")}">发送验证码</div>
        <input type="text" autocomplete="off" name="verifyCode" placeholder="输入验证码" class="${this.createId("input")}" id="${this.createId("verifyCode")}">
      </div> 
      <div id="${this.createId("login")}">登&nbsp;&nbsp;录</div>
    `;

    const accountInput = form.querySelector(`#${this.createId("account")}`) as HTMLInputElement;
    const verifyCodeInput = form.querySelector(`#${this.createId("verifyCode")}`) as HTMLInputElement;
    const sendEmailButton = form.querySelector(`#${this.createId("send_email")}`) as HTMLDivElement;
    if(CloudSaveManager.getLocalUserEmail()){
      accountInput.value = CloudSaveManager.getLocalUserEmail()!;
    }

    sendEmailButton.onclick = () => {
      if (this.loding) {
        return;
      }
      sendEmailButton.innerHTML = "处理中...";
      this.loding = true;
      sendEmailButton.classList.add("loading");
      requestVerifyCode(accountInput.value)
        .then(res => {
          if (res.code === 0) {
            alert("验证码已发送至邮箱");
          }
          else {
            alert(res.info);
          }
        })
        .catch(err => {
          alert("发送验证码失败，请稍后再试");
        })
        .finally(() => {
          sendEmailButton.classList.remove(this.createId("loading"));
          this.loding = false;
          sendEmailButton.innerHTML = "发送验证码";
        });

    };

    const loginButton = form.querySelector(`#${this.createId("login")}`) as HTMLDivElement;
    loginButton.onclick = () => {
      if (this.loding) {
        return;
      }
      loginButton.innerHTML = "处理中...";
      this.loding = true;
      loginButton.classList.add("loading");
      const account = accountInput.value;
      registerAndLogin(account, verifyCodeInput.value)
        .then(res => {
          if (res.code === 0) {
            alert("登录成功");
            CloudSaveManager.setAuthToken(res.token!);
            CloudSaveManager.setLocalUserEmail(account);
            this.options.onLoginSuccess?.();
          }
          else {
            alert(res.info);
          }
        })
        .catch(err => {
          alert("登录失败，请稍后再试");
        })
        .finally(() => {
          loginButton.classList.remove(this.createId("loading"));
          this.loding = false;
          loginButton.innerHTML = "登&nbsp;&nbsp;录";
        });
    };
    this.container.appendChild(form);
  }
  render() {
    this.createContainer();
    this.createTitle();
    this.createForm();
  }
  createId(str: string) {
    return "cloudsave_" + str;
  }
}
type openOptions = {
  onLoginSuccess?: () => void,
  onClose?: () => void
}
function open(options: openOptions = {}) {
  releaseSystemInputOccupation();
  new LoginSystem(options).render();
}
function close() {
  const container = document.getElementById("cloudsave_container");
  container && document.body.removeChild(container);
  recoverSystemInputOccupation();
}

//open();



export { open, close };

// if (import.meta.hot) {
//   import.meta.hot.accept((newModule) => {
//     if (newModule) {
//       newModule.open();
//     }
//   })

//   import.meta.hot.dispose((data) => {
//     const container = document.getElementById("cloudsave_container");
//     container && document.body.removeChild(container);
//   })
// }