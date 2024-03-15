<!--
@파일(Method): Main.vue
@작성자: 
@작성일: 2024-02-02 16:41
@설명: 외부연동 메인
-->
<template>
    <div class="study_item_con">
        <v-btn @click="setLink('contents')">자료검색</v-btn>
        <v-btn @click="setLink('whboard')">화이트보드</v-btn>
        <v-btn @click="setLink('nuri')">누리집연동</v-btn>
        <v-btn @click="setLink('reference.list')">수업 자료 목록으로 가기</v-btn>
    </div>
</template>

<script setup>
const layerStore = useLayerStore();

const setLink = value => {
    layerStore.setAddLayer(value);
};
</script>
