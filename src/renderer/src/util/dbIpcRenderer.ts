const { ipcRenderer } = require('electron')

interface TypeDBResponse {
  ok: boolean
  msg: string
  data?: any[]
}

class dbIpcRenderer {
  create = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('create').then((result) => {
        return resolve(result)
      })
    })
  }

  read = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('read').then((result) => {
        return resolve(result)
      })
    })
  }

  update = async (epc): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('update', [epc]).then((result) => {
        return resolve(result)
      })
    })
  }

  isDuplicate = async (epc): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('isDuplicate', [epc]).then((result) => {
        return resolve(result)
      })
    })
  }

  insert = async (epc: any): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('insert', [epc]).then((result) => {
        return resolve(result)
      })
    })
  }

  deleteAll = async (): Promise<TypeDBResponse> => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('deleteAll').then((result) => {
        return resolve(result)
      })
    })
  }
}

export default new dbIpcRenderer()
