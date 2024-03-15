<!--
@파일(Method): Image.vue
@작성자: 백소연
@작성일: 2023-12-05 18:25
@설명: 학습활동(이미지형)
@수정: ver3.3 퍼블리싱 정합(soyeonbaek 24.03.13)
-->
<template>
    <div class="card_type">
        <div class="tab_head">
            <v-tabs v-model="tab">
                <v-tab value="one">
                    <div class="d-flex align-center">학습 활동 제출 내역<i class="ml-2 ico arrow_up_30 ico_color_white" /></div>
                </v-tab>
            </v-tabs>
        </div>
        <div class="tab_body relative">
            <div class="tab_actions">
                <div class="d-flex align-center gap1">
                    <v-btn rounded flat class="black" @click="setShowAll(true)">모두 보이기</v-btn>
                    <v-btn rounded flat class="black" @click="setShowAll(false)">모두 숨기기</v-btn>
                    <span>
                        미제출 &#58; <em>{{ classStudent.length - userLearnList.length }}명</em>
                    </span>
                </div>
            </div>
            <v-window v-model="tab">
                <v-window-item value="one" :transition="false" :reverse-transition="false">
                    <div class="student_preview layout">
                        <div class="student_preview" v-for="(item, index) in userLearnList" :key="index">
                            <div class="list-img list-img-direction-column">
                                <template v-if="item?.answerShow">
                                    <div class="list-img-head list-img-head-padding">
                                        <!-- avatar 영역 -->
                                        <div class="avatar avatar-box">
                                            <img :src="item.profileUrl" alt="학생 프로필 이미지" class="avatar-item" />
                                            <div class="avatar-info">
                                                <span class="info_number">{{ item.number }}번</span>
                                                <span class="info_name">{{ item.name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="list-img-body">
                                        <!-- overlay 영역 -->
                                        <div class="list-img-body list-img-body-center list-img-body-opacity list-img-overlay">
                                            <div class="banner banner-square banner-square-xs" />
                                            <div class="list-img-overlay list-img-overlay-center list-img-overlay-center-gap">
                                                <v-btn rounded class="outlined_bk" @click="setShow(item)">
                                                    <p>숨기기</p>
                                                </v-btn>
                                                <v-btn rounded class="outlined_bk" @click="$emit('detail', index)">
                                                    <p>크게보기</p>
                                                </v-btn>
                                                <v-btn rounded class="outlined_bk">
                                                    <div>
                                                        <p>공유</p>
                                                    </div>
                                                </v-btn>
                                            </div>
                                        </div>
                                        <div class="banner banner-square banner-square-xs">
                                            <img src="@/assets/images/common/banner_student.png" alt="banner_student" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="list-img-head list-img-head-padding">
                                        <!-- avatar 영역 -->
                                        <div class="avatar avatar-box">
                                            <div class="avatar">
                                                <i class="ico avatar_30_face ico_size_12" />
                                            </div>
                                            <div class="avatar-info invisible-info"></div>
                                        </div>
                                    </div>
                                    <div class="list-img-body">
                                        <!-- overlay 영역 -->
                                        <div class="list-img-body list-img-body-center list-img-overlay">
                                            <div class="banner banner-square banner-square-xs banner-bg-basic" />
                                            <div class="list-img-overlay list-img-overlay-center list-img-overlay-center-gap">
                                                <v-btn rounded class="outlined_bk" @click="setShow(item)">보이기</v-btn>
                                            </div>
                                        </div>
                                        <div class="banner banner-square banner-square-xs"></div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: null
    }
});

const tab = ref(null);

//반학생
const { classStudent } = storeToRefs(useApiClassStore());

//webRtc
const { userLearnList } = storeToRefs(useWebRtcStore());

//학습활동(이미지형)-모두보이기/모두숨기기
const setShowAll = value => {
    userLearnList.value = userLearnList.value.map(obj => {
        return { ...obj, answerShow: value };
    });
};

//학습활동(이미지형)-보이기/숨기기
const setShow = value => {
    userLearnList.value.filter(e => e.studentId == value.studentId).forEach(e => (e.answerShow = !value.answerShow));
};

//학습활동(이미지형)-크게보기
defineEmits(['detail']);
</script>

<style scoped></style>
