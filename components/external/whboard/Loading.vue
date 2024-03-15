<!--
@파일(Method): Loading.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:11
@설명: 화이트 보드 전송 중 콘텐츠 영역
@설명: 내용 부분 UI 및 데이터 연결 예정
-->
<template>
    <div class="class_board class_board_box h-100">
        <div class="tab_Body relative">
            <div class="tab_actions">
                <div class="d-flex align-center justify-end gap1">
                    <v-btn rounded class="black" @click="openModal({ type: 'whboardProblem' })">문제 보기</v-btn>
                    <v-btn rounded class="black" @click="showAll">모두 보이기</v-btn>
                    <v-btn rounded class="black" @click="hideAll">모두 숨기기</v-btn>
                    <span
                        >미제출 : <em>{{ classStudent.length - userWhboardList.length }}명</em></span
                    >
                    <!-- <span class="txt_wrap"
                        >발표하고 싶은 사람 :
                        <em class="text-orange" @click="blinkProfile(userWhboardList)"
                            >{{ userWhboardList.filter(student => student.presentation).length }}명</em
                        ></span
                    > -->
                </div>
            </div>
            <div class="student_preview layout">
                <div v-for="(student, index) in userWhboardList" :key="student.number" class="student_preview">
                    <div class="list-img list-img-direction-column">
                        <div class="list-img-head list-img-head-padding">
                            <div class="avatar avatar-box">
                                <div v-if="student.show" @click="handleClickProfile(student, index)">
                                    <i v-show="student.isPresenter" class="avatar_with_icon ico fist" />
                                    <img :src="student.profileUrl" class="avatar-item" :alt="student.name" />
                                </div>
                                <div v-else class="avatar">
                                    <i class="ico avatar_30_face ico_size_12" />
                                </div>

                                <div v-if="student.show" class="avatar-info">
                                    <span class="info_number">{{ student.number }}번</span>
                                    <span class="info_name">{{ student.name }}</span>
                                </div>
                                <div v-else class="avatar-info invisible-info"></div>
                            </div>
                        </div>
                        <div class="list-img-body">
                            <div v-if="student.show" class="list-img-body list-img-body-center list-img-body-opacity list-img-overlay">
                                <div class="banner banner-square banner-square-xs" />
                                <div class="list-img-overlay list-img-overlay-center list-img-overlay-center-gap">
                                    <v-btn rounded class="outlined_bk" @click="hideItem(index)">
                                        <p>숨기기</p>
                                    </v-btn>
                                    <v-btn rounded class="outlined_bk" @click="showDetail(index)">
                                        <p>크게보기</p>
                                    </v-btn>
                                    <v-btn
                                        rounded
                                        class="outlined_bk"
                                        @click="
                                            submit('contents', {
                                                servicePath: student.servicePath,
                                                type: 'image'
                                            })
                                        "
                                    >
                                        <div>
                                            <p>공유</p>
                                        </div>
                                    </v-btn>
                                </div>
                            </div>
                            <div v-else class="list-img-body list-img-body-center list-img-overlay">
                                <div class="banner banner-square banner-square-xs banner-bg-basic" />
                                <div class="list-img-overlay list-img-overlay-center list-img-overlay-center-gap">
                                    <v-btn rounded class="outlined_bk" @click="showItem(index)">보이기 </v-btn>
                                </div>
                            </div>

                            <!-- 결과물 -->
                            <div v-if="student.show" class="banner banner-square banner-square-xs">
                                <img :src="student.servicePath" alt="banner_student" />
                            </div>
                            <div v-else class="banner banner-square banner-square-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 문제보기 -->
            <Modal v-if="type === 'whboardProblem'">
                <div>문제보기</div>
                <v-img :src="layerData.itemData.servicePath" />
            </Modal>

            <!-- 크게보기 -->
            <Modal v-if="type === 'whboardDetail'">
                <div class="st_info_wrap">
                    <div class="st_info_area">
                        <div ref="profileRef" class="st_pho">
                            <img :src="userWhboardList[detailIndex].profileUrl" />
                        </div>
                        <span class="txt_num">{{ userWhboardList[detailIndex].number }}번</span>
                        <span class="txt_name ellipsis">{{ userWhboardList[detailIndex].name }}</span>
                    </div>
                </div>
                <ViewerImage v-model="carouselIndex" :items="userWhboardList.filter(student => student.show)" />
                <template #bottom>
                    <div class="bottom_btn_wrap">
                        <v-btn rounded size="large" class="outlined_bk" @click="hide(detailIndex)">숨김</v-btn>
                        <v-btn rounded size="large" class="black">학생에게 공유</v-btn>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>
<script setup>
const { layerData } = useLayerStore();
const { openModal, type, closeModal } = useModal();
const { profileRef, blinkProfile } = useBlink();
const { submit } = useExternal();

//webRtc
const webRtcStore = useWebRtcStore();
const { userWhboardList } = storeToRefs(webRtcStore);

//반학생
const { classStudent } = storeToRefs(useApiClassStore());

const detailIndex = computed(() =>
    userWhboardList.value.findIndex(
        student => student.number === userWhboardList.value.filter(student => student.show)[carouselIndex.value].number
    )
);
const carouselIndex = ref(0);

const showItem = index => {
    userWhboardList.value[index].show = true;
};
const hideItem = index => {
    userWhboardList.value[index].show = false;
};
const showAll = () => {
    userWhboardList.value.forEach(student => (student.show = true));
};
const hideAll = () => {
    userWhboardList.value.forEach(student => (student.show = false));
};
const hide = index => {
    userWhboardList.value[index].show = false;
    closeModal({ type: 'whboardDetail' });
};

const handleClickProfile = (student, index) => {
    if (!student.show || student.isPresenter) return;

    if (confirm('발표자를 추가할까요?')) {
        userWhboardList.value[index].isPresenter = true;
    }
};

const showDetail = index => {
    carouselIndex.value = userWhboardList.value
        .filter(student => student.show)
        .findIndex(student => student.number === userWhboardList.value[index].number);
    openModal({ type: 'whboardDetail' });
};
</script>

<style scoped lang="scss">
.blinking {
    animation: blink 0.5s infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
