interface TypeDBResponse {
  ok: boolean
  msg: string
  data?: any[]
}

export default class DBapi {
  private mIpcRenderer: any
  constructor(ipcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  connectDB = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('_connectDB').then((result) => resolve(result))
    })
  }

  async disconnect() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('_disconnectDB').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  read = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('read').then((result) => resolve(result))
    })
  }

  update = async (epc): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('update', [epc]).then((result) => resolve(result))
    })
  }

  insert = async (epc: any): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('insert', [epc]).then((result) => resolve(result))
    })
  }

  deleteAll = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('deleteAll').then((result) => resolve(result))
    })
  }
}
