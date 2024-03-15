<!--
@파일(Method): Iframe.vue
@작성자: 
@작성일: 2024-01-09 13:30
@설명: 콘텐츠 영역 - 아이프레임
-->
<template>
    <iframe
        id="iframe"
        :src="iframeUrl"
        :height="iframeHeight"
        crossorigin="anonymous"
        style="overflow-x: hidden; overflow: auto; width: 100%; height: 520px"
    ></iframe>
</template>

<script setup>
const props = defineProps({
    iframeUrl: {
        type: String,
        default: ''
    }
});

/*
TODO: iframe 연동 방안 검토 후 현행화 필요
CHECKLIST: 임시로 학생 대시보드 화면 구성, 브라우저 확대/축소시 iframe 사이즈 역행 이슈
*/
const iframeSrc = ref();
const iframeHeight = ref('900');
const setIframe = () => {
    // document.getElementById('iframe').addEventListener('load', function () {
    // });
};
</script>
