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
