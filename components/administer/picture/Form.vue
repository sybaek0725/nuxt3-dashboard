<!--
@파일(Method): Form.vue
@작성자: 전상아
@작성일: 2023-12-27 17:06
@설명: 과제 관리 - 사진과제 탭
-->
<template>
    <!-- 과제를 제출하지 않았을 때 -->
    <Calendar
        :selected-date="selectedDate"
        :homework-date="workDateList"
        :submitted-date="submittedList"
        :notsubmitted-date="notSubmittedList"
        @date="setDate"
    />
    <div class="section_photo_homework">
        <div v-if="noData" class="banner_box">
            <i class="ico_tit_phone" />
            <span class="date">[{{ problemPlanStartDt }}~ {{ problemPlanEndDt }}]</span>
            {{ repetitionTypeCd }}
            <span v-for="item in repetitionDay" :key="item" class="secondary"
                ><em>{{ item }}</em
                >요일</span
            >에는
            <span class="secondary"
                ><em>{{ problemTypeCd }}</em></span
            >
            촬영하기
        </div>
        <div v-if="!noData" class="info no_data_area">
            <div class="ico picture_x_100 ico_size_25"></div>
        </div>
        <div v-if="showOtherComponent === 'notsubmitted' && layerData.isShowImageDetail === 'off'" class="img_upload_wrap flex">
            <div v-if="layerData.isShowImageDetail === 'off'" class="upload_area">
                <button flat class="btn_upload" @click="fileBtn.click" @dragenter="drag" @dragleave="drag" @dragover="drag" @drop="drop">
                    <span class="message_wrap">
                        <div class="ico_outer size_30 bg_gray">
                            <i class="ico attachment_80 ico_size_20"></i>
                        </div>
                        <p>
                            내 기기에서 찾아서 올리기<br />
                            <em>이곳을 클릭하거나, 파일을 드롭하세요</em>
                        </p>
                    </span>
                    <input ref="fileBtn" type="file" :style="{ display: 'none' }" accept="image/jpeg, image/png" @change="changeFile" />
                </button>
            </div>
            <div class="upload_area">
                <button flat class="btn_upload line">
                    <span v-if="!status" class="message_wrap">
                        <div class="ico_outer size_20 bg_gray">
                            <i class="ico picture_80 ico_size_30" @click="showCameraAgain"></i>
                        </div>
                        <p>
                            <button v-if="!status" @click="showCameraAgain">
                                <span><p>바로 찍어 올리기</p></span>
                            </button>
                        </p>
                    </span>
                    <span v-else-if="status" class="message_wrap">
                        <div class="ico_outer size_20 bg_gray">
                            <img v-if="!showCamera" :src="capturedPhoto" alt="Captured Photo" /><br />
                            <video v-if="showCamera" ref="videoElement" autoplay style="width: 109%; height: 100%"></video><br />
                            <canvas v-if="showCamera" ref="canvasElement" style="display: none"></canvas>
                        </div>
                    </span>
                </button>
                <v-btn v-if="status && showCamera" @click="takePhoto"><span>사진찍기</span></v-btn>
            </div>
        </div>

        <!-- 과제가 없거나, 날짜가 지났을때 -->
        <div v-if="showOtherComponent === 'notwork'" class="info no_data_area">
            <div v-if="overCheck === 'notOver'">
                <p>선택한 날짜에 과제가 없습니다.</p>
            </div>
            <div v-if="overCheck === 'over'" class="ico dashboard2_100 ico_size_25"></div>
            <p v-if="overCheck === 'over'">과제를 내야할 날짜가 지났어요.</p>
            <div v-if="overCheck === 'notReady'" class="ico calendar_x_100 ico_size_25"></div>
            <p v-if="overCheck === 'notReady'">아직 과제를 제출하는 날이 아닙니다.</p>
        </div>

        <!-- 과제를 업로드하거나 사진으로 찍었을 경우  -->
        <div v-if="layerData.isShowImageDetail === 'on'" class="viewer_box">
            <div class="img_box">
                <img v-if="showCamera" :src="layerData.imageData.servicePath" alt="" @error="imgLoadError" />
                <img v-if="!showCamera" :src="capturedPhoto" alt="Captured Photo" /><br />
            </div>
        </div>
        <!-- 과제를제출한경우(랜덤도장-선생님이 도장을찍어줬을시에만보임)  -->
        <div
            v-for="student in matchingStudentsList"
            v-else-if="showOtherComponent === 'submitted'"
            :key="student.problemUrl"
            class="viewer_box"
        >
            <div class="img_box">
                <v-img :src="student.problemUrl" alt="" />
                <div class="stamp_img"></div>
                <v-img v-if="student.isCnfStamp === '1'" :src="randomImageUrl" alt="Random Image" class="stamp_img" />
            </div>
        </div>

        <!-- 과제를 업로드하거나 사진으로 찍었을 경우(다시선택,제출버튼)  -->
        <div v-if="layerData.isShowImageDetail == 'on'" class="bottom_btn_wrap">
            <v-btn rounded class="outlined" @click="backTo">다시 선택</v-btn>
            <v-btn rounded class="primary" @click="uploadCapturedPhoto">제출</v-btn>
        </div>
    </div>
    <!-- <Modal v-if="type === 'checkedFalse'"> -->
    <Modal v-if="type === 'checkedFalse'">
        <div class="dialog type_letter">
            <div class="letter_inner">
                <div class="title_box">
                    <i class="ico message_40 ico_size_10"></i>
                    <span>선생님의 독려 메시지가 도착했습니다.</span>
                </div>
                <div class="contents_box">
                    <p>
                        오늘은 과제 제출하는 날, <br />
                        잊지말고 과제를 제출해주세요.
                    </p>
                </div>
            </div>
            <div class="letter_bottom">
                <div class="dialog_btn_wrap">
                    <v-btn rounded flat class="outlined_bk" @click="closeModal"> 닫기 </v-btn>
                    <v-btn rounded flat class="black" @click="confirmSubmit">
                        지금 바로 과제하러 하기
                        <i class="arrow_next"></i>
                    </v-btn>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script setup>
onMounted(() => {
    initPicture();
    // handleDateChange(today.value);
});

const { openModal, closeModal, type, isOpen } = useModal();
const { t } = useI18n();
const { layerData, addKeyValue, setAddLayer } = useLayerStore();
const fileBtn = ref(null);
const { changeFile, drag, drop, preview, imgLoadError } = useUpload('image');
const status = ref(false);
const studentList = ref([]);
const showOtherComponent = ref(null);

//제출기간 넘엇는지 체크
const overCheck = ref(null);
const selectedDate = ref(new Date());

const today = ref(new Date());
//날짜에 매칭되는 학생리스트
const matchingStudentsList = ref([]);
const videoElement = ref(null);
const canvasElement = ref(null);
const capturedPhoto = ref(null);
const showCamera = ref(false);
const currentImageIndex = ref(0);
const apiAdministerStore = useApiAdministerStore();
const { assignmentItems, dataSize } = storeToRefs(apiAdministerStore);

//과제시작일자
const problemPlanStartDt = ref(null);
//과제종료일자
const problemPlanEndDt = ref(null);
//과제구분타입
const problemTypeCd = ref(null);
//과제이름
const problemTypeNm = ref(null);
//과제반복주기(주)
const repetitionTypeCd = ref(null);
//과제반복주기(월)
const repetitionDay = ref([]);
//과제 Id
const problemsetId = ref(null);
//과제가없을때
const noData = ref(false);

const workDateList = ref([]);
const submittedList = ref([]);
const notSubmittedList = ref([]);

const currentSelectedDate = ref(new Date());

const initPicture = async currentData => {
    await apiAdministerStore.getStudentSchedule({
        studentId: user.value.studentId,
        courseId: 'ba294ecc-0e2b-4fa9-8baa-ecdef82cff92'
    });
    //workDateList.value = assignmentItems.value.map(date => new Date(date.problemDueDate));
    const uniqueWorkDateArray = assignmentItems.value.map(date => date.problemDueDate);
    const uniqueWorkDates = Array.from(new Set(uniqueWorkDateArray)).map(date => new Date(date));
    workDateList.value = uniqueWorkDates;

    // submittedList.value = assignmentItems.value.filter(submit => submit.isSubmit == '1').map(date => new Date(date.problemDueDate));
    const uniqueSubmittedArray = assignmentItems.value.filter(submit => submit.isSubmit == '1').map(date => date.problemDueDate);
    const uniqueSubmittedDate = Array.from(new Set(uniqueSubmittedArray)).map(date => new Date(date));
    submittedList.value = uniqueSubmittedDate;

    // notSubmittedList.value = assignmentItems.value.filter(submit => submit.isSubmit == '0').map(date => new Date(date.problemDueDate));
    const uniqueNotSubmittedArray = assignmentItems.value.filter(submit => submit.isSubmit == '0').map(date => date.problemDueDate);
    const uniqueNotSubmittedDate = Array.from(new Set(uniqueNotSubmittedArray)).map(date => new Date(date));
    notSubmittedList.value = uniqueNotSubmittedDate;

    studentList.value = assignmentItems.value;
    const currnetDateValue = currentData || today.value;
    handleDateChange(currnetDateValue);

    //독려메시지 있을시
    const isMotive = assignmentItems.value.filter(
        motive => formatDate(new Date(motive.problemDueDate)) === formatDate(new Date(today.value))
    );
    if (isMotive.length > 0) {
        openModal({ type: 'checkedFalse', closeBtnClass: false });
    }
};
//사용자(교사/학생)
const { user } = storeToRefs(useApiUserStore());
const imageUrls = ref([
    'images/common/ico_stamp01.svg',
    'images/common/ico_stamp02.svg',
    'images/common/ico_stamp03.svg',
    'images/common/ico_stamp04.svg',
    'images/common/ico_stamp05.svg'
]);

//도장 랜덤
const randomImageUrl = computed(() => {
    const randomIndex = Math.floor(Math.random() * imageUrls.value.length);
    return `/_nuxt/assets/${imageUrls.value[currentImageIndex.value]}`;
});

watch(
    () => selectedDate.value,
    value => {
        handleDateChange(value);
    }
);

const setDate = date => {
    // if (formatDate(today.value) <= formatDate(date.date)) {
    selectedDate.value = date.date;
    studentList.value = assignmentItems.value;
    //} else {
    //}
};

const formatDate = formattedDate => {
    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
};

const handleDateChange = value => {
    const localDate = value;
    studentList.value = assignmentItems.value;
    currentSelectedDate.value = value;
    matchingStudentsList.value = [];

    const cuurentSelectStudentsInfo = studentList.value.filter(
        student => formatDate(new Date(student.problemDueDate)) === formatDate(value)
    );
    if (cuurentSelectStudentsInfo.length > 0) {
        problemPlanStartDt.value = cuurentSelectStudentsInfo[0].problemPlanStartDt.replace(/\s\d{2}:\d{2}:\d{2}$/, '');
        problemPlanEndDt.value = cuurentSelectStudentsInfo[0].problemPlanEndDt.replace(/\s\d{2}:\d{2}:\d{2}$/, '');
        problemsetId.value = cuurentSelectStudentsInfo[0].problemsetId;
        problemTypeCd.value = ptypeString(cuurentSelectStudentsInfo[0].problemTypeCd, cuurentSelectStudentsInfo[0].problemTypeNm);
        const rtypeStr = cuurentSelectStudentsInfo[0].repetitionDay.split(',');
        repetitionDay.value = rtypeStr.map(item => rtypeString(item));
        repetitionTypeCd.value = rpetypeString(cuurentSelectStudentsInfo[0].repetitionTypeCd);
        problemTypeNm.value = cuurentSelectStudentsInfo[0].problemTypeNm;
        noData.value = true;
    } else {
        noData.value = false;
    }
    const matchingStudents = studentList.value.filter(
        student => student.isSubmit === '1' && formatDate(new Date(student.problemDueDate)) === formatDate(value)
    );
    if (matchingStudents.length > 0) {
        //제출한날
        showOtherComponent.value = 'submitted';
        matchingStudentsList.value.push(...matchingStudents);
        currentImageIndex.value = Math.floor(Math.random() * imageUrls.value.length);
    } else if (workDateList.value.every(date => formatDate(date) !== formatDate(localDate))) {
        //과제 없는날
        layerData.isShowImageDetail = 'off';
        showOtherComponent.value = 'notwork';
        overCheck.value = 'notOver';
    } else if (
        workDateList.value.some(date => formatDate(date) === formatDate(localDate)) &&
        localDate.getDate() === today.value.getDate()
    ) {
        //과제는 있고 제출은 안한날
        showOtherComponent.value = 'notsubmitted';
        status.value = false;
        showCamera.value = true;
        layerData.isShowImageDetail = 'off';
    } else if (workDateList.value.some(date => formatDate(date) === formatDate(localDate) && localDate <= today.value)) {
        showOtherComponent.value = 'notwork';
        overCheck.value = 'over';

        // showOtherComponent.value = 'notsubmitted';
        // status.value = false;
        // showCamera.value = true;
        // layerData.isShowImageDetail
    } else if (workDateList.value.some(date => formatDate(date) === formatDate(localDate) && localDate > today.value)) {
        showOtherComponent.value = 'notwork';
        overCheck.value = 'notReady';
    }
};

const rtypeString = input => {
    switch (input) {
        case 'MONDAY':
            return '월';
        case 'TUESDAY':
            return '화';
        case 'WEDNESDAY':
            return '수';
        case 'THURSDAY':
            return '목';
        case 'FRIDAY':
            return '금';
    }
};

const ptypeString = (input, type) => {
    switch (input) {
        case '01':
            return '오답노트';
        case '02':
            return '수학 교과서';
        case '03':
            return '수학 익힘책';
        case '04':
            return '수학노트';
        case '10':
            return type;
    }
};

const rpetypeString = input => {
    switch (input) {
        case '1W':
            return '매주마다';
        case '2W':
            return '2주마다';
        case '3W':
            return '3주마다';
        case '4W':
            return '4주마다';
    }
};

//다시선택클릭시
const backTo = () => {
    showOtherComponent.value = 'notsubmitted';
    layerData.isShowImageDetail = 'off';
    showCamera.value = true;
    status.value = false;
    initializeVideo(); // 카메라 초기화
};

//지금 바로 제출하기
const confirmSubmit = () => {
    closeModal();
    handleDateChange(today.value);
};
const initializeVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                videoElement.value.srcObject = stream;
            })
            .catch(error => {});
    }
};

const takePhoto = () => {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    capturedPhoto.value = canvas.toDataURL('image/png');
    showCamera.value = false; // 카메라 숨기기
    layerData.isShowImageDetail = 'on';
};

const uploadCapturedPhoto = async () => {
    //제출처리 업데이트
    const imageUrl = capturedPhoto.value || layerData.imageData.servicePath;
    showOtherComponent.value = 'submitted';
    layerData.isShowImageDetail = 'off';
    const data = {
        studentId: user.value.studentId,
        problemDueDate: formatDate(currentSelectedDate.value),
        problemsetId: problemsetId.value,
        //problemsetId: "fae85081-861e-442d-9f0c-43b2f50e3cd8", --테스트용과제ID
        problemUrl: imageUrl,
        submitTypeCode: '02',
        problemStatusCd: '02'
    };

    const { status } = await apiAdministerStore.setStudentScheduleSubmit(data);

    initPicture(currentSelectedDate.value);
};

const showCameraAgain = () => {
    showCamera.value = true;
    status.value = true;
    initializeVideo(); // 카메라 초기화
};
</script>

<style scoped>
#video {
    border: 1px solid black;
    box-shadow: 2px 2px 3px black;
    width: 900px;
    height: 300px;
}

img {
    width: 500px;
    height: auto;
}

#canvas {
    width: 64px;
    /* 가로 크기 설정 */
    height: 48px;
    /* 세로 크기 설정 */
}

.camera {
    width: 340px;
    display: inline-block;
}

.output {
    width: 340px;
    display: inline-block;
    vertical-align: top;
}

#takephoto {
    display: block;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    bottom: 32px;
    background-color: rgba(0, 150, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-family: 'Lucida Grande', 'Arial', sans-serif;
    color: rgba(255, 255, 255, 1);
}
</style>
