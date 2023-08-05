import { defineConfig } from 'vite'
import path from 'path'
import writeAFile from './genMeta'
const resolveFile = function (filePath) {
  return path.join(__dirname, './', filePath)
}

const resolvePluginFile = function (filePath) {
  return path.join(__dirname, './src/', filePath)
}

export default defineConfig({
  publicDir: "project",
  build: {
    lib: {
      entry: [resolvePluginFile('index.ts')],
      name: 'RC_Plugins',
      formats: ['umd',],
      fileName: (_, entry) => `${entry}.js`
    },
    rollupOptions:
    {

    },
    copyPublicDir: false

  },
  plugins: [writeAFile()]
})