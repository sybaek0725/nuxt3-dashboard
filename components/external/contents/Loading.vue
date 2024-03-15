<!--
@파일(Method): Loading.vue
@작성자: seungju.kim
@작성일: 2023-12-14 11:47
@설명: 콘텐츠 연동 전송 중 콘텐츠 영역
-->
<template>
    <div v-if="layerData.itemData.type === 'image'" class="class_board">
        <v-img :src="layerData.itemData.servicePath" :alt="layerData.itemData.title" />
    </div>
    <div v-else-if="layerData.itemData.type === 'video'">
        <ViewerVod :service-path="layerData.itemData.servicePath" :service-thumbnail-path="layerData.itemData.serviceThumbnailPath" />
    </div>
    <div v-else-if="layerData.itemData.type === 'pdf'" class="papers_box_wrap">
        <div class="class_board class_board_box">
            <ViewerPdf :service-path="layerData.itemData.servicePath" />
        </div>
    </div>
    <div v-else>
        <ViewerFileCard
            :file-name="layerData.itemData.title"
            :file-type="layerData.itemData.type"
            :file-url="layerData.itemData.servicePath"
        />
    </div>
</template>

<script setup>
const { layerData } = useLayerStore();
</script>
