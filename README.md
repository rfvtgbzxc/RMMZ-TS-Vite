# RMMZ-TS-Vite
A scaffold using vite, typescript and other web-front techs to progress the experience of rmmz games and plugins development.

read this in other languages: [简体中文](README_ch.md)

## start
```
npm install
npm run dev
```
Then open http://localhost:5173/ in your browser.

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
Just replace the content of the "project" folder with your own project.

## experience optimization compared to native MZ plugin development

1. Provide RMMZ type declaration files for type checking and auto completion.

2. Each plugin can maintain an independent declaration to describe its modification to the global environment. All plugins can see this modification together.

3. Can use module features. You can use external modules for development, or you can use your own modules. Large plugins no longer need to write all the code in one file.

4. Based on vite's hot update support, you can see the effect of the modification at any time when developing the game interface.


