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
      this.mIpcRenderer.invoke('connectDB').then((result) => {
        return resolve(result)
      })
    })
  }

  read = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('read').then((result) => {
        return resolve(result)
      })
    })
  }

  update = async (epc): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('update', [epc]).then((result) => {
        return resolve(result)
      })
    })
  }

  insert = async (epc: any): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('insert', [epc]).then((result) => {
        return resolve(result)
      })
    })
  }

  deleteAll = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('deleteAll').then((result) => {
        return resolve(result)
      })
    })
  }
}
