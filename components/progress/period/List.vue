<!--
@파일(Method): List.vue
@작성자: 박보현
@작성일: 2024-01-31 09:07
@설명: 차시목록(테이블형)
@수정: 버튼표시(LEE-24.02.01) 
       inittype 타입 변경(LEE-24.02.16)
       학생 > 수학익힘 목록 entry 조건 추가(juyoungkoo-24.02.20)
       교사 콘텐츠 수정 시 학생 차시목록에 edit 표시(juyoungkoo-24.02.21)
       학생 > 콘텐츠 호출 조건 변경 및 차시목록 아이콘 노출 분기처리 로직 변경(juyoungkoo-24.02.28)
       inittype -> entry로 변경  (juyoungkoo 24.02.29)
       수학익힘 noList 팝업 내 [확인] 버튼 클릭 시 시나리오 변경으로 인한 로직 수정(baeksoyeon 24.03.06)
       수학익힘 차시콘텐츠 존재하지 않은 경우 조건 변경 (baeksoyeon 24.03.06)
       차시목록 완료 표시 학생,선생님 분기 및 조건 변경(juyoungkoo-24.03.07)
-->
<template>
    <li
        v-for="(item, index) in items"
        :key="index"
        class="section"
        :class="[item.lessonOwnerFlag === 'T' && user.mode === 'teacher' ? 'my' : '']"
        @click="
            entry === 'workbook'
                ? confirmContents(item)
                : setAddLayer(props.component, {
                      name: `${layerData.selected?.chapterNum}. ${layerData.selected?.name}`,
                      info: `${item.lessonStep}. ${item.lessonName}`,
                      locale: 'off',
                      period: item,
                      currentPage: 1,
                      editing: false,
                      entry: entry
                  })
        "
    >
        <v-expansion-panels
            class="v-expansion-panels-btn-only"
            :class="{ 'new popover_layer': item.lessonOwnerFlag === 'T' && user.mode === 'teacher' }"
        >
            <v-expansion-panel>
                <div class="expension_panel_title_wrap">
                    <v-expansion-panel-title>
                        <div class="v-expansion-panel-title-head">
                            <template v-if="user.mode === 'teacher'">
                                <span v-if="item.lessonOwnerFlag === 'T'" class="chips chips_sm chips_yellow">MY</span>
                                <span v-else-if="item.lessonOwnerFlag === 'A' && item.isEdit" class="chips chips_sm chips_blue">EDIT</span>
                            </template>
                            <template v-else-if="user.mode === 'student' && entry === 'progress'">
                                <span v-if="item.isEdit === true" class="chips chips_sm chips_blue">{{ 'EDIT' }}</span>
                            </template>
                            <p class="txt_num">{{ item.lessonStep }}차시</p>
                        </div>
                        <div class="v-expansion-panel-title-body">
                            <p>{{ layerData.selected?.chapterNum }}.{{ layerData.selected?.name }}</p>
                            <p>
                                <span>{{ item.lessonName }}</span>
                            </p>
                        </div>
                        <template #actions>
                            <div class="v-expansion-panel-title__icon-wrap">
                                <template v-if="entry === 'progress'">
                                    <!-- 교과서 -->
                                    <button
                                        v-if="item.lessonOwnerFlag === 'A'"
                                        type="button"
                                        class="v-expansion-panel-title__icon-wrap-item"
                                        :class="{
                                            'v-expansion-panel-button-clickable': item.curriculumPeriodDto.textbookFilePath !== ''
                                        }"
                                        @click.stop="
                                            setAddLayer('progress.textbook', {
                                                session: item,
                                                entry: 'period',
                                                selected: layerData.selected
                                            })
                                        "
                                    >
                                        <i
                                            class="ico book_40 ico_size_10"
                                            :class="{ 'interaction disabled': item.curriculumPeriodDto.textbookFilePath === '' }"
                                        ></i>
                                        <p
                                            class="font-body4 font-weight-bold v-expansion-panel-title__icon-wrap-item-text"
                                            :class="{ 'font-color-disabled': item.curriculumPeriodDto.textbookFilePath === '' }"
                                        >
                                            교과서
                                        </p>
                                    </button>
                                    <button
                                        v-else-if="user.mode === 'student'"
                                        type="button"
                                        class="v-expansion-panel-title__icon-wrap-item"
                                        @click.stop=""
                                    >
                                        <i class="ico book_40 ico_size_10 write_40 interaction disabled"></i>
                                        <p
                                            class="font-body4 font-weight-bold v-expansion-panel-title__icon-wrap-item-text font-color-disabled"
                                        >
                                            교과서
                                        </p>
                                    </button>
                                    <!-- 수정 -->
                                    <button
                                        v-else-if="user.mode === 'teacher'"
                                        type="button"
                                        class="v-expansion-panel-title__icon-wrap-item v-expansion-panel-button-clickable"
                                        @click.stop="item.lessonOwnerFlag === 'T' ? editSessionModal(item, index) : null"
                                    >
                                        <i class="ico book_40 ico_size_10 write_40 interaction"></i>
                                        <p class="font-body4 font-weight-bold v-expansion-panel-title__icon-wrap-item-text">수정</p>
                                    </button>
                                    <!-- 수학익힘 -->
                                    <button
                                        v-if="user.mode === 'student'"
                                        type="button"
                                        class="v-expansion-panel-title__icon-wrap-item"
                                        :class="{ 'v-expansion-panel-button-clickable': item.curriculumPeriodDto.workbookFilePath !== '' }"
                                        @click.stop="setAddLayer('progress.textbook', { session: item })"
                                    >
                                        <i
                                            class="ico math_40 ico_size_10 write_40"
                                            :class="{ 'interaction disabled': item.curriculumPeriodDto.workbookFilePath === '' }"
                                        ></i>
                                        <p
                                            class="font-body4 font-weight-bold v-expansion-panel-title__icon-wrap-item-text"
                                            :class="{ 'font-color-disabled': item.curriculumPeriodDto.workbookFilePath === '' }"
                                        >
                                            수학익힘
                                        </p>
                                    </button>
                                    <!-- 학습 목표 -->
                                    <button
                                        type="button"
                                        class="v-expansion-panel-title__icon-wrap-item"
                                        :class="{ 'v-expansion-panel-button-clickable': item.lessonGoal !== '' }"
                                        @click.stop=""
                                    >
                                        <i
                                            class="ico learning_40 ico_size_10"
                                            :class="{ 'interaction disabled': item.lessonGoal === '' }"
                                        ></i>
                                        <p
                                            class="font-body4 font-weight-bold v-expansion-panel-title__icon-wrap-item-text"
                                            :class="{ 'font-color-disabled': item.lessonGoal === '' }"
                                        >
                                            학습 목표
                                        </p>
                                    </button>
                                </template>
                                <!-- 진도 확인 -->
                                <button type="button" class="v-expansion-panel-title__icon-wrap-item">
                                    <template v-if="item.lessonTeacherEndYn === 'Y'">
                                        <i
                                            class="ico ico_size_10"
                                            :class="[item.lessonStudentEndYn === 'Y' ? 'check_40_active' : 'check_60']"
                                        ></i>
                                        <p class="font-body4 font-weight-bold">진도 확인</p>
                                    </template>
                                </button>
                            </div>
                        </template>
                    </v-expansion-panel-title>
                </div>
                <v-expansion-panel-text v-if="target === `target-${index}`" v-model="target" class="v-expansion-panel-text-wrap">
                    <div class="v-expansion-panel-text-area">
                        <span class="chips chips_lg chips_green">학습목표</span>
                        <ul class="v-expansion-panel-list">
                            <li v-for="(goal, idx) in splitFunc(item.lessonGoal)" :key="idx">
                                {{ goal }}
                            </li>
                        </ul>
                    </div>
                    <div class="v-expansion-panel-text-area v-expansion-panel-text-area-close">
                        <button type="button" @click="() => (target = null)">
                            <i class="ico close_circle_30 ico_size_lg"></i>
                        </button>
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <div v-if="edit" class="add_btn" @click.stop="newSessionModal(item)">
            <i class="ico ico_size_lg"></i>
            <span>여기에 새로운 차시를 만들까요?</span>
        </div>
    </li>
    <Modal
        v-if="type === 'sessionEditor'"
        @modal-closed="resetModalState"
        @handle-action-one="addSession"
        @handle-action-two="removeSession"
    >
        <v-form class="form">
            <div class="form_item">
                <span class="label">차시 번호</span>
                <span class="value_txt">{{ layerData.sessionNum }}</span>
            </div>
            <div class="form_item">
                <span class="label">차시 제목</span>
                <div class="text_field_box">
                    <v-text-field
                        v-model="sessionTitle"
                        clearable
                        :counter="10"
                        variant="outlined"
                        required
                        placeholder="내가 만든 차시 제목이 들어갑니다."
                        hide-details
                    >
                    </v-text-field>
                </div>
            </div>
            <div class="form_item txt_area">
                <span class="label">학습 목표</span>
                <v-textarea
                    v-model="targetText"
                    clearable
                    variant="outlined"
                    required
                    placeholder="내가 만든 차시 학습목표가 들어갑니다."
                    hide-details
                    rows="2"
                ></v-textarea>
            </div>
        </v-form>
    </Modal>
    <Modal v-if="type === 'noList'">
        <p>
            <span class="font-color font-color-orange">{{ periodObj }}차시</span>는 수학익힘 문제가 제공되지 않습니다.
        </p>
    </Modal>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: null
    },
    component: {
        type: String,
        required: true
    },
    edit: {
        type: Boolean,
        required: false,
        default: false
    },
    entry: {
        type: String,
        default: 'progress'
    }
});
const { user } = storeToRefs(useApiUserStore());
const { t } = useI18n();
const { openModal, closeModal, type } = useModal();
const { openAlert } = useAlert();
const { layerData, setAddLayer, addKeyValue } = useLayerStore();
const apiCourseStore = useApiCourseStore();
const { contentsTotalCnt } = storeToRefs(apiCourseStore);
const editSession = ref(false);
const target = ref(false);
const targetText = ref('');
const sessionTitle = ref('');
const periodId = ref(null);
const alphabetArray = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));
const newSessionModal = item => {
    layerData.session = item;
    const step = item.lessonStep.split('_')[0];
    const alphabet = lastAlphabet(step);
    const num = `${step}_${alphabet}`;
    addKeyValue(layerData.id, { sessionNum: num });
    openModal({
        title: '새로운 차시 정보를 입력하세요.',
        type: 'sessionEditor',
        buttonLabels: ['취소', '저장'],
        wrapClass: 'register mb-5',
        closeBtnClass: false
    });
    editSession.value = false;
};
const editSessionModal = (item, index) => {
    sessionTitle.value = item.lessonName;
    targetText.value = item.lessonGoal;
    periodId.value = item.periodId;
    layerData.sessionNum = item.lessonStep;
    layerData.session = item;
    layerData.sessionIndex = index;
    openModal({
        title: '차시 정보를 수정하세요.',
        type: 'sessionEditor',
        buttonLabels: ['취소', '저장', '차시 삭제'],
        wrapClass: 'register mb-5',
        closeBtnClass: false
    });
    editSession.value = true;
};
const addSession = () => {
    updateSessionData();
    closeModal();
    resetModalState();
};
const removeSession = async () => {
    await apiCourseStore.setPeriodDeleteItem({ courseLessonId: props.items[layerData.sessionIndex].courseLessonId });
    closeModal();
    resetModalState();
    openAlert({ message: '차시를 삭제하였습니다.', timeout: 2000 });
    await apiCourseStore.getPeriodItems(layerData.selected);
};
const resetModalState = () => {
    sessionTitle.value = '';
    targetText.value = '';
    periodId.value = '';
};
const updateSessionData = async () => {
    if (editSession.value) {
        const dataObject = {
            courseLessonId: layerData.session?.courseLessonId,
            lessonName: sessionTitle.value,
            lessonGoal: targetText.value,
            lessonAchivStandard: layerData.session?.lessonAchivStandard || ''
        };
        await apiCourseStore.setPeriodUpdateItem(dataObject);
    } else {
        const dataObject = {
            courseId: layerData.session.courseId,
            lessonName: sessionTitle.value,
            lessonStep: layerData.sessionNum,
            curriculumSubjectId: layerData.session.curriculumSubjectId,
            curriculumChapterId: layerData.session.curriculumChapterId,
            lessonGoal: targetText.value,
            lessonAchivStandard: '',
            preCourseLessonId: layerData.session.courseLessonId
        };
        await apiCourseStore.setPeriodUpdateItem(dataObject);
    }

    await apiCourseStore.getPeriodItems(layerData.selected);
};
const splitFunc = text => (text.includes('\n•') ? text.split('\n•') : [text]);
const lastAlphabet = lessonStep => {
    const filteredArray = props.items.filter(item => item.lessonStep.includes('_')).filter(item => item.lessonStep.startsWith(lessonStep));
    if (filteredArray.length > 0) {
        const lastElement = filteredArray[filteredArray.length - 1];
        const lastAlphabet = lastElement.lessonStep.slice(-1);
        const nextAlphabet = alphabetArray[alphabetArray.indexOf(lastAlphabet) + 1];
        return nextAlphabet;
    } else return 'A';
};
const periodObj = ref(null);

const confirmContents = async item => {
    console.log('item.lessonStep : ', item.lessonStep);
    //해당차시번호
    periodObj.value = item.lessonStep;

    item.entry = props.entry;
    await apiCourseStore.getContentsItem(item, 1);

    if (contentsTotalCnt.value === 0) {
        //수학익힘 차시콘텐츠 존재하지 않은 경우
        openModal({
            type: 'noList',
            closeBtnClass: false,
            buttonLabels: ['확인']
        });
    } else {
        setAddLayer(props.component, {
            name: `${layerData.selected?.chapterNum}. ${layerData.selected?.name}`,
            info: `${item.lessonStep}. ${item.lessonName}`,
            locale: 'off',
            period: item,
            currentPage: 1,
            editing: false,
            entry: props.entry
        });
    }
};

// 첫번째 아코디언
const textAccordionsPanel = ref([null]);

// 학습 목표 btn
const isActiveLearningTargets = {
    target1: ref(false),
    target2: ref(false),
    target3: ref(false)
};

// 두번째 아코디언
const isActiveLearningTarget2 = ref(false);

// List Text Accordions 버튼 active 함수
const toggleLearningTarget = target => {
    // 수정 버튼을 눌렀을 때만 dialog를 열도록 설정
    if (target === 'target1') {
        dialog.value = true;
    }

    isActiveLearningTargets[target].value = !isActiveLearningTargets[target].value;

    // 현재 타겟이 true로 설정되어 있으면 다른 타겟들은 모두 false로 설정
    if (isActiveLearningTargets[target].value) {
        for (const key in isActiveLearningTargets) {
            if (key !== target) {
                isActiveLearningTargets[key].value = false;
            }
        }
        textAccordionsPanel.value = null;
    }
};

const handleCloseAccordion = target => {
    // 아코디언 close
    textAccordionsPanel.value = null;
    // 버튼 active 상태
    Object.keys(isActiveLearningTargets).forEach(key => {
        isActiveLearningTargets[key].value = false;
    });
    if (target) {
        isActiveLearningTarget2.value = false;
    }
};
</script>
