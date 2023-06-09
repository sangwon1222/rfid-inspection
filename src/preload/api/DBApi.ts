interface TypeDBResponse {
  ok: boolean
  msg?: string
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

  readUserSet = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      const func = 'readUserSet'
      this.mIpcRenderer.invoke(func).then(({ ok, msg, data }) => resolve({ ok, msg, data }))
    })
  }

  updateUserSet = async ({ antenna, buzzer, atn1, atn2, atn3, atn4 }): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      const params = { antenna, buzzer, atn1, atn2, atn3, atn4 }
      this.mIpcRenderer.invoke('updateUserSet', [params]).then((result) => resolve(result))
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
