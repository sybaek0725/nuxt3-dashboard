<!--
@파일(Method): Textbook.vue
@작성자: 박보현 
@작성일: 2023-12-08 15:46
@설명: 교과서 보기
@수정:
-->
<template>
    <div class="contents_title">
        <em>{{ layerData.selected.chapterNum }}.{{ layerData.selected.name }}</em>
        <span v-if="layerData.entry === 'period'" class="ellipsis"
            >[{{ layerData.session.lessonStep }}차시] {{ layerData.session.lessonName }}</span
        >
    </div>
    <ViewerPdf :service-path="source" :entry="'textbook'" />
</template>

<script setup>
const { layerData } = useLayerStore();
const source = ref(
    layerData.entry === 'chapter' ? layerData.selected.textbookFilePath : layerData.session.curriculumPeriodDto.textbookFilePath
);
</script>
