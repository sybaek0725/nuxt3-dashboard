<!--
@파일(Method): Form.vue
@작성자: 박보현
@작성일: 2023-12-08 15:45
@설명: 수업자료실 - 등록/수정
@수정: 외부연동자료 컴포넌트 수정(External -> ExternalTab)(LEE-24.02.01)
-->
<template>
    <v-row>
        <v-col class="d-flex align-center">
            <p class="font-body3 font-weight-bold">
                자료 제목<span class="ml-2 font-body4 font-weight-bold font-color-orange">&#42;필수</span>
            </p>
        </v-col>
        <v-col cols="10">
            <v-text-field
                v-model="item.materialName"
                clearable
                variant="outlined"
                auto-select-first
                required
                class=""
                density="comfortable"
                item-props
                outlined
                placeholder="자료의 이름을 입력해주세요"
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-start">
            <p class="font-body3 font-weight-bold">단원 및 차시 선택</p>
        </v-col>
        <v-col cols="10">
            <p class="font-body2">{{ unitSessionDisplay }}</p>
            <div class="select-area">
                <div class="box">
                    <div class="head">단원</div>
                    <div class="contents">
                        <v-radio-group v-model="item.curriculumChapterId" class="large option-gray" @change="changeChapter">
                            <v-radio
                                v-for="chapter in chapterItems"
                                :key="chapter.curriculumChapterId"
                                :label="`${chapter.chapterNum}. ${chapter.name}`"
                                :value="chapter.curriculumChapterId"
                                class="v-radio default"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                </div>
                <div class="box">
                    <div class="head">차시</div>
                    <div v-if="item.curriculumChapterId" class="contents">
                        <v-radio-group v-model="item.curriculumPeriodId" class="large option-gray" @change="changePeriod">
                            <v-radio
                                v-for="period in periodItems"
                                :key="period.curriculumPeriodId"
                                :label="period.lessonName"
                                :value="period.curriculumPeriodId"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div v-else class="contents no-contents">
                        <span>단원을 선택해주세요</span>
                    </div>
                </div>
            </div>
        </v-col>
        <v-col cols="2" class="d-flex align-start">
            <p class="font-body3 font-weight-bold mt-5">
                활동 유형<span class="ml-2 font-body4 font-weight-bold font-color-orange">&#42;필수</span>
            </p>
        </v-col>
        <ExternalTab />
    </v-row>
    <div class="d-flex center mgt20 gap1">
        <template v-if="layerData.entry === 'edit'">
            <v-btn
                flat
                rounded
                size="large"
                class="black"
                @click="openModal({ type: 'referenceDelete', buttonLabels: ['아니오', '예'], closeBtnClass: false })"
                >삭제</v-btn
            >
            <v-btn flat rounded size="large" class="black" @click="referenceUpdate">저장</v-btn>
        </template>
        <template v-else>
            <v-btn flat rounded size="large" class="black" @click="referenceUpdate">내 수업 자료 저장</v-btn>
            <v-btn rounded size="large" class="black" @click="send">학생에게 바로 전송</v-btn>
        </template>
    </div>

    <Modal v-if="type === 'referenceDelete'" @handle-action-one="referenceDelete">
        <span>수업 자료를 삭제 하시겠습니까?</span>
    </Modal>
</template>

<script setup>
onMounted(() => {
    initFunc();
});
const userId = useCookie('userId');
const layerStore = useLayerStore();
const { openModal, closeModal, type } = useModal();
const { layerData } = useLayerStore();
const apiReferenceStore = useApiReferenceStore();
const { item } = storeToRefs(apiReferenceStore);
const apiCourseStore = useApiCourseStore();
const { chapterItems, periodItems } = storeToRefs(apiCourseStore);
const { items: recentUrls, setItem: setRecentUrls } = useIndexedDB('data', 'recentUrls');
const { save, submit } = useExternal();
const { openAlert } = useAlert();
const { captureStream } = useScreenCapture();

// 진입 함수
const initFunc = async () => {
    // 단원 리스트 호출
    await apiCourseStore.getChapterItems();
    periodItems.value = [];
    if (layerData.entry === 'edit') {
        // 차시 리스트 호출
        await apiReferenceStore.getItem({
            materialId: item.value.materialId,
            courseId: '6ecac6a5-452f-41de-b9c2-9109c1847e38'
        });
        await apiCourseStore.getPeriodItems({ curriculumChapterId: item.value.curriculumChapterId });
    } else {
        item.value = {
            materialName: ''
        };
    }
};

// 단원 변경
const changeChapter = async value => {
    const targetId = value.target._value;
    const index = chapterItems.value.findIndex(val => val.curriculumChapterId === targetId);
    item.value.name = `${chapterItems.value[index].chapterNum}.${chapterItems.value[index].name}`;
    item.value.lessonName = '';
    // 차시 리스트 호출
    await apiCourseStore.getPeriodItems({ curriculumChapterId: targetId });
};

// 차시 변경
const changePeriod = async value => {
    const targetId = value.target._value;
    const index = periodItems.value.findIndex(val => val.curriculumPeriodId === targetId);
    item.value.lessonName = periodItems.value[index].lessonName;
    item.value.lessonStep = periodItems.value[index].lessonStep;
};

const unitSessionDisplay = computed(() => {
    const result = `${item.value.name || ''} ${item.value.name ? '>' : ''} ${item.value.lessonName || ''}`;
    return item.value.name ? result : '단원 및 차시를 선택해 주세요';
});

const referenceDelete = () => {
    closeModal();
    apiReferenceStore.setDeleteItem({
        teacherId: userId.value,
        materialId: item.value.materialId
    });
    deleteLayer();
};

const referenceUpdate = async () => {
    if (item.value.materialName.trim() === '') {
        openAlert({ message: '자료 제목 입력은 필수 입니다.' });
    } else {
        if (layerData.externalTab === 'nuri' && !isValidURL(layerData.nuriData.servicePath)) {
            openAlert({ message: '웹 주소 형식을 입력해주세요.' });
        } else {
            if (layerData.entry === 'edit') {
                await save('update');
            } else {
                await save('new');
            }
            deleteLayer();
        }
    }
};

const send = async () => {
    if (layerData.externalTab === 'nuri') {
        sendToStudents();
    } else if (layerData.externalTab === 'contents') {
        submit('contents', layerData[`${layerData.contentsTab}Data`]);
    } else if (layerData.externalTab === 'whboard') {
        const capturedImage = await captureStream('canvas', true);
        submit('whboard', { servicePath: capturedImage });
    }
};

const deleteLayer = () => {
    const layer = layerData;
    layer.state = 'off';
    layerStore.setLayer(layer);
};

const showButton = computed(() => {
    if (layerData.externalTab === 'nuri' || layerData.externalTab === 'whboard') return true;
    else if (layerData.externalTab === 'contents') {
        if (layerData.contentsTab === 'search' && layerData.isShowSearchDetail === 'on') return true;
        else if (layerData.contentsTab === 'image' && layerData.isShowImageDetail === 'on') return true;
        else if (layerData.contentsTab === 'document' && layerData.isShowDocumentDetail === 'on') return true;
        else return false;
    } else return false;
});

const sendToStudents = () => {
    if (!isValidURL(layerData.nuriData.servicePath)) {
        openAlert({ message: '웹 주소 형식을 입력해주세요.' });
    } else {
        submit('nuri', layerData.nuriData);
        updateRecentUrls(layerData.nuriData);
    }
};

const isValidURL = url => {
    let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
};

const updateRecentUrls = url => {
    recentUrls.value = recentUrls.value.filter(e => e.servicePath !== url.servicePath); //중복제거
    recentUrls.value = recentUrls.value.filter((e, idx) => idx < 4); //5개까지
    recentUrls.value.unshift(url); //추가

    setRecentUrls(recentUrls.value);
};
</script>
