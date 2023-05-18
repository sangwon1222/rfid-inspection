export default {
  startReadRFID: '>f \r\n',
  stopReadRFID: '>3 \r\n',

  reset: '>E 1 2 6\r\n',
  start: '>start\r\n',
  stop: '>3\r\n',

  getReaderState: '>7\r\n',
  readerReboot: '>S\r\n',
  readerQuickReset: '>E 1 2 6\r\n',
  // tag
  setTagPassword: '>w 0 2 12345678 \r\n', //12345678 => 비밀번호 자리
  readTagPassword: '>r 0 2 2 \r\n',
  setLockTagPassword: '>l 0030 0020 \r\n', //12345678 => 비밀번호 자리

  // Reader password ‘0’
  // >x w 0
  // EPC Bank 1word “1234” write
  // >w 1 2 1234
  notPassWriteTag1: '>x w 0  \r\n',
  notPassWriteTag2: '>w 1 2 1234  \r\n', // 1234=> 비밀번호 자리

  // set Buzzer volumn
  onBuzzer: '>x b 1\r\n',
  offBuzzer: '>x b 0\r\n',

  // set Atnenna port
  onAtn1: '>x e 1\r\n',
  onAtn2: '>x e 2\r\n',
  onAtn1Atn2: '>x e 3\r\n',
  onAtn3: '>x e 4\r\n',
  onAtn1Atn3: '>x e 5\r\n',
  onAtn2Atn3: '>x e 6\r\n',
  onAtn1Atn2Atn3: '>x e 7\r\n',
  onAtn4: '>x e 8\r\n',
  onAtn1Atn4: '>x e 9\r\n',
  onAtn2Atn4: '>x e 10\r\n',
  onAtn1Atn2Atn4: '>x e 11\r\n',
  onAtn3Atn4: '>x e 12\r\n',
  onAtn1Atn3Atn4: '>x e 13\r\n',
  onAtn2Atn3Atn4: '>x e 14\r\n',
  onAtn1Atn2Atn3Atn4: '>x e 15\r\n',

  //set Atnenna Switch time
  setAtnSecond1: '>x j 1000\r\n',
  setAtnSecond2: '>x j 2000\r\n',
  setAtnSecond3: '>x j 3000\r\n',
  setAtnSecondMax: '>x j 10000\r\n',

  // power gain
  powerGainWeek: '>x p 50\r\n', // 50 ~ 310
  powerGainAtn1Week: '>x p1 50\r\n'
}
