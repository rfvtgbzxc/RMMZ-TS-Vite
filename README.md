# RMMZ-TS-Vite
A scaffold using vite, typescript and other web-front techs to progress the experience of rmmz games and plugins development.

This scaffold is compatible with the js code of the original game project and the plugins, while the plugins developed on this scaffold can enjoy the convenience of modern web-front techs, such as module, type check, code hint, hot update, etc.

Specifically, the scaffold will generate and watch a file named index.js, as long as the game project imports this file as a plugin, the code of the scaffold can run as a plugin in the game.

read this in other languages: [简体中文](README_ch.md)

## start
```
npm install
npm run dev
```
Then open http://localhost:5173/ in your browser.
The changes you made will be updated to the browser automatically.

## build
```
npm run build
```
This will generate a "dist" folder, which contains a index.js of the src code;
And a "meta" folder, which contains the plugins' meta data.

Just copy these files to your rmmz project's "js/plugins" folder, and they will work greatly on your game in production.

## develop a new plugin
1. Create a folder in src/plugins, name it as your plugin name.

2. Import your plugin in src/index.ts.
``` 
import './plugins/yourPlugin.ts';
```
3. Done, you can see your plugin's effect in the browser.
(only plugins created in plugins folder directly can generate meta files)

## use your own project
1. Copy your project to "project" folder.
2. Make a build and copy the "dist/index.js" to "project/js/plugins" folder. Then import it in your game project.
3. Done,  "index.js" is the entry of all plugins from the scaffold.And it will update automatically when you make changes to your project.

## experience optimization compared to native MZ plugin development

1. Provide RMMZ type declaration files for type checking and auto completion.

2. Each plugin can maintain an independent declaration to describe its modification to the global environment. All plugins can see this modification together.

3. Can use module features. You can use external modules for development, or you can use your own modules. Large plugins no longer need to write all the code in one file.

4. Based on vite's hot update support, you can see the effect of the modification at any time when developing the game interface.

## future updates plan
1. More utility functions, such as conflict detection, plugin parameter processing, interface hot update, alias function of jquery-like library, etc.

2. Various small plugins based on this scaffold.

3. Customized compilation interface, which is convenient for developers who are not familiar with code. They can choose modules and generate the plugins they need.

4. Convert RMMZ's native code to typescript.

glad to see your suggestions and contributions.


