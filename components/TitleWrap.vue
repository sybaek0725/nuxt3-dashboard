<!--
@파일(Method): TitleWrap.vue
@작성자: LEE
@작성일: 2023-11-30 17:15
@설명: title bar
@수정: 퍼블 적용(LEE-24.02.01) 
       프린트 모바일일 경우 예외 처리(LEE-24.02.27) 
-->
<template>
    <div class="navigator print-none">
        <div ref="navWrap" class="nav_wrap">
            <div class="nav_tab">
                <ul ref="navTab" class="nav_scroll" :style="{ transform: 'translateX(' + nTransX + 'px)' }">
                    <li
                        v-for="(item, index) in layers.filter(e => e.titleWrap == 'on')"
                        :key="index"
                        ref="navItem"
                        class="tab_item"
                        :class="[item.state == 'on' ? 'active' : '']"
                    >
                        <span @click="controlLayer(item, 'on')">
                            {{ item.name ? (item.locale == 'off' ? item.name : t(item.name)) : '' }}
                        </span>
                        <i class="btn_close" @click="controlLayer(item, 'off')"></i>
                    </li>
                </ul>
            </div>
            <div ref="navBtn" class="nav_btn_wrap">
                <span class="ico_prev" @click="navigatorMove('prev')"></span>
                <span class="ico_next" @click="navigatorMove('next')"></span>
                <span class="ico_write" @click="isOpen ? closeWhboard() : openWhboard()"></span>
                <span class="ico_print" @click="printContents"></span>
            </div>
        </div>
        <Modal v-if="type === 'print'">
            <span>현재 기기는 인쇄 기능을 지원하지 않습니다. <br />프린터가 연결된 기기에서 인쇄해 주세요.</span>
        </Modal>
    </div>
</template>

<script setup>
onMounted(() => {
    watch(
        () => [layerData.value?.timestamp, navItem.value?.length],
        () => {
            navigatorSetting();
        }
    );
});

const props = defineProps({
    tempLayerState: {
        type: String,
        default: 'min',
        required: true
    }
});

const { t } = useI18n();
const { openModal, closeModal, type } = useModal();

//탭기능
const nTransX = ref(0);
const nMoveIdx = ref(0);
const nCurrentIdx = ref(0);
const navItem = ref(null);
const navWrap = ref(null);
const navTab = ref(null);
const navBtn = ref(null);
const navigatorMove = step => {
    const nItemSize = navItem.value?.length - 1;
    const navigator = navWrap.value.offsetWidth - navBtn.value.offsetWidth;
    const nav = navTab.value.offsetWidth;
    let positonX;

    if (navigator < nav && navItem.value) {
        if (step === 'next' && navItem.value[nMoveIdx.value]) {
            positonX = navItem.value[nMoveIdx.value].offsetWidth * -1;

            if (nMoveIdx.value == nItemSize && nTransX.value == 0) {
                nTransX.value = navigator - nav + positonX;
                nMoveIdx.value = nItemSize;
            } else if (nMoveIdx.value !== nItemSize) {
                nTransX.value = nTransX.value + positonX;
                nMoveIdx.value++;
            }
        } else if (step === 'prev' && navItem.value[nMoveIdx.value - 1]) {
            positonX = navItem.value[nMoveIdx.value - 1].offsetWidth;

            if (nMoveIdx.value != 0 && Math.abs(nTransX.value) > positonX) {
                nTransX.value = nTransX.value + positonX;
                nMoveIdx.value--;
            } else {
                nTransX.value = 0;
                nMoveIdx.value = 0;
            }
        }
    } else {
        nTransX.value = 0;
    }
};
const navigatorSetting = () => {
    if (layerData.value?.titleWrap != 'on') return false;

    const items = layers.value?.filter(e => e.titleWrap == 'on');
    items.forEach((element, index) => {
        if (element.id == layerData.value?.id) {
            nCurrentIdx.value = index;
            nMoveIdx.value = nCurrentIdx.value;
        }
    });

    if (items.length > 0) {
        let moveType;
        if (nCurrentIdx.value < Math.round(items.length / 2)) {
            moveType = 'prev';
        } else {
            moveType = 'next';
        }

        nTransX.value = 0;
        navigatorMove(moveType);
    }
};

//레이어 정보
const layerStore = useLayerStore();
const { layers, layerData } = storeToRefs(layerStore);
const emit = defineEmits(['control-layer']);
const controlLayer = (item, value) => {
    if (value == 'max' || value == 'min') {
        emit('control-layer', value);
    } else {
        item.state = value;
        layerStore.setLayer(item);
    }
    closeWhboard();
};

//인쇄하기
const printContents = () => {
    if (useAgent().isMobile()) {
        openModal({ type: 'print', buttonLabels: ['확인'], closeBtnClass: false });
    } else {
        window.print();
    }
};

//메모하기
const { isOpen, openWhboard, closeWhboard } = useWhboard();
</script>

<style lang="scss">
@media print {
    .print-none {
        display: none !important;
    }
    .contents_wrap {
        height: 100% !important;
        width: 100%;
    }
    .board {
        canvas {
            width: 500px !important ;
        }
    }
    body {
        transform: scale(1);
        transform-origin: 0 0;
    }
}
</style>
