# RMMZ-TS-Vite
使用 vite, typescript 以及其他前端技术制作的插件开发脚手架，以提升 rmmz 游戏和插件的开发体验。

本脚手架与原本的游戏工程的 js 代码以及已有的插件兼容，而使用者在本脚手架上自己开发的插件代码则可以享受到现代前端开发技术的各种便利。例如模块化、类型检查、代码提示、热更新等。

具体来说，脚手架会生成并监听一个名为index.js的文件，只要游戏工程将这个文件作为插件导入，脚手架生成的代码就可以插件的形式运行在游戏中。

其他语言: [English](README_en.md)

## 启动
```
npm install
npm run dev
```
在浏览器中打开 http://localhost:5173/ 即可看到正运行的游戏.
开发中的变更会自动更新到浏览器中.

## 构建
```
npm run build
```
这将会生成一个 "dist" 文件夹，其中包含了由src文件夹中的代码生成的 index.js 文件;
以及一个 "meta" 文件夹，其中包含了使用各个插件原来名字的，仅有js注解的“形式插件”，供MZ的插件编辑器使用。

将这些文件都复制到的rmmz项目的 "js/plugins" 文件夹中即可。

## 开发一个新的插件
1.在src/plugins文件夹中新建一个文件夹，命名为你的插件名。

2.在src/index.ts中引入你的插件。
```
import './plugins/yourPlugin.ts';
```

3.完成，可以在浏览器中看到插件的效果了。
（在plugins一级目录新建的插件才能生成meta文件）

## 使用自己的项目
1.将你的项目复制并覆盖到project文件夹。

2.进行一次构建，复制"index.js"文件到project/js/plugins文件夹，并在游戏工程的插件编辑器中，导入"index.js"作为插件。

3.完成，index.js将作为一个插件被游戏工程使用，且在开发过程中会自动更新。

（如果完成了本次开发，想要脱离测试环境运行，需要重新build一次， 并将生成的index.js复制到游戏工程的js/plugins文件夹中覆盖原来的）

## 相较原生MZ插件开发的体验优化
1.提供了RMMZ类型的声明文件，以便在开发过程中使用类型检查和自动补全。

2.每个插件能维护一个独立的声明，描述自己对全局环境的修改。所有插件可以共同看见这种修改。

3.可以使用模块化特性。可以引用外部模块进行开发，也可以使用自己的模块开发。大型插件不再需要将所有代码都写在一个文件中。

4.基于vite的热更新支持，在开发界面时可以随时看到修改的效果。

## 后续更新计划
1.更多工具函数，例如冲突检测、插件参数处理、界面热更新、类jquery的alias函数等

2.基于本脚手架的各种小插件

3.定制编译界面，方便不熟悉代码的开发者，可以自行选择模块，生成需要的插件

4.将RMMZ本体代码也转换为typescript

欢迎提出issue和pr~