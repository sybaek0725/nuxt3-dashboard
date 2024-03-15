<!--
@파일(Method): Iframe.vue
@작성자: LEE
@작성일: 2023-12-28 11:36
@설명: 외부 iframe 연동
@수정:
-->
<template>
    <iframe
        id="iframe"
        :src="layerData.iframeUrl"
        :height="iframeHeight"
        crossorigin="anonymous"
        style="overflow-x: hidden; overflow-y: auto; width: 100%; min-height: 1100px"
    />
</template>

<script setup>
onMounted(() => {
    setIframe();

    watch(
        () => layerData.value?.pageOut,
        value => {
            if (network.value != 'offline' && layerData.value?.beforeunload && value == 'on') {
                if (!confirm('이동하시겠습니까?')) {
                    setPageOut('off'); //취소
                } else {
                    setPageOut('on'); //확인
                }
            }
        }
    );
});

//페이지 일탈일 경우
const network = ref(useCookie('network'));
const layerStore = useLayerStore();
const { layerData, layerDatas } = storeToRefs(layerStore);
const setPageOut = value => {
    layerData.value.pageOut = value;

    if (value == 'on') {
        if (!layerData.value.page.child) {
            layerData.value.page.state = 'on';
            layerStore.setLayer(layerData.value.page);
        } else {
            const init = layerDatas.value.find(e => e.id == layerData.value.page.parent);
            layerStore.setLayerHeader(init);
            layerStore.setAddLayer(layerData.value.page.id);
        }
    } else {
        const init = layerDatas.value.find(e => e.id == layerData.value.parent);
        layerStore.setLayerHeader(init);
    }
};

//아이프레임 연동
const iframeHeight = ref('1100');
const setIframe = () => {
    /*
    TODO: iframe 연동 방안 검토 후 현행화 필요
    CHECKLIST: 임시로 학생 대시보드 화면 구성, 브라우저 확대/축소시 iframe 사이즈 역행 이슈
    */
    document.getElementById('iframe').addEventListener('load', function () {
        iframeHeight.value = '2000'; //window.postMessage 높이 전달받기
    });
};
</script>
