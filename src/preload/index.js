import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { exec } from 'child_process'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    // window.addEventListener('DOMContentLoaded', () => {
    //   exec(`npm run server`)
    // })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  // window.addEventListener('DOMContentLoaded', () => {
  //   exec(`npm run server`)
  // })
}
