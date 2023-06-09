<script setup lang="ts" scoped>
import tSetPowerGain from '@template/idro/tSetPowerGain.vue'
import tSetConnect from '@template/idro/tSetConnect.vue'
import tSetBuzzer from '@template/idro/tSetBuzzer.vue'
import tSetWrite from '@template/idro/tSetWrite.vue'
import tSetRead from '@template/idro/tSetRead.vue'
import tSetAtn from '@template/idro/tSetAtn.vue'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import dbManager from '@renderer/util/dbManager'

defineProps({ isRemote: { type: Boolean, default: false } })

const saveSetting = async () => {
  const { atn1, atn2, atn3, atn4 } = store.idro.powerGain
  const buzzer = store.idro.onBuzzer ? 1 : 0
  let antenna = 1
  for (let i = 1; i <= 15; i++) {
    const { atn1, atn2, atn3, atn4 } = store.idro.atnInfo
    const { atnPacket } = store.idro
    const isActive =
      atnPacket()[i].atn1 === atn1 &&
      atnPacket()[i].atn2 === atn2 &&
      atnPacket()[i].atn3 === atn3 &&
      atnPacket()[i].atn4 === atn4
    if (isActive) {
      antenna = i
      break
    }
  }

  await dbManager.updateUserSet({ antenna, buzzer, atn1, atn2, atn3, atn4 })
}
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <div
      v-if="!store.idro.connect"
      class="absolute top-0 left-0 w-full h-full opacity-50 bg-red-400 z-10"
    />
    <t-set-connect v-show="!isRemote" class="absolute top-0 right-0 z-15" />

    <div class="flex p-4">
      <a-button label="세팅 저장" add-style="hover:bg-teal-400" @on-parent-event="saveSetting" />
      <p :class="store.idro.connect ? 'opacity-0' : 'opacity-1'" class="text-white z-15 p-2">
        IDRO가 연결되어 있지 않습니다.
      </p>
    </div>

    <div class="flex flex-wrap h-fit items-center gap-4 pr-180">
      <t-set-atn />
      <t-set-power-gain />
      <t-set-buzzer />
      <t-set-read />
      <t-set-write />
    </div>
  </div>
</template>
