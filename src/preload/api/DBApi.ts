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
  async connectDB(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('_connectDB').then((result) => resolve(result))
    })
  }

  async disconnect() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('_disconnectDB').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async read(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('read').then((result) => resolve(result))
    })
  }

  async readUserSet(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const func = 'readUserSet'
      this.mIpcRenderer.invoke(func).then(({ ok, msg, data }) => resolve({ ok, msg, data }))
    })
  }

  async updateUserSet({
    host,
    port,
    antenna,
    buzzer,
    atn1,
    atn2,
    atn3,
    atn4,
    com,
    baudRate
  }): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const params = { host, port, antenna, buzzer, atn1, atn2, atn3, atn4, com, baudRate }
      this.mIpcRenderer.invoke('updateUserSet', [params]).then((result) => resolve(result))
    })
  }

  async update(epc): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('update', [epc]).then((result) => resolve(result))
    })
  }

  async insert(excelData: { [key: string]: string | number }): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('insert', [excelData]).then((result) => resolve(result))
    })
  }

  async deleteAll(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('deleteAll').then((result) => resolve(result))
    })
  }
}
