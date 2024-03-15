<!--
@파일(Method): View.vue
@작성자: 백소연
@작성일: 2023-12-05 18:25
@설명: 콘텐츠 뷰잉
@수정: 모둠활동 레이어ID 변경(workbook.groupActivityStatus/workbook.createAGroup)(LEE-24.02.01) 
       콘텐츠 정보 api 및 webRtc 연동 수정(LEE-24.02.16)
       학생 > 수학익힘 콘텐츠 화면 버튼 위치 변경 및 조건 수정 (juyoungkoo-24.02.20)
       학습활동제출내역 > 크게보기 팝업 내 기능 구현(BAEK-24.02.20) 
       학생 > 답안제출(버튼임시) webrtc 연동 수정 (juyoungkoo-24.02.21)
       콘텐츠 api 연동 조건 추가 (juyoungkoo-24.02.28)
       inittype -> entry로 변경, 콘텐츠 api 연동 수정 (juyoungkoo 24.02.29)
       모둠 활동 관련 소스 정리 (soyeonbaek 24.03.06)
       콘텐츠 영역 콘텐츠 Type에 따른 분기 처리 및 CHECKLIST 작성 (baeksoyeon-24.03.06)
       모둠활동 관련 추가 소스 정리, 콘텐츠 api 연동 조건 추가에 따른 webrtc 전달 데이터 추가(juyoungkoo-24.03.07)
       콘텐츠 외부자료 파일 다운로드 fileCard 컴포넌트 적용(juyoungkoo-24.03.08)
-->
<template>
    <div class="today_study viewer">
        <div class="viewer_area">
            <!--
            CHECKLIST: contentOwnerFlag(A: 교과서차시, T: 교사자체생성차시) 및 kofContent 분기 작업 (03.11 퍼블리싱 정합 예정)
        -->
            <template v-if="contentsItem?.contentOwnerFlag === 'A'">
                <ViewerIframe :iframe-url="contentsItem?.contObj.contentsFileUrlPath" />
            </template>
            <template v-else-if="contentsItem?.contentOwnerFlag === 'T'">
                <div v-if="contentsItem?.contObj.kofContentName === 'url'">
                    <!--
                        CHECKLIST: 누리집 url 연동 기획, 퍼블 확인 후 연동 예정
                    -->
                    <!-- <ViewerUrl :url-path="contentsItem?.contObj.materialStoreUrl" /> -->
                    누리집 URL
                </div>
                <div v-else-if="contentsItem?.contObj.kofContentName === 'image'">
                    <ViewerImage v-model="carouselIndex" :items="[{ servicePath: contentsItem?.contObj.materialStoreUrl }]" />
                </div>
                <div v-else-if="contentsItem?.contObj.kofContentName === 'video'">
                    <ViewerVod
                        :service-path="contentsItem?.contObj.materialStoreUrl"
                        :service-thumbnail-path="contentsItem?.contObj.thumbStoreUrl"
                    />
                </div>
                <div v-else-if="contentsItem?.contObj.kofContentName === 'pdf'">
                    <ViewerPdf :service-path="contentsItem?.contObj.materialStoreUrl" />
                </div>
                <!--
                    CHECKLIST: kofContent 값이 화이트보드일 때 자료유형에 따라 로직 수정 필요(교사: 이미지, 학생: 화이트보드)
                -->
                <div v-else-if="contentsItem?.contObj.kofContentName === 'whiteboard'">화이트보드</div>
                <div v-else>
                    <ViewerFileCard
                        :file-name="contentsItem?.contObj.materialName"
                        :file-type="contentsItem?.contObj.kofContent"
                        :file-url="contentsItem?.contObj.materialStoreUrl"
                    />
                </div>
            </template>
        </div>
        <div v-if="user.mode === 'student' && layerData.entry === 'workbook'" class="viewer_btn_wrap">
            <v-btn rounded flat class="outlined_bk">다시풀기</v-btn>
            <template v-if="classState !== 'ready'">
                <v-btn rounded flat class="black" @click="setAnswer">선생님께 제출하기</v-btn>
            </template>
            <template v-else-if="classState === 'ready' && !contentsItem?.learnActivityFlag">
                <v-btn rounded flat class="black">스스로 채점하기</v-btn>
            </template>
        </div>
        <!-- PagiNation 영역 -->
        <PageIndicator
            v-if="contentsTotalCnt > 0"
            :current-page="layerData.currentPage || 1"
            :page-count="contentsTotalCnt"
            @page="setPage"
        />
        <!-- 학습 활동 제출 내역 영역(학습대기인 경우 미노출) -->
        <div v-if="classState != 'ready'" class="submit_wrap">
            <template v-if="user.mode == 'student' && layerData.entry !== 'workbook'">
                <!-- 임시용(답안제출) -->
                <v-btn rounded flat class="black" @click="setAnswer">선생님께 제출하기</v-btn>
            </template>
            <template v-else>
                <ActivityLearnImage :data="contentsItem" @detail="index => showDetail(index)" />
            </template>
        </div>
    </div>
    <!-- 크게보기 팝업 -->
    <Modal v-if="type === 'imageDetail'">
        <div class="st_info_wrap">
            <div class="st_info_area">
                <div ref="profileRef" class="st_pho">
                    <img :src="userLearnList[detailIndex].profileUrl" />
                </div>
                <span class="txt_num">{{ userLearnList[detailIndex].number }}번</span>
                <span class="txt_name ellipsis">{{ userLearnList[detailIndex].name }}</span>
            </div>
        </div>
        <ViewerImage v-model="carouselIndex" :items="userLearnList.filter(student => student.answerShow)" />
        <template #bottom>
            <div class="bottom_btn_wrap">
                <v-btn rounded size="large" class="outlined_bk" @click="hideDetail(detailIndex)">숨김</v-btn>
                <v-btn rounded size="large" class="black">학생에게 공유</v-btn>
            </div>
        </template>
    </Modal>
</template>

<script setup>
onMounted(() => {
    getContents();
});

const { t } = useI18n();
const { openModal, closeModal, type } = useModal();
const { layerData, addKeyValue } = useLayerStore();

//사용자
const { user } = storeToRefs(useApiUserStore());

//webRtc
const webRtcStore = useWebRtcStore();
const webRtcLayerData = ref({
    name: layerData.name,
    info: layerData.info,
    locale: 'off',
    period: layerData.period
});

const { userLearnList } = storeToRefs(webRtcStore);

//수업상태
const { classState } = storeToRefs(useApiClassStore());

const detailIndex = computed(() =>
    userLearnList.value.findIndex(
        student => student.number === userLearnList.value.filter(student => student.answerShow)[carouselIndex.value].number
    )
);

//콘텐츠
const apiCourseStore = useApiCourseStore();
const { contentsTotalCnt, contentsItem } = storeToRefs(apiCourseStore);
const getContents = async () => {
    //초기값-첫페이지
    if (!layerData.currentPage) {
        addKeyValue(layerData.id, { currentPage: 1 });
    }

    //entry type 진도학습 : progress, 수학익힘 : workbook
    layerData.period.entry = layerData.entry;
    await apiCourseStore.getContentsItem(layerData.period, layerData.currentPage);

    //콘텐츠뷰잉(교사용)
    if (user.value.mode == 'teacher') {
        //전체 학생에게 전달
        const data = webRtcLayerData.value;
        data.currentPage = layerData.currentPage;
        data.entry = layerData.entry;
        webRtcStore.setSendMessage('teacher', 'all', 'ContentsViewingAction', { data: data });
    }
};
const setPage = page => {
    layerData.currentPage = page;
    getContents();
};

//답안제출(학생용)
const setAnswer = async () => {
    const userItem = user.value;
    userItem.contentsId = contentsItem.value?.contObj.curriculumPeriodContentsId;
    //TODO : contentsNumber 컬럼 확인 필요
    //userItem.contentsNumber = contentsItem.value.contentsNumber;
    //TODO : thumbnailFileUrlPath 임시로 전달 추후 아이프레임 캡쳐 화면 전달 받는 path로 전달 필요
    userItem.servicePath = contentsItem.value?.contObj.thumbnailFileUrlPath;
    //교사에게 전달
    webRtcStore.setSendMessage('student', 'all', 'LearnActivityAction', { type: 'submit', data: { userItem } });
};

//학습활동(이미지형)-크게보기
const carouselIndex = ref(0);

const showDetail = index => {
    carouselIndex.value = userLearnList.value
        .filter(student => student.answerShow)
        .findIndex(student => student.number === userLearnList.value[index].number);
    openModal({ type: 'imageDetail' });
};

const hideDetail = index => {
    closeModal();
    userLearnList.value[index].answerShow = false;
};
</script>
