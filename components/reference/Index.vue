<!--
@파일(Method): Index.vue
@작성자: 박보현
@작성일: 2023-12-05 10:23
@설명: 수업자료실
@수정: 수업자료실 등록 레이어ID 변경(reference.create -> reference.form)(LEE-24.02.01)
-->
<template>
    <div class="class_board height_full">
        <template v-if="totalCnt !== 0">
            <div class="select_wrap">
                <div class="text_field_box">
                    <v-select
                        v-model="layerData.selectedUnit"
                        :items="chapterItems"
                        :item-title="item => `${item.chapterNum}${item.chapterNum === '' ? '' : '.'}${item.name}`"
                        item-value="curriculumChapterId"
                        label="단원을 선택해주세요"
                        class="mr-3"
                        variant="outlined"
                        persistent-hint
                        rounded
                        return-object
                        single-line
                        hide-details
                        @update:model-value="changeChapter"
                    ></v-select>
                </div>
                <div class="text_field_box">
                    <v-select
                        v-model="layerData.selectSession"
                        :items="periodItems"
                        :item-title="item => (item.periodId == '' ? item.periodName : `${item.lessonStep}. ${item.lessonName}`)"
                        item-value="periodId"
                        label="차시를 선택해주세요"
                        variant="outlined"
                        persistent-hint
                        rounded
                        return-object
                        single-line
                        hide-details
                        @update:model-value="changePeriod"
                        @click="layerData.selectedUnit.curriculumChapterId == '' && openAlert({ message: '단원을 먼저 선택해주세요.' })"
                    >
                    </v-select>
                </div>
            </div>
            <div class="search_bar_wrap">
                <div class="text_field_box">
                    <v-text-field
                        v-model="layerData.search"
                        append-inner-icon="ico_search2"
                        variant="outlined"
                        auto-select-first
                        required
                        class="flex-full-width big"
                        density="comfortable"
                        item-props
                        outlined
                        placeholder="검색어를 입력하세요."
                        hide-details
                        rounded
                    ></v-text-field>
                </div>
            </div>
        </template>
        <ReferenceList :items="reference" :total-cnt="totalCnt" :is-search="isSearch" />
        <Pagination v-if="pageCount > 0" :current-page="layerData.currentPage" :page-count="pageCount" @page="setPage" />
        <div class="btn_bottom_wrap" :class="{ full_h: !isSearch && totalCnt === 0 }">
            <v-btn flat rounded size="large" class="black" @click="goEdit">새 수업 자료 만들기</v-btn>
        </div>
    </div>
</template>

<script setup>
const { t } = useI18n();
const { openAlert } = useAlert();
const isSearch = ref(false);
const { layerData, addKeyValue, setAddLayer } = useLayerStore();
const { items: recentSearch, setItem: setRecentSearch } = useIndexedDB('data', 'recentReferenceSearch');

const updateRecentSearch = search => {
    recentSearch.value = recentSearch.value.filter(e => e.title !== search); //중복제거
    recentSearch.value = recentSearch.value.filter((e, idx) => idx < 4); //5개까지
    recentSearch.value.unshift({
        prependIcon: 'ico_list_search',
        title: search
    }); //추가

    setRecentSearch(recentSearch.value);
};

//단원/차시
const apiCourseStore = useApiCourseStore();
const { chapterItems, periodItems } = storeToRefs(apiCourseStore);

const initChapterItem = {
    chapterNum: '',
    name: '단원을 선택해주세요',
    curriculumChapterId: ''
};
const initPeriodItem = {
    periodId: '',
    periodName: '차시를 선택해주세요'
};

//수업자료실
const pageSize = 10;
const pageCount = computed(() => Math.ceil(totalCnt.value === 0 ? (isSearch.value ? 1 : 0) : totalCnt.value / pageSize));
const apiReferenceStore = useApiReferenceStore();
const { totalCnt, items: reference, item } = storeToRefs(apiReferenceStore);

onMounted(() => {
    initSearch();
});

//진입 함수
const initSearch = async () => {
    addKeyValue(layerData.id, { currentPage: 1 });
    //초기값
    if (!layerData.selectedUnit) {
        addKeyValue(layerData.id, { selectedUnit: initChapterItem });
    }
    if (!layerData.selectSession) {
        addKeyValue(layerData.id, { selectSession: initPeriodItem });
    }

    if (layerData.selectedUnit?.curriculumChapterId === '') {
        periodItems.value = [];
    }

    //단원 리스트 호출
    await apiCourseStore.getChapterItems();
    chapterItems.value.unshift(initChapterItem);

    await getData();
};

//단원 변경
const changeChapter = async value => {
    //차시 초기화
    layerData.selectSession = initPeriodItem;
    // "단원을 선택해주세요" 클릭
    if (value.curriculumChapterId == '') {
        getData();
        periodItems.value = [];
    } else {
        // 차시 리스트 호출
        await apiCourseStore.getPeriodItems(value);
        periodItems.value.unshift(initPeriodItem);
    }
};

// 차시 변경
const changePeriod = value => {
    //페이징 초기화
    layerData.currentPage = 1;
    getData();
};

const getData = async () => {
    await apiReferenceStore.getItems(layerData.currentPage - 1, {
        chapterId: layerData.selectedUnit?.curriculumChapterId || '',
        periodId: layerData.selectSession?.curriculumPeriodId || '',
        search: layerData.search,
        fromewhereCd: '00'
    });
};
const setPage = page => {
    layerData.currentPage = page;
    getData();
};

const searchItem = word => {
    if (word === '') return;
    layerData.search = word;
    layerData.currentPage = 1; //페이징 초기화
    isSearch.value = true;
    getData();
    updateRecentSearch(word);
};

const goEdit = () => {
    item.value = {};
    setAddLayer('reference.form', {
        externalTab: null,
        entry: 'create',
        isShowImageDetail: 'off',
        isShowSearchDetail: 'off',
        isShowDocumentDetail: 'off',
        nuriData: {},
        whboardData: {}
    });
};
</script>
<style scoped>
.v-overlay,
.v-dialog {
    padding-top: 0rem !important;
}
</style>
