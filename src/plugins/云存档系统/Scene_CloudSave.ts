import { CloudSaveManager } from "./CloudSaveManager";

class Scene_CloudSave extends Scene_MenuBase {
  _commandWindow: Window_CloudServeCommands;
  _serveStatusWindow: Window_CloudServeStatus;
  create(): void {
    super.create();
    this.createTitle();
    this.createStatusWindow();
    this.createCloudServeCommandWindow();
  }

  start(): void {
    super.start();
    CloudSaveManager.refreshOnlineState()
    .then(() => this.refresh());
  }

  refresh(){
    this._serveStatusWindow.refresh();
    this._commandWindow.refresh();
  }

  createTitle() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      // fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#ffffff'], // gradient
      stroke: '#000000',
      strokeThickness: 5,
      dropShadow: false,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: 'round',
    });
    const titleText = new PIXI.Text("云存档", style);
    titleText.x = Graphics.width / 2 - titleText.width / 2;

    this.addChild(titleText);
  }

  createStatusWindow() {
    const y = this.mainAreaTop() + 50;
    const width = 300;
    const x = Graphics.width / 2 - width / 2;
    const rect = new Rectangle(x, y, width, 200);
    const statusWindow = new Window_CloudServeStatus(rect);
    this._serveStatusWindow = statusWindow;
    this.addWindow(statusWindow);

  }

  createCloudServeCommandWindow() {
    const y = this.mainAreaTop() + 300;
    const x = Graphics.width / 2 - 400 / 2;
    const rect = new Rectangle(x, y, 400, 150);

    const window = new Window_CloudServeCommands(rect);
    window.setHandler("pingServer", this.commandPingServer.bind(this));
    window.setHandler("login", this.commandLogin.bind(this));
    window.setHandler("logout", this.commandLogout.bind(this));
    window.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(window);
    this._commandWindow = window;
  }

  async commandPingServer() {
    await CloudSaveManager.refreshOnlineState();
    this.refresh();
    this._commandWindow.activate();
  }

  commandLogin() {
    CloudSaveManager.openLoginAndRegisterWindow({
      onClose: () => {
        this.refresh();
        this._commandWindow.activate();
      }
    });
  }

  commandLogout() {
    CloudSaveManager.logout();
    this.refresh();
    this._commandWindow.activate();
  }
}

class Window_CloudServeCommands extends Window_Command {

  makeCommandList() {
    switch (CloudSaveManager.onlineState) {
      case "offline":
        this.addCommand("连接服务器", "pingServer");
        break;
      case "notLogin":
        this.addCommand("登录", "login");
        break;
      case "login":
        this.addCommand("切换账号", "login");
        this.addCommand("下线", "logout");
        break;
      default:
        break;
    }
  };
}
const iconIndexMap = {
  "offline": 33,
  "notLogin": 34,
  "login": 35
}
const stateNames = {
  "offline": "离线",
  "notLogin": "未登录",
  "login": "已登录"
}
class Window_CloudServeStatus extends Window_Base {
  constructor(rect: Rectangle) {
    super(rect);
    this.refresh();
  }

  refresh() {
    this.contents.clear();
    this.drawStatus();
    this.drawUser();
  }

  drawUser() {
    const user = CloudSaveManager.getLocalUserEmail();
    if (user) {
      const text = `${user}`;
      this.drawTextEx(text, 0, 0, this.width);
    }
  }

  drawStatus() {
    const status = CloudSaveManager.onlineState;
    const statusText = stateNames[status];
    const iconIndex = iconIndexMap[CloudSaveManager.onlineState];
    const text = `当前状态：${statusText} \\I[${iconIndex}]`;
    this.contents.fontSize = 24;
    this.drawTextEx(text, 0, 30, this.width);
  }
}


export { Scene_CloudSave };

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      if (SceneManager._scene instanceof Scene_CloudSave) {
        SceneManager.goto(newModule.Scene_CloudSave);
      }
    }
  })

  import.meta.hot.dispose((data) => {
    //RemoveKeyToStartScene("tab");
  })
}