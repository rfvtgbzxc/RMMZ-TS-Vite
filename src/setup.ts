/**
 * setup.ts
 * 
 * 本文件在开发环境中代替 main.js，用于系统的启动。
 * 
 * 重点在于，其针对插件的打包代码做了针对处理，这块代码会被替换为模块代码。
 * 请确保这个文件位于 src 直接目录下
 */

const effekseerWasmUrl = "js/libs/effekseer.wasm";
const moduleScriptName = "index";

class Main {
  xhrSucceeded = false;
  loadCount = 0;
  error: Error | null = null;
  numScripts = 0;

  run() {
    this.showLoadingSpinner();
    // @ts-expect-error
    PluginManager.setup($plugins);
    this.xhrSucceeded = true;
    window.addEventListener("load", this.onWindowLoad.bind(this));
      // .then(_ => this.xhrSucceeded = true)
      // .finally(() => this.onWindowLoad());
  }

  showLoadingSpinner() {
    const loadingSpinner = document.createElement("div");
    const loadingSpinnerImage = document.createElement("div");
    loadingSpinner.id = "loadingSpinner";
    loadingSpinnerImage.id = "loadingSpinnerImage";
    loadingSpinner.appendChild(loadingSpinnerImage);
    document.body.appendChild(loadingSpinner);
  }

  eraseLoadingSpinner() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) {
      document.body.removeChild(loadingSpinner);
    }
  }

  onScriptError(e: string | Event) {
    // @ts-ignore
    const text = typeof (e) === "string" ? e : ((e as Event).target as HTMLScriptElement)?._url || "unkown name";
    this.printError("Failed to load", text);
  }

  printError(name: string, message: string) {
    this.eraseLoadingSpinner();
    if (!document.getElementById("errorPrinter")) {
      const errorPrinter = document.createElement("div");
      errorPrinter.id = "errorPrinter";
      errorPrinter.innerHTML = this.makeErrorHtml(name, message);
      document.body.appendChild(errorPrinter);
    }
  }

  makeErrorHtml(name: string, message: string) {
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    nameDiv.id = "errorName";
    messageDiv.id = "errorMessage";
    nameDiv.innerHTML = name;
    messageDiv.innerHTML = message;
    return nameDiv.outerHTML + messageDiv.outerHTML;
  }

  onWindowLoad() {
    if (!this.xhrSucceeded) {
      const message = "Your browser does not allow to read local files.";
      this.printError("Error", message);
    } else if (this.isPathRandomized()) {
      const message = "Please move the Game.app to a different folder.";
      this.printError("Error", message);
    } else if (this.error) {
      this.printError(this.error.name, this.error.message);
    } else {
      this.initEffekseerRuntime();
    }
  }

  onWindowError(event: ErrorEvent) {
    if (!this.error) {
      this.error = event.error;
    }
  }

  isPathRandomized() {
    // [Note] We cannot save the game properly when Gatekeeper Path
    //   Randomization is in effect.
    return (
      // @ts-expect-error
      typeof process === "object" &&
      // @ts-expect-error
      process.mainModule.filename.startsWith("/private/var")
    );
  }

  initEffekseerRuntime() {
    const onLoad = this.onEffekseerLoad.bind(this);
    const onError = this.onEffekseerError.bind(this);
    // @ts-expect-error
    effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
  }

  onEffekseerLoad() {
    this.eraseLoadingSpinner();
    SceneManager.run(Scene_Boot);
  }

  onEffekseerError() {
    this.printError("Failed to load", effekseerWasmUrl);
  }
}

PluginManager.loadScript = function(filename) {
  let url = this.makeUrl(filename);
  const script = document.createElement("script");
  if(filename === moduleScriptName){
    url = `src/${moduleScriptName}.ts`;
    script.type = "module";
  }
  else{
    script.type = "text/javascript";
  }
  script.src = url;
  script.async = false;
  script.defer = true;
  script.onerror = this.onError.bind(this);
  // @ts-expect-error
  script._url = url;
  document.body.appendChild(script);
};

// @ts-ignore
StorageManager.fileDirectoryPath = function() {
  // @ts-ignore
  const path = require("path");
  // const base = path.dirname(process.mainModule.filename);
  // @ts-ignore
  return path.join(process.mainModule.filename, "save/");
};

new Main().run();
