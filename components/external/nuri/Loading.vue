<!--
@파일(Method): Loading.vue
@작성자: seungju.kim
@작성일: 2023-12-14 11:47
@설명: 누리집 연동 전송 중 콘텐츠 영역
-->
<template>
    <div class="class_board class_board_box h-100 center">
        <div class="d-flex justify-center align-center">
            <div class="linked_section">
                <div class="link_item">
                    <i class="ico link_80"></i>
                    <a :href="layerData.itemData.servicePath" target="_blank" class="link">
                        {{ layerData.itemData.servicePath }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { layerData } = useLayerStore();
</script>
