import { ipcMain } from 'electron'

export interface TypeMiddleware {
  _check(): Promise<boolean>
  _reConnect(): Promise<{ ok: boolean; msg: string } | any>
  _disconnect(): Promise<any>
}

export class Common {
  async registMiddleware(obj: TypeMiddleware) {
    const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    const exclude = ['constructor', '_reConnect', '_check', '_disconnect']
    for (const property of properties) {
      if (exclude.includes(property)) continue

      ipcMain.handle(property, async (_event, res) => {
        const isConnect = property.substring(0, 7) === 'connect' ? true : await obj._check()
        const arg = res ? [...res] : null

        if (isConnect) {
          return arg ? await obj[property](...arg) : await obj[property]()
        } else {
          return { ok: false, msg: 'disconnect...' }
        }
      })
    }
  }

  ascii_to_hexa(str: string) {
    const arr1 = [] as any
    for (let n = 0, l = str.length; n < l; n++) {
      const hex = Number(str.charCodeAt(n)).toString(16)
      arr1.push(hex)
    }
    return arr1.join('')
  }

  hex_to_ascii(str: string) {
    const output = Buffer.from(str, 'hex')
    return output.toString()
  }

  hex_to_hexa(bf: Buffer) {
    const hex = [] as Array<string>
    for (const b of bf) {
      const h = Buffer.from([b]).toString('hex')
      hex.push(h)
    }
    return hex.join('')
  }
}

export default new Common()
