class MiddleWare {
  async excute(funcName: string, arg?: any) {
    const valid = funcName[0] === '_' ? true : await this._check()

    if (valid) {
      const result = arg ? await this[funcName](...arg) : await this[funcName]()
      return result
    } else {
      return 'DISCONNECT TCP'
    }
  }
  async _check(): Promise<boolean | any> {
    //
  }
}

export default MiddleWare
