const { ipcRenderer } = require('electron')

class InspectorIpcRenderer {
  // ------------------INSPECTOR
  connectInspector = async () => {
    await ipcRenderer.invoke('_connectInspector').then((_result) => {
      ipcRenderer.send('connect-inspector')
      ipcRenderer.once('connect-inspector', (_event, data) => {
        console.log(`inspector-connect : ${data.msg.toString()}`)
      })
    })
  }

  getStartScanCode = async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('getStartScanCode').then((result) => {
        return resolve(result)
      })
    })
  }

  defective = async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('defective').then((result) => {
        return resolve(result)
      })
    })
  }

  passed = async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('passed').then((result) => {
        return resolve(result)
      })
    })
  }
}

export default new InspectorIpcRenderer()
