<!--
@파일(Method): Share.vue
@작성자: LEE
@작성일: 2024-03-12 14:01
@설명: 화면 공유
-->
<template>
    <div class="player_wrap">
        <div class="player_area">
            <div class="img_wrap">
                <video ref="videoRef" autoplay playsinline muted data-fit="cover" autoPictureInPicture="true" crossorigin="anonymous" />
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(async () => {
    playVideo();
});

const { layerData } = storeToRefs(useLayerStore());
const videoRef = ref(null);
const playVideo = () => {
    if (layerData.value.displayShare.id) {
        videoRef.value.srcObject = layerData.value.displayShare;
    }

    videoRef.value.style.width = '100%';
    videoRef.value.load();
};
</script>
