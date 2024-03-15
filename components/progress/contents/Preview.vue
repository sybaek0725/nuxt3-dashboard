<!--
@파일(Method): Preview.vue
@작성자: 백소연
@작성일: 2024-02-05 14:55
@설명: 진도학습-콘텐츠편집-콘텐츠미리보기
@수정: 콘텐츠미리보기 화면 추가 (progress.contents.preview)(백소연-24.02.05)
-->
<template>
    <div class="contents_area">
        <div class="study_item_box">
            <div class="study_item_con">
                <div class="question_wrap">
                    <div class="question_area">
                        <!--CHECKLIST: 디자인 나오면 퍼블리싱 작업 필요-->
                        <v-img :src="layerData.src" height="520" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { layerData } = useLayerStore();
</script>
