<!--
@파일(Method): Index.vue
@작성자: 구주영 
@작성일: 2023-12-27 15:09
@설명: 룰렛
@수정:
-->
<template>
    <div class="dialog_message event_wrap">
        <div class="event_con">
            <div class="roullete_wrap">
                <div class="custom_roulette">
                    <Roulette
                        ref="wheel"
                        :key="rouletteKey"
                        :items="items"
                        base-display
                        :size="Number(500)"
                        center-indicator="true"
                        :display-border="options.showBorder"
                        @click="launchWheel"
                        @wheel-end="wheelEndedCallback"
                    >
                        <template #baseContent>
                            <button class="btn_start">
                                <span class="blind">시작</span>
                            </button>
                        </template>
                    </Roulette>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Object,
        required: true
    }
});

import { Roulette } from 'vue3-roulette';

const rouletteResult = ref(null);
const wheel = ref(null);
const rouletteKey = ref(0);
const emit = defineEmits('on-finish');

const launchWheel = () => {
    console.log('룰렛 돌리기 시작!');
    rouletteKey.value += 1;
    setTimeout(() => wheel.value.launchWheel(), 0);
};

// wheel-end 이벤트 핸들러
const wheelEndedCallback = resultItem => {
    rouletteResult.value = resultItem;
    emit('on-finish', rouletteResult);
};

const options = ref({
    sound: false,
    showBorder: true
});
</script>

<style lang="scss" scoped></style>
