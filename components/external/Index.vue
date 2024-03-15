<!--
@파일(Method): Index.vue
@작성자: LEE
@작성일: 2024-01-30 10:11
@설명: 외부연동
-->
<template>
    <div class="study_item_con">
        <div class="board_tab_wrap">
            <component :is="useAsyncComponent(layerData.subComponent)"></component>
        </div>
    </div>
</template>

<script setup>
const { layerData } = useLayerStore();
</script>
