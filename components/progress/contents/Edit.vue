<!--
@파일(Method): Edit.vue
@작성자: 박보현
@작성일: 2023-12-08 13:37
@설명: 콘텐츠 편집(도입-전개-정리-평가)
@수정: 콘텐츠뷰잉/외부연동 레이어ID 변경(workbook.contentsViewing/progress.configureSession.external)(LEE-24.02.01) 
       setViewer함수 entry값 viewer -> progress로 변경 (juyoungkoo 24.02.29)
-->
<template>
    <div class="column_item with_fixed_menu">
        <div class="list-img list-img-direction-column list-img-area list-img-gap list-img-gap-lg">
            <div
                v-for="(array, categoryIdx) in contentArrays"
                :key="categoryIdx"
                class="list-img list-img-direction-column list-img-gap list-img-gap-sm"
            >
                <div class="list-img-area-head">
                    <div class="chips chips_yellow">{{ array.name }}</div>
                </div>
                <draggable
                    v-model="array.list"
                    ghost-class="ghost"
                    group="textbook"
                    tag="div"
                    class="list-img-body list-img list-img-direction-column list-img-gap"
                    item-key="name"
                    @change="e => handleArrayChange(e)"
                    @start="e => startFunc(categoryIdx, e)"
                    @end="endFunc"
                >
                    <template #item="{ element, index }">
                        <div v-if="element.type === 'none'">
                            <div class="list-img no_info">
                                <i class="ico warning_30 ico_color_blue" />
                                <div>
                                    <p class="font-body3 font-color-blue">{{ element.name }}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="list-img list-img-gap p-xs"
                            @click="
                                element.isDisabled
                                    ? element.flag === 'ai'
                                        ? setPreview(element)
                                        : goExternal(element)
                                    : setViewer(element)
                            "
                        >
                            <div class="list-img-head">
                                <button type="button">
                                    <div class="banner banner-rectangle banner-rectangle-sm">
                                        <img :src="element.contObj?.thumbnailFileUrlPath" alt="thumbnail" />
                                    </div>
                                </button>
                            </div>
                            <div class="list-img-body list-img list-img-border-bottom">
                                <div class="list-img-body list-img-body-info list-img-body-info-horizontal">
                                    <div class="list-img-body-info-horizontal-title">
                                        <p class="font-body3 font-weight-bold">
                                            {{ element.contObj?.contentName || element.contObj?.materialName || element.materialName }}
                                        </p>
                                    </div>
                                    <div
                                        v-if="element.contentOwnerFlag === 'A' && element.contObj"
                                        class="list-img-body-info-horizontal-area"
                                    >
                                        <i class="ico book_b ico_size_sm" />
                                        <p class="font-body4 font-color font-color-black">
                                            교과서 {{ element.contObj?.textbookPageNumber }}쪽
                                        </p>
                                    </div>
                                </div>
                                <div class="list-img-body list-img-body-info list-img-body-info-horizontal-close">
                                    <button type="button" class="list-img-body-info-horizontal-close-area">
                                        <i class="ico del_bk ico_size_xs" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
        <div v-if="layerData.editing" class="fixed_btn">
            <v-btn
                rounded
                size="large"
                class="outlined"
                @click="
                    openModal({
                        type: 'rollback',
                        buttonLabels: ['아니오 \n (변경 유지)', '예 \n (전 단계로 원복)'],
                        closeBtnClass: false
                    })
                "
                >초기화</v-btn
            >
            <v-btn rounded size="large" class="primary">저장</v-btn>
        </div>
    </div>
    <div class="column_item"></div>

    <Modal v-if="type === 'rollback'">
        <span>재구성하기 전 단계로 돌아갈까요?</span>
        <template #footer>
            <v-btn size="x-large" rounded flat class="outlined_bk" @click="closeModal"> 아니오<br />(변경 유지) </v-btn>
            <v-btn size="x-large" rounded flat class="black" @click="resetContents"> 예<br />(전 단계로 원복) </v-btn>
        </template>
    </Modal>
    <Modal v-if="type === 'notice'" @handle-action-one="closeModal" />
    <Modal v-if="type === 'download'" @handle-action-one="closeModal">
        <p class="txt_tit">해당 파일을 저장하시겠습니까?</p>
        <div class="attach_box">{{ contentData.contentsInfo }}.{{ contentData.contentsKind }}</div>
        <template #footer>
            <v-btn rounded flat class="outlined_bk" @click="closeModal"> 취소 </v-btn>
            <v-btn
                rounded
                flat
                class="black"
                :download="contentData.contentsInfo"
                :href="contentData.teacherContentsMeta"
                @click="closeModal"
            >
                저장
            </v-btn>
        </template>
    </Modal>
</template>

<script setup>
//사용자
const { user } = storeToRefs(useApiUserStore());
const { setAddLayer, layerData, addKeyValue } = useLayerStore();
const { openModal, closeModal, type } = useModal();
const apiCourseStore = useApiCourseStore();
const apiAiContentsStore = useApiAiContentsStore();
const { contentsItems } = storeToRefs(apiCourseStore);
const { items: dataArr } = storeToRefs(apiAiContentsStore);
const apiReferenceStore = useApiReferenceStore();
const { totalCnt, items: externalDataArr, item: externalDataObject } = storeToRefs(apiReferenceStore);
const { initExternal } = useExternal();
const category = ref(null);
const oldIndex = ref(null);
const contentData = ref(null);
const contentArrays = ref({
    intro: { name: '도입', list: ref([]) },
    deploy: { name: '전개', list: ref([]) },
    organize: { name: '정리', list: ref([]) },
    evaluate: { name: '평가', list: ref([]) }
});
const dimArr = [{}];
const webRtcStore = useWebRtcStore();

onMounted(() => {
    initTextbook();
    window.addEventListener('beforeunload', leave);
});
const initTextbook = async () => {
    if (layerData.editing) {
        contentArrays.value = layerData.contentArrays;
    } else {
        await fetchData();
        updateContentArrays();
        setDisabledList();
    }
    if (user.value.mode == 'teacher') {
        webRtcStore.setSendMessage('teacher', 'all', 'ControlAction', {
            type: 'screen',
            data: 'wait'
        });
    }
};
const fetchData = async () => {
    // 차시 별 교과서 컨텐츠 조회
    await apiCourseStore.getContentsItems({
        metaType: 'T',
        courseLessonId: layerData.period.courseLessonId
    });
    // AI 추천순 컨텐츠 조회
    if (layerData.period.lessonOwnerFlag === 'A') await apiAiContentsStore.getItems();
    // 외부 자료 연동 컨텐츠 조회
    externalDataArr.value = [];
    await apiReferenceStore.getItems(0, {
        chapterId: layerData.period.curriculumChapterId,
        periodId: layerData.period.curriculumPeriodId,
        search: '',
        fromewhereCd: '02'
    });
};
// 초기 학습 활동 영역 데이터 구성
const updateContentArrays = () => {
    // 차시 콘텐츠 구성
    contentsItems.value?.forEach(content => {
        const stageKey = getStageKey(content.learningStageCd);
        if (stageKey !== '') updateContentArray(contentArrays.value[stageKey].list, content);
    });
    externalDataArr.value.push({
        flag: 'external',
        materialName: '',
        kofContent: 'plus',
        isDisabled: false,
        materialId: ''
    });

    ensureListNotEmpty();
};

const setDisabledList = () => {
    externalDataArr.value.forEach(external => {
        const matchingItem = contentsItems.value?.some(item => item.materialId === external.materialId);
        external.isDisabled = matchingItem;
        external.flag = 'external';
    });

    dataArr.value.forEach(ai => {
        const matchingItem = contentsItems.value?.some(item => item.contentId === ai.contentId);
        ai.isDisabled = matchingItem;
        ai.flag = 'ai';
    });
};
// 학습 활동 영역 콘텐츠 드래그 시 실행되는 함수
const handleArrayChange = e => {
    layerData.editing = true;
    if (e.added) {
        const element = e.added.element;
        setDisabled(element);
    } else if (e.removed) {
        const element = e.removed.element;
        if (element.type === 'none') return true;
        setDisabled(element);
    }
};

// 학습 활동 영역 삭제 아이콘 클릭 시 실행되는 함수
const handleArrayRemove = (category, idx, element) => {
    contentArrays.value[category].list = contentArrays.value[category].list.filter((item, index) => {
        return index !== idx;
    });
    layerData.editing = true;
    setDisabled(element);
};
const setDisabled = element => {
    if (element.flag === 'external') {
        const index = externalDataArr.value.findIndex(obj => obj.materialId === element.materialId);
        externalDataArr.value[index].isDisabled = isExist(element, 'materialId');
    } else if (element.flag === 'ai') {
        const index = dataArr.value.findIndex(obj => obj.contentId === element.contentId);
        dataArr.value[index].isDisabled = isExist(element, 'contentId');
    }
};
const leave = event => {
    addKeyValue(layerData.id, {
        contentArrays: contentArrays.value
    });
};
const setViewer = element => {
    setAddLayer('progress.contents.view', {
        name: '콘텐츠 뷰어',
        info: `${layerData.info} (교과서 ${element.contentOrder}쪽)`,
        period: layerData.period,
        locale: 'off',
        entry: 'progress',
        currentPage: element.contentOrder
    });
};

//콘텐츠 미리보기 레이어 호출 로직
const setPreview = element => {
    setAddLayer('progress.contents.preview', {
        name: '콘텐츠 미리보기',
        info: `${element.materialName}`,
        src: element.contObj?.thumbnailFileUrlPath
    });
};

// 외부 자료 연동 레이어 호출 로직
const goExternal = item => {
    const data = { period: layerData.period, ...item };
    externalDataObject.value = item;
    initExternal(data, 'progress.contents.edit.external', item.kofContent === 'plus' ? 'create' : 'edit');
};

// 외부 자료 연동 콘텐츠 삭제 로직
const deleteExternal = async id => {
    await apiReferenceStore.setDeleteItem({ teachingMeterialsId: id });
    // 소스 정리 필요
    await apiReferenceStore.getItems(100, 1, {
        chapter: layerData.period.chapterId,
        period: layerData.period.periodId,
        search: ''
    });
    externalDataArr.value.push({
        flag: 'external',
        materialName: '',
        kofContent: 'plus',
        isDisabled: false,
        teachingMeterialsId: ''
    });
};

// 초기화 로직 (변경 내용 저장하지 않고 이전 단계로 원복)
const resetContents = async () => {
    layerData.editing = false;
    closeModal();
    resetContentsList();
    resetExternalList();
    await initTextbook();
};
const resetContentsList = () => {
    Object.keys(contentArrays.value).forEach(category => {
        contentArrays.value[category].list = [];
    });
};
const resetExternalList = () => {
    externalDataArr.value = [];
};

// 학습 활동 영역 리스트 watch 함수
Object.keys(contentArrays.value).forEach(category => {
    watch(
        () => contentArrays.value[category].list,
        newValue => {
            if (newValue.length === 0) {
                contentArrays.value[category].list.push({
                    name: layerData.period.lessonOwnerFlag === 'A' ? '등록된 정보가 없습니다.' : '외부 자료를 등록 후, 여기에 옮기세요.',
                    type: 'none'
                });
            } else if (newValue.some(item => item.type === 'none')) {
                contentArrays.value[category].list = newValue.filter(item => item.type !== 'none');
            }
        }
    );
});

const getStageKey = learningStageCd => {
    switch (learningStageCd) {
        case 'INTR':
            return 'intro';
        case 'DEVE':
            return 'deploy';
        case 'CONC':
            return 'organize';
        case 'ASSE':
            return 'evaluate';
        default:
            return '';
    }
};
const updateContentArray = (list, content) => {
    if (list[0]?.type === 'none') list.shift();
    list.push(content);
};
const ensureListNotEmpty = () => {
    Object.values(contentArrays.value).forEach(({ list }) => {
        if (list.length === 0) {
            list.push({
                name: layerData.period.lessonOwnerFlag === 'A' ? '등록된 정보가 없습니다.' : '외부 자료를 등록 후, 여기에 옮기세요.',
                type: 'none'
            });
        }
    });
};

const isExist = (element, value) => {
    return (
        contentArrays.value.intro.list.some(m => m[value] === element[value]) ||
        contentArrays.value.deploy.list.some(m => m[value] === element[value]) ||
        contentArrays.value.organize.list.some(m => m[value] === element[value]) ||
        contentArrays.value.evaluate.list.some(m => m[value] === element[value])
    );
};
// 드래그 완료 시 실행되는 함수
const endFunc = e => {
    category.value = null;
    oldIndex.value = null;
};

// 드래그 시작 시 실행되는 함수
const startFunc = (c, e) => {
    category.value = c;
    oldIndex.value = e.oldIndex;
};
// layerStore / courseStore / 유지 / 초기화 중 택 1
onUnmounted(() => {
    addKeyValue(layerData.id, {
        contentArrays: contentArrays.value
    });
    window.removeEventListener('beforeunload', leave);
});
</script>
