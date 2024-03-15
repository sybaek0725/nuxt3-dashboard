<!--
@파일(Method): Index.vue
@작성자: 박보현
@작성일: 2023-12-05 14:12
@설명: 진도 학습
@수정: 교사/학생 기능 구분(LEE-24.02.01)
       user 과목 정보 변경(role->subject), 초기값-첫번째로 변경-원복 (LEE 24.02.14)
       inittype -> entry로 변경  (juyoungkoo 24.02.29)
-->
<template>
    <div class="today_study">
        <div ref="filterSection" class="today_study_filter">
            <div class="today_study_filter title_wrap">
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
                    <div class="today_study_tabs tab_btn">
                        <v-btn
                            flat
                            class="icon_only icon_only-transparent txt_btn"
                            @click="
                                setAddLayer('progress.textbook', {
                                    session: periodItems[0],
                                    entry: 'chapter',
                                    selected: layerData.selected
                                })
                            "
                            ><i class="ico book_40 ico_size_lg" /><span>교과서</span></v-btn
                        >

                        <div class="tab_head">
                            <v-tabs v-if="user.mode == 'teacher'" v-model="tab">
                                <v-tab
                                    :value="tab !== 'one' ? 'one' : ''"
                                    :class="{ 'v-tab--selected': tab === 'one' }"
                                    @click="toggleTab('one')"
                                    ><i class="ico bookmark_40 ico_size_lg" /><span>성취 기준</span>
                                </v-tab>
                                <v-tab
                                    :value="tab !== 'two' ? 'two' : ''"
                                    :class="{ 'v-tab--selected': tab === 'two' }"
                                    @click="toggleTab('two')"
                                    ><i class="ico graph_40 ico_size_lg" /><span>지도 방법</span>
                                </v-tab>
                            </v-tabs>
                            <v-btn v-else flat @click="setAddLayer('progress.textbook', { session: periodItems[0] })">
                                <i class="ico math_40 ico_size_lg" /><span>수학 익힘</span>
                            </v-btn>
                        </div>
                    </div>
                </div>
                <div v-if="user.mode == 'teacher'" class="btn_toggle" @click.stop="() => (layerData.edit = !layerData.edit)">
                    <v-btn v-model="layerData.edit" flat rounded class="outlined icon_only plus" :class="{ isActive: layerData.edit }">
                        <i class="ico plus_24 ico_size_lg" :class="{ ico_color_white: layerData.edit }"></i>
                    </v-btn>
                </div>
            </div>
            <div class="today_study_tabs tab_conts">
                <v-window v-model="tab">
                    <v-window-item v-if="user.mode == 'teacher'" value="one" :transition="false" :reverse-transition="false">
                        <div class="info info-direction-row info-bg-gray info-border info-pd-25">
                            <div class="noti">
                                <div class="chips chips_lg chips_primary max_h">성취 기준</div>
                                <ul>
                                    <li v-for="(item, idx) in achievementCriterion" :key="idx">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                            <i class="ico close_circle_30 ico_size_lg" @click="() => (tab = null)"></i>
                        </div>
                    </v-window-item>
                    <v-window-item v-if="user.mode == 'teacher'" value="two" :transition="false" :reverse-transition="false">
                        <div class="info info-direction-row info-bg-gray info-border info-pd-25">
                            <div class="noti">
                                <div class="chips chips_lg chips_primary max_h">지도 방법</div>
                                <ul>
                                    <li v-for="(item, idx) in teachingMethod" :key="idx">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                            <i class="ico close_circle_30 ico_size_lg" @click="() => (tab = null)"></i>
                        </div>
                    </v-window-item>
                </v-window>
            </div>
        </div>
        <ul ref="studyListWrap">
            <template v-if="user.subject == 'eng'">
                <ProgressPeriodCard />
            </template>
            <template v-else>
                <ProgressPeriodList
                    :items="periodItems"
                    :component="user.mode === 'teacher' ? 'progress.contents.edit' : 'progress.contents.view'"
                    :edit="layerData.edit"
                    :entry="'progress'"
                />
            </template>
        </ul>
    </div>
</template>

<script setup>
onMounted(async () => {
    initChapter();
});

const { isOpen } = useModal();
const { layerData, setAddLayer, addKeyValue } = useLayerStore();

//사용자
const { user } = storeToRefs(useApiUserStore());

//단원/차시
const apiCourseStore = useApiCourseStore();
const { chapterItems, periodItems } = storeToRefs(apiCourseStore);
const achievementCriterion = ref();
const teachingMethod = ref();
const tab = ref('one');
const studyListWrap = ref(null);
const initChapterItem = [
    {
        chapterNum: '',
        name: '단원을 선택해주세요'
    }
];

const webRtcStore = useWebRtcStore();

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
    if (value !== undefined) {
        achievementCriterion.value = splitFunc(value.achievementCriterion);
        teachingMethod.value = splitFunc(value.teachingMethod);
        value.teachingActivityType = '01'; //진도학습 : 01

        await apiCourseStore.getPeriodItems(value); //차시조회
    }
};

const onClickOutside = event => {
    if (!isOpen.value && studyListWrap.value && !studyListWrap.value.contains(event.target)) {
        layerData.edit = false;
    }
};

const toggleTab = tabName => {
    tab.value = tab.value === tabName ? tabName : '';
};
onMounted(() => {
    document.addEventListener('click', onClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', onClickOutside);
});
const splitFunc = text => (text?.includes('\n') ? text?.split('\n') : [text]);
</script>
