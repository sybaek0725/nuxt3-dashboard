<!--
@파일(Method): Workbook.vue
@작성자: 백소연
@작성일: 2023-12-05 18:25
@설명: 수학익힘
@수정: 콘텐츠뷰잉 레이어ID 변경(workbook.contentsViewing -> progress.contents.view)(LEE-24.02.01)
       inittype 삭제 (juyoungkoo 24.02.29)
       ver3.3 퍼블리싱 정합(soyeonbaek 24.03.12)
-->
<template>
    <div class="today_study">
        <div class="today_study_filter">
            <div class="today_study_filter title_wrap add_height">
                <div>
                    <v-select
                        v-model="layerData.selected"
                        :items="chapterItems"
                        :item-title="item => `${item.chapterNum}${item.chapterNum === '' ? '' : '.'}${item.name}`"
                        item-value="curriculumChapterId"
                        label="Select"
                        variant="outlined"
                        persistent-hint
                        rounded
                        return-object
                        single-line
                        hide-details
                        @update:model-value="changeChapter"
                    ></v-select>
                </div>
            </div>
        </div>
        <!-- 단원 / 차시 목록 영역 -->
        <ul>
            <ProgressPeriodList
                :items="periodItems?.filter(val => val.lessonOwnerFlag === 'A')"
                component="workbook.contents.view"
                :entry="'workbook'"
            />
        </ul>
        <!-- // 단원 / 차시 목록 영역 -->
    </div>
</template>

<script setup>
//사용자
const { user } = storeToRefs(useApiUserStore());
const webRtcStore = useWebRtcStore();
const initChapterItem = [
    {
        chapterNum: '',
        name: '단원을 선택해주세요'
    }
];
onMounted(async () => {
    initChapter();
});

const { layerData, addKeyValue } = useLayerStore();

//단원/차시
const apiCourseStore = useApiCourseStore();
const { chapterItems, periodItems } = storeToRefs(apiCourseStore);
const initChapter = async () => {
    await apiCourseStore.getChapterItems();

    if (chapterItems.value === undefined) {
        chapterItems.value = initChapterItem;
    }

    //초기값-첫번째로
    if (!layerData.selected || layerData.selected.chapterNum === '') {
        addKeyValue(layerData.id, { selected: chapterItems.value[0] });
    }

    changeChapter(layerData.selected);

    if (user.value.mode == 'teacher') {
        webRtcStore.setSendMessage('teacher', 'all', 'ControlAction', {
            type: 'screen',
            data: 'wait'
        });
    }
};
const changeChapter = async value => {
    value.teachingActivityType = '03'; //수학익힘:03
    await apiCourseStore.getPeriodItems(value); //차시조회
};
</script>
