// 全局类型声明

interface ElectronAPI {
  ipcRenderer: {
    on: (channel: string, listener: (...args: any[]) => void) => void
    send: (channel: string, ...args: any[]) => void
    invoke: (channel: string, ...args: any[]) => Promise<any>
    removeListener: (channel: string, listener: (...args: any[]) => void) => void
  }
}

declare global {
  interface Window {
    api: ElectronAPI
  }

  var electron: ElectronAPI
}

export {}