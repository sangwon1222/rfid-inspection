<script setup lang="ts" scoped>
import tGnb from '@template/navigation/tGlobalNaviBar.vue'
import tSnb from '@template/navigation/tSideNaviBar.vue'
import serialManager from '@util/serialManager'
import tLoading from '@template/tLoading.vue'
import tcpManager from '@util/tcpManager'
import dbManager from '@util/dbManager'
import { store } from '@store/store'
import { onMounted, computed } from 'vue'
const isLoading = computed(() => store.loading.isLoading)

onMounted(async () => {
  store.loading.isLoading = true

  // IDRO TCP 연결
  await tcpManager.connectPrint()
  // 검수기 시리얼포트 연결
  await serialManager.connectSerialPort()
  // DB 엑셀 연결, 유저 설정(.txt) 불러오기
  await dbManager.connectDB()
  const { ok, data } = await dbManager.readUserSet()
  // 유저 설정(.txt) 있으면 적용
  if (ok) await setUserSet(JSON.parse(data))

  store.loading.init()
})

/**
 * @description 유저 정보(.txt) 불러와서 IDRO 설정
 * @param data text=> JSON으로 변환한 데이터
 */
const setUserSet = async (data: { [key: string]: number }) => {
  try {
    const { antenna, buzzer, atn1, atn2, atn3, atn4 } = data
    const atnInfo = store.idro.atnPacket()[antenna]

    store.idro.atnInfo = { ...atnInfo }
    store.idro.powerGain = { atn1, atn2, atn3, atn4, atn0: 300 }
    store.idro.onBuzzer = Boolean(buzzer)
    await setIdroInit()
  } catch (e) {
    console.error(e)
  }
}

/**
 * @description 유저가 저장한 설정으로 IDRO 설정
 */
const setIdroInit = async () => {
  try {
    await tcpManager[store.idro.onBuzzer ? 'onBuzzer' : 'offBuzzer']()
    await tcpManager.antenna()
    await tcpManager.onPowerGain(1)
    await tcpManager.onPowerGain(2)
    await tcpManager.onPowerGain(3)
    await tcpManager.onPowerGain(4)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <t-loading v-if="isLoading" />
  <t-gnb />
  <div class="overflow-hidden flex w-full h-screen pt-40">
    <div :class="store.snbFold ? 'w-full' : 'w-[calc(100vw-310px)]'" class="h-full">
      <router-view />
    </div>

    <!-- <div
      class="fixed top-40 right-0 min-h-[calc(100vh-50px)] box-border duration-500 z-10"
      :class="store.snbFold ? 'w-0 p-0' : 'w-310 p-1'"
    >
      <button
        class="fold-btn"
        :class="store.snbFold ? 'after:rotate-225' : 'after:rotate-45'"
        @click="store.snbFold = !store.snbFold"
      />
      <t-snb />
    </div> -->
  </div>
</template>

<style lang="less" scoped>
.fold-btn {
  @apply fixed 
  top-1/2 
  right-60 
  z-20 
  duration-150  
  translate-y-2/4 
  translate-x-2/4
  after:content-['']
  after:absolute 
  after:block 
  after:w-35
  after:h-35 
  after:border-teal-600
  after:border-t-[calc(8px)]
  after:border-r-[calc(8px)]
  after:mt-14
  after:ml-2;
}
</style>
