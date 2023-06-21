import dbManager from '@util/dbManager'
import { store } from '@store/store'

export const groupLog = (ok: boolean, label: string, ary: string[]) => {
  const color = ok ? 'color:#64748b; background: #5eead4;' : 'color:#fff; background: #ef4444;'
  const subColor = ok ? 'color:#000000; background: #117a6a;' : 'color:#fff; background: #7b1616;'
  const style = 'padding: 4px; font-bold: bold;'

  console.groupCollapsed(`%c ${label}`, `${style} ${color}`)
  for (let i = 0; i < ary.length; i++) {
    console.log(`%c ${ary[i]}`, `${style}  ${subColor}`)
  }
  console.groupEnd()
}

export const saveSetting = async () => {
  const { path, baudRate } = store.inspector.default

  const { host, port } = store.idro.default
  const { atn1, atn2, atn3, atn4 } = store.idro.powerGain
  const buzzer = store.idro.onBuzzer ? 1 : 0

  let antenna = 1
  for (let i = 1; i <= 15; i++) {
    const { atn1, atn2, atn3, atn4 } = store.idro.atnInfo
    const packet = store.idro.atnPacket()[i]
    const isActive =
      packet.atn1 === atn1 && packet.atn2 === atn2 && packet.atn3 === atn3 && packet.atn4 === atn4
    if (isActive) {
      antenna = i
      break
    }
  }

  await dbManager.updateUserSet({
    host,
    port,
    antenna,
    buzzer,
    atn1,
    atn2,
    atn3,
    atn4,
    com: path,
    baudRate
  })
}
