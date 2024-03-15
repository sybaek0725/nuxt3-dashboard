<!-- 
@파일(Method): Basic.vue
@작성자: 서동건
@작성일: 2023-12-04 16:33
@설명: 설정 - 기본설정
@수정: UI 정리(LEE-24.02.01) 
       user 과목 정보 변경(role->subject)(LEE 24.02.14)
-->
<template>
    <div class="study_item_con">
        <div class="profile_wrap">
            <!-- title_wrap -->
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>기본 정보</em>
                    <span class="txt_area">프로필 사진 및 비밀번호를 설정할 수 있습니다.</span>
                </span>
            </div>
            <div class="section_content profile_main">
                <div class="profile_info">
                    <div class="pho_wrap">
                        <v-btn
                            flat
                            rounded
                            class="btn_photo"
                            @click="
                                openModal({
                                    type: 'settingDetail',
                                    title: '프로필 사진',
                                    buttonLabels: ['취소', '저장']
                                })
                            "
                        >
                        </v-btn>
                        <!-- 프로필 사진 팝업 -->
                        <Modal v-if="type === 'settingDetail'" @modal-closed="onCloseModal">
                            <div>
                                <div class="dialog_message">
                                    <p class="sub_tit">원본사진</p>
                                    <div class="profile_photo">
                                        <div class="img_upload_wrap">
                                            <div class="upload_area">
                                                <button
                                                    flat
                                                    class="btn_upload"
                                                    @click="fileBtn.click"
                                                    @dragenter="drag"
                                                    @dragleave="drag"
                                                    @dragover="drag"
                                                    @drop="drop"
                                                >
                                                    <span class="message_wrap">
                                                        <span class="ico upload">
                                                            이곳을 클릭하거나, <br />파일을 드롭하세요.<br />
                                                            <em>(파일 1개, 업로드 용량 제한 5MB)</em>
                                                        </span>
                                                    </span>
                                                    <input
                                                        ref="fileBtn"
                                                        type="file"
                                                        :style="{ display: 'none' }"
                                                        accept="image/jpeg, image/png"
                                                        @change="changeFile"
                                                    />
                                                </button>
                                            </div>
                                            <div class="pho_wrap">
                                                <div class="pho_area">
                                                    <div class="img_wrap">
                                                        <img
                                                            v-if="selectedData.fileUrl"
                                                            :src="selectedData.fileUrl"
                                                            alt=""
                                                            @error="imgLoadError"
                                                        />
                                                        <img v-else src="@/assets/images/common/pho_noimg.svg" alt="" />
                                                    </div>

                                                    <p class="txt_pho">프로필 사진 미리보기</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <!-- //프로필 사진 팝업 -->
                        <div class="img_wrap">
                            <!-- 이미지가 없을 경우-->
                            <img v-if="pictures === '1'" src="@/assets/images/common/pho_noimg.svg" alt="" />
                            <!-- 이미지가 있을 경우 -->
                            <img v-if="pictures === '2'" src="@/assets/images/temp/img_pho_te.png" alt="" />
                        </div>
                    </div>
                    <div class="txt_name">
                        {{ userInfo().name }} <span v-if="user.mode == 'student'">{{ t('common.text.student') }}</span
                        ><span v-else>{{ t('common.text.teacher') }}</span>
                    </div>
                    <div>
                        <v-radio-group v-model="pictures" class="large primary" inline>
                            <v-radio label="기본 이미지 사용" value="1"></v-radio>
                            <v-radio label="사진 사용" value="2"></v-radio>
                        </v-radio-group>
                    </div>
                </div>
                <div class="profile_table">
                    <table v-if="user.mode == 'teacher'" class="table_view">
                        <caption>
                            선생님 프로필
                        </caption>
                        <colgroup>
                            <col style="width: 25%" />
                            <col style="width: 30%" />
                            <col style="width: 25%" />
                            <col style="width: auto" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>이름 (아이디)</th>
                                <td>{{ userInfo().name }} {{ t('common.text.teacher') }}</td>
                                <th>담당 과목</th>
                                <td>{{ userInfo().subject }}</td>
                            </tr>
                            <tr>
                                <th>담당 학년/반</th>
                                <td>{{ userInfo().grade }} / {{ userInfo().classNum }}</td>
                                <th>담당 학생 수</th>
                                <td>25명</td>
                            </tr>
                            <tr>
                                <th>소속 학교명</th>
                                <td colspan="3">{{ userInfo().schoolName }}</td>
                            </tr>
                            <tr>
                                <th>정보 업데이트</th>
                                <td colspan="3">
                                    <v-btn rounded flat size="small" class="gray">업데이트 하기</v-btn>&nbsp;&nbsp; 최근 업데이트 일자
                                    2023.06.10.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-if="user.mode == 'student'" class="table_view">
                        <caption>
                            학생 프로필
                        </caption>
                        <colgroup>
                            <col style="width: 20%" />
                            <col style="width: 20%" />
                            <col style="width: 30%" />
                            <col style="width: auto" />
                        </colgroup>
                        <tr>
                            <th>학교명</th>
                            <td colspan="3">{{ userInfo().schoolName }}</td>
                        </tr>
                        <tr>
                            <th>과목</th>
                            <td>{{ userInfo().subject }}</td>
                            <th>담당 선생님 이름</th>
                            <td>{{ user.teacherName }}</td>
                        </tr>
                        <tr>
                            <th>학생 이름</th>
                            <td>{{ userInfo().name }} {{ t('common.text.student') }}</td>
                            <th>학년/반/번호</th>
                            <td>{{ userInfo().grade }}/ {{ userInfo().classNum }} / {{ user.number }} 번</td>
                        </tr>
                        <tr>
                            <th>아이디</th>
                            <td colspan="3">{{ user.studentId }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- //title_wrap -->
            <!-- title_wrap -->
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>음량 관리</em>
                    <span v-if="zoom === 0 && zoom1 === 0" class="option">마이크와 스피커가 현재 꺼져 있습니다.</span>
                    <span v-else-if="zoom1 === 0" class="option">마이크가 현재 꺼져 있습니다.</span>
                    <span v-else-if="zoom === 0" class="option">스피커가 현재 꺼져 있습니다.</span>
                </span>
            </div>

            <div class="section_content section_sound">
                <div class="box">
                    <span class="label">스피커</span>
                    <div class="speaker">
                        <v-slider
                            v-model="zoom"
                            class="custom_primary"
                            thumb-color="black"
                            hide-details
                            :thumb-size="40"
                            prepend-icon="icon_type regular disabled on"
                            @click:append="zoomIn"
                            @click:prepend="zoomOut"
                        ></v-slider>
                    </div>
                </div>
                <div class="box">
                    <span class="label">마이크</span>
                    <div class="mike">
                        <v-slider
                            v-model="zoom1"
                            class="custom_primary"
                            thumb-color="black"
                            hide-details
                            :thumb-size="40"
                            prepend-icon="icon_type regular disabled on"
                            @click:append="zoomIn1"
                            @click:prepend="zoomOut1"
                        ></v-slider>
                    </div>
                </div>
            </div>
            <!-- //title_wrap -->
            <!-- title_wrap -->
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em v-if="user.mode == 'teacher'">정보 연동 설정</em>
                    <em v-if="user.mode == 'student'">알림 설정</em>
                    <span v-if="user.mode == 'teacher'" class="txt_area">반 학생 관리 및 어드민 정보 연동 업데이트를 할 수 있습니다.</span>
                    <span v-if="user.mode == 'student'" class="txt_area">수업에 필요한 알림을 설정할 수 있습니다.</span>
                </span>
            </div>
            <div class="section_content section_update">
                <div v-if="user.mode == 'teacher'" class="box">
                    <span class="label">반 학생 관리</span>
                    <div class="btn_wrap">
                        <v-btn rounded flat size="small" class="gray"
                            >관리하기

                            <v-dialog v-model="dialog2" persistent activator="parent" transition="dialog-center-transition" width="auto">
                                <div class="dialog_wrap teacher_area x_large">
                                    <div class="title">
                                        반 학생관리
                                        <v-btn flat class="btn_close" @click="dialog2 = false">
                                            <span class="blind">닫기</span>
                                        </v-btn>
                                    </div>
                                    <div class="dialog_message">
                                        <div class="st_list_wrap">
                                            <div class="st_item">
                                                <p class="sub_tit">현재 반 학생 목록</p>
                                                <div class="st_box study_thumb_list">
                                                    <ul>
                                                        <li v-for="(item, index) in student" :key="index">
                                                            <div class="st_info_wrap">
                                                                <div class="st_info_area">
                                                                    <div class="st_pho">
                                                                        <img :src="item.src" />
                                                                    </div>
                                                                    <span class="txt_num">{{ item.number }}</span>
                                                                    <span class="txt_name ellipsis">{{ item.name }}</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="st_item arrow_wrap">
                                                <div>
                                                    <v-btn flat class="arrow_right">
                                                        <span class="blind">대기목록이동</span>
                                                    </v-btn>
                                                    <v-btn flat class="arrow_left">
                                                        <span class="blind">현재학생목록</span>
                                                    </v-btn>
                                                </div>
                                            </div>
                                            <div class="st_item">
                                                <p class="sub_tit">
                                                    대기 학생 목록
                                                    <v-btn rounded flat size="small" class="gray">불러오기</v-btn>
                                                </p>
                                                <div class="st_box study_thumb_list no_data">
                                                    <div class="no_data_txt">
                                                        현재 대기 학생이 없습니다.<br />
                                                        불러오기를 통해 확인해 주세요.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dialog_btn_wrap">
                                        <v-btn rounded flat class="outlined_bk" @click="dialog2 = false">취소 </v-btn>
                                        <v-btn class="black" flat rounded @click="dialog2 = false"> 저장</v-btn>
                                    </div>
                                </div>
                            </v-dialog>
                        </v-btn>
                    </div>
                </div>
                <div v-if="user.mode == 'teacher'" class="box">
                    <span class="label">어드민 정보 업데이트</span>
                    <div class="btn_wrap">
                        <v-btn rounded flat size="small" class="gray">업데이트 하기</v-btn>
                        <span class="txt_gray update-date">최근 업데이트 날짜 2023.09.30 12:45:53</span>
                    </div>
                </div>
                <div v-if="user.mode == 'student'" class="box">
                    <span class="label">수업 시작 알림</span>
                    <v-radio-group v-model="startClassSelected" class="large primary" inline hide-details>
                        <v-radio label="사용" :value="true"></v-radio>
                        <v-radio label="미사용" :value="false"></v-radio>
                    </v-radio-group>
                </div>

                <div v-if="user.mode == 'student'" class="box">
                    <span class="label">과제 등록 알림</span>
                    <v-radio-group v-model="projectRegistraionSelected" class="large primary" inline hide-details>
                        <v-radio label="사용" value="1"></v-radio>
                        <v-radio label="미사용" value="2"></v-radio>
                    </v-radio-group>
                </div>
            </div>
            <!-- //title_wrap -->

            <div class="bottom_btn_wrap">
                <v-btn rounded size="large" class="primary" @click="setData">저장</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    apiSettingStore.getBasicItem(mode.value);
});
const apiSettingStore = useApiSettingStore();
const { basicItem } = storeToRefs(apiSettingStore);
console.log('basicItem', basicItem);
const { user } = storeToRefs(useApiUserStore());
const mode = ref(user.value.mode);
const setData = async () => {
    if (user.value.mode == 'student') {
        //학생설정수정
        basicItem.value.alarmActive = startClassSelected.value;
        console.log('학생입니다');
    } else {
        //교사 설정수정
        basicItem.value.alarmActive = true;
        basicItem.value.alarmTime = 10;
        const { status } = await apiSettingStore.setBasicItem(basicItem.value);
        if (status.value == 'success') {
            alert('저장되었습니다.');
        }
    }
};
const { selectedData, changeFile, drag, drop, imgLoadError } = useUpload('image');
const { openModal, type } = useModal();
const pictures = ref('1');
const zoom = ref(0);
const zoom1 = ref(0);
const dialog2 = ref(false);
const { t } = useI18n();
let fileBtn = ref(null);
const startClassSelected = ref(true);
const projectRegistraionSelected = ref('1');

const userInfo = () => {
    if (user) {
        const name = t('setting.basic.name', { name: user.value.name });
        const subject = t('setting.basic.subject', { subject: user.value.subject });
        const grade = t('setting.basic.grade', { grade: user.value.classInfo.grade });
        const classNum = t('setting.basic.classNum', { classNum: user.value.classInfo.classNum });
        const schoolName = t('setting.basic.schoolName', { schoolName: user.value.schoolName });
        return { name: name, subject: subject, grade: grade, classNum: classNum, schoolName: schoolName };
    }
    return { name: '', subject: '', grade: '', classNum: '', schoolName: '' };
};

const student = ref([
    { number: '16번', name: '고준희', src: useAsset('images/temp/img_st_photo.png') },
    { number: '13번', name: '김승주', src: useAsset('images/temp/img_st_photo.png') },
    { number: '12번', name: '백소연', src: useAsset('images/temp/img_st_photo.png') },
    { number: '11번', name: '박보현', src: useAsset('images/temp/img_st_photo.png') },
    { number: '15번', name: '서동건', src: useAsset('images/temp/img_st_photo.png') },
    { number: '17번', name: '장만순', src: useAsset('images/temp/img_st_photo.png') }
]);

const zoomOut = () => {
    zoom.value = zoom.value - 10 || 0;
};
const zoomIn = () => {
    zoom.value = zoom.value + 10 || 100;
};
const zoomOut1 = () => {
    zoom1.value = zoom1.value - 10 || 0;
};
const zoomIn1 = () => {
    zoom1.value = zoom1.value + 10 || 100;
};
const zoomType1 = computed(() => {
    return zoom.value === 0 ? 'icon_type reqular small on' : 'icon_type reqular big';
});
const zoomType2 = computed(() => {
    return zoom1.value === 0 ? 'icon_type reqular small on' : 'icon_type reqular big';
});
const onCloseModal = () => {
    selectedData.value.fileUrl = null;
};
</script>
