class DBmanager {
  async connectDB() {
    try {
      const result = await window.DBapi.connectDB()
      console.log('DB', result)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async read() {
    try {
      const result = await window.DBapi.read()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async update() {
    try {
      const result = await window.DBapi.update()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async insert(epc: any) {
    try {
      const result = await window.DBapi.insert(epc)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async deleteAll() {
    try {
      const result = await window.DBapi.deleteAll()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }
}

export default new DBmanager()
