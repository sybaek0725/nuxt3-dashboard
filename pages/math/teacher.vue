<!--
@파일(Method): teacher.vue
@작성자: LEE
@작성일: 2023-11-26 14:24
@설명: 수학 교사 메인페이지 
-->
<template>
    <div class="contents_wrap">
        <DisplayOffLine />
        <TitleWrap v-show="layerData?.titleWrap == 'on'" :temp-layer-state="tempLayerState" @control-layer="controlLayer" />
        <div :class="layerData?.scroll == 'no' ? '' : 'section_scroll'">
            <div id="contents_area" class="contents_area" :class="[layerData?.class, isOpen && 'h-auto']">
                <Memo v-if="isOpen" />
                <ClientOnly>
                    <component :is="useAsyncComponent(layerData?.component)" />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'math-teacher',
    middleware: 'auth'
});

onMounted(async () => {
    useWindowEvent();
    connectWebRTC();
    await apiClassStore.getClassStudent();
});

onBeforeUnmount(() => {
    disconnectWebRTC();
});

//클래스
const apiClassStore = useApiClassStore();

//메모
const { isOpen } = useWhboard();

//레이어
const layerStore = useLayerStore();
const { layers, layerData, layerDatas } = storeToRefs(layerStore);
const { tempFullState, tempLayerState, fullScreen, exitScreen } = useLayerSize();
const controlLayer = value => {
    if (value == 'max') {
        tempLayerState.value = value;
        fullScreen();
    } else if (value == 'min') {
        tempLayerState.value = value;
        exitScreen();
    }
};

//webRTC
const { connect, disconnect } = useTeacherWebRTC();
const connectWebRTC = () => {
    connect();
};
const disconnectWebRTC = () => {
    disconnect();
};
</script>
