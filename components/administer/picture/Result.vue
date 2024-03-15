<!--
@파일(Method): Index.vue
@작성자: LEE
@작성일: 2024-01-31 09:06
@설명: 사진과제 - 과제결과
@수정:
-->
<template>
    <Calendar :selected-date="selectedDate" @date="setDate" />
    <div class="section_photo_homework">
        <div v-if="dateFilter" class="photo_homework_schedule">
            <div class="line">
                <div class="subject">과제기간</div>
                <div class="form-item">
                    <v-btn rounded flat class="outlined_point"> 2023-09-01 ~ 2023-10-22 </v-btn>
                </div>
            </div>
            <div class="line">
                <div class="subject">반복주기</div>
                <div class="form-item">
                    <v-select
                        v-model="select1"
                        class="w14"
                        :items="assignmentPeriod"
                        item-title="state"
                        label="Select"
                        variant="outlined"
                        rounded
                        return-object
                        single-line
                        hide-details
                        style="width: 22rem"
                    ></v-select>
                    <div class="btn-week">
                        <v-btn-toggle v-model="selectedDayIndex" background-color="primary" dark multiple mandatory>
                            <v-btn v-for="(dayButton, index) in day" :key="index" flat>
                                {{ dayButton }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
            </div>
            <div class="line">
                <div class="subject">과제 내용</div>
                <div class="form-item">
                    <v-select
                        v-model="select2"
                        class="w14"
                        :items="assignmentSubject"
                        item-title="state"
                        label="Select"
                        variant="outlined"
                        rounded
                        return-object
                        single-line
                        hide-details
                        style="width: 22rem"
                    ></v-select>
                </div>
            </div>
            <div class="btn_save">
                <v-btn rounded flat size="small" color="#666" @click="setState">저장</v-btn>
            </div>
        </div>
        <template v-if="!isEdit">
            <div v-if="!dateFilter" class="photo_homework_schedule">
                <div class="schedule">
                    <p>선택한 날짜에 과제가 없습니다.</p>
                    <v-btn v-show="!datePickers" rounded flat class="btn" @click="dateFilter = true">+</v-btn>
                </div>
            </div>
            <div class="photo_rule">
                <div class="card_type">
                    <div class="tab_head tab_head_wide">
                        <v-tabs v-model="guideTab">
                            <v-tab value="one"> {{ t('administer.picture.order.title') }} </v-tab>
                        </v-tabs>
                    </div>
                    <div class="tab_body">
                        <v-window v-model="guideTab">
                            <v-window-item value="one" :transition="false" :reverse-transition="false">
                                <ol class="homework_rule">
                                    <li v-for="(order, index) in assignmentSavingOrder" :key="order">
                                        <span>{{ index + 1 }}</span
                                        >{{ order }}
                                    </li>
                                </ol>
                            </v-window-item>
                        </v-window>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="isEdit">
            <div v-if="!dateFilter" class="photo_homework_schedule">
                <div class="schedule">
                    <p class="bar"><span>2023. 11. 14. ~ 2023. 12.14</span><span>매주 월, 화, 수요일에 수학 익힘책 촬영하기</span></p>
                    <v-btn rounded flat size="small" color="#666" @click="dateFilter = true">편집</v-btn>
                </div>
            </div>
            <div class="section_mission">
                <div class="mission submission">
                    <p class="sub_tit">
                        <span class="txt_st">제출한 학생</span>
                        <span class="txt_num">{{ assignmentItem.doneCnt || 0 }}명</span>
                    </p>

                    <div v-if="assignmentItem.doneList?.length === 0 || assignmentItem.length === 0" class="empty">
                        <i class="icon-book"></i>
                        <span>아직 과제를 제출한 학생이 없습니다.</span>
                    </div>
                    <div v-else class="list">
                        <ul>
                            <li v-for="student in assignmentItem.doneList" :key="student.num">
                                <div class="box_img">
                                    <div v-if="student.isCnfStamp !== '1'">
                                        <v-checkbox
                                            v-model="selectedStudent"
                                            :value="student.studentId"
                                            hide-details
                                            class="large primary"
                                        ></v-checkbox>
                                    </div>
                                    <div @click="openModal({ type: 'problemThumbnail', wrapClass: 'pho_list_wrap' })">
                                        <img :src="student.problemThumbnailUrl" alt="" />
                                    </div>
                                </div>

                                <div class="name">
                                    <span class="txt_num">{{ findStudentNum(student.studentId) }} 번</span>
                                    <span class="txt_name">{{ findStudent(student.studentId) }}</span>
                                </div>
                                <Modal v-if="type === 'problemThumbnail'">
                                    <div class="tit_area">
                                        <div class="study_thumb_list">
                                            <em>{{ student.submittedDate }}</em>
                                            <div class="st_info_area">
                                                <span class="txt_num">{{ findStudentNum(student.studentId) }}번</span>
                                                <span class="txt_name">{{ findStudent(student.studentId) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ViewerImage v-model="carouselIndex" :items="assignmentItem.doneList" height="600" />
                                    <template #bottom>
                                        <div class="page_wrap center">
                                            <span class="txt_wrap"
                                                ><em>{{ carouselIndex + 1 }}</em
                                                >/<span>{{ assignmentItem.doneCnt }}</span></span
                                            >
                                        </div>
                                    </template>
                                </Modal>
                            </li>
                        </ul>
                    </div>
                    <div v-show="selectedStudent.length !== 0" class="box_stamp">
                        <v-btn size="large" rounded class="primary" @click="stampBtn">
                            <span class="text-orange">총 {{ selectedStudent.length }}명</span>&nbsp;확인 도장 찍기
                        </v-btn>
                    </div>
                </div>
                <div class="mission unsubmission">
                    <p class="sub_tit">
                        <span class="txt_st">미제출 학생</span>
                        <span class="txt_num">{{ assignmentItem.ndoneCnt || classStudent.length }}명</span>
                    </p>
                    <div v-if="assignmentItem.ndoneList?.length === 0" class="empty">
                        <i class="icon-book"></i>
                        <span>모두 과제를 제출하였습니다.</span>
                    </div>
                    <div v-else class="list">
                        <ul>
                            <li v-for="student in assignmentItem.ndoneList" :key="student.num">
                                <div class="name">
                                    <span class="txt_num">{{ findStudentNum(student.studentId) }} 번</span>
                                    <span class="txt_name">{{ findStudent(student.studentId) }}</span>
                                </div>
                                <span class="check">
                                    <v-checkbox
                                        v-model="selectedUnStudent"
                                        :value="student.studentId"
                                        label=""
                                        class="large primary"
                                    ></v-checkbox>
                                </span>
                            </li>
                        </ul>
                        <div class="fixed_btn_wrap box_go">
                            <v-btn
                                size="large"
                                rounded
                                :disabled="selectedUnStudent.length === 0"
                                class="primary slim"
                                @click="
                                    openModal({
                                        type: 'assignmentDetails',
                                        closeBtnClass: false,
                                        buttonLabels: ['아니오', '예']
                                    })
                                "
                                >독려 메시지 보내기</v-btn
                            >
                        </div>
                        <Modal v-if="type === 'assignmentDetails'" @handle-action-one="sendEncouragement">
                            <p>사진 과제 독려 메시지를 보낼까요?</p>
                        </Modal>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
const { t } = useI18n();
const today = ref(new Date());
const selectedDate = ref(new Date());
const { openModal, type, closeModal } = useModal();
const defaultSelectedIndex = 0; // Set the default selected index here
const selectedDayIndex = ref([defaultSelectedIndex]);
const datePickers = ref(false);
const select1 = ref(t('administer.picture.period.everyWk'));
const select2 = ref(t('administer.picture.subject.wrongAnswerBook'));
const apiClassStore = useApiClassStore();
const { classStudent } = storeToRefs(apiClassStore);
const selectedStudent = ref([]);
const selectedUnStudent = ref([]);
const carouselIndex = ref(0);
const guideTab = ref(null);
const dateFilter = ref(false);
const isEdit = ref(false);
const apiAdministerStore = useApiAdministerStore();
const { item: assignmentItem, dataSize } = storeToRefs(apiAdministerStore);

// 사진 과제 저장 순서
const assignmentSavingOrder = ref([
    t('administer.picture.order.contents[0]'),
    t('administer.picture.order.contents[1]'),
    t('administer.picture.order.contents[2]'),
    t('administer.picture.order.contents[3]'),
    t('administer.picture.order.contents[4]')
]);

// selectBox
const assignmentPeriod = ref([
    t('administer.picture.period.everyWk'),
    t('administer.picture.period.everySndWk'),
    t('administer.picture.period.everyTrdWk'),
    t('administer.picture.period.everyFthWk')
]);

const day = ref([
    t('administer.picture.day.mon'),
    t('administer.picture.day.tue'),
    t('administer.picture.day.wed'),
    t('administer.picture.day.thu'),
    t('administer.picture.day.fri'),
    t('administer.picture.day.sat'),
    t('administer.picture.day.sun')
]);
const assignmentSubject = ref([
    t('administer.picture.subject.wrongAnswerBook'),
    t('administer.picture.subject.textbook'),
    t('administer.picture.subject.workbook'),
    t('administer.picture.subject.notebook'),
    t('administer.picture.subject.directInput')
]);

onMounted(() => {
    initPicture();
});

const initPicture = async () => {
    //개발용 하드코딩
    await apiAdministerStore.getItem({
        courseLessonId: 'ba294ecc-0e2b-4fa9-8baa-ecdef82cff92',
        problemDueDate: formatDate(selectedDate.value) === '20240229' ? '20240206' : formatDate(selectedDate.value),
        problemsetId: '9d82f8e2-c9e1-4b6e-b902-ebac4190248c'
    });
    if (dataSize.value > 0) isEdit.value = true;
    else isEdit.value = false;
};

const setDate = date => {
    if (formatDate(today.value) <= formatDate(date.date)) {
        selectedDate.value = date.date;
        initPicture();
        dateFilter.value = false;
    }
};

const formatDate = formattedDate => {
    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = formattedDate.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
};

const findStudent = studentId => {
    const foundStudent = classStudent.value.find(student => student.studentId === studentId);
    return foundStudent.name;
};
const findStudentNum = studentId => {
    const foundStudent = classStudent.value.find(student => student.studentId === studentId);
    return foundStudent.number;
};

const sendEncouragement = () => {
    console.log('독려 메시지 보내기', selectedUnStudent);
    selectedUnStudent.value = [];
    closeModal();
};

const stampBtn = () => {
    console.log('@@@@ß', selectedStudent);
};

const setState = () => {
    dateFilter.value = false;
    if (dataSize.value === 0) isEdit.value = true;
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/variables.scss';

.photo_rule {
    margin: 60px auto;
    .tab_head {
        &::after {
            height: 0;
        }
    }
    .tab_body {
        border-top-left-radius: 0;
        margin-top: -0.1rem;
    }
    .homework_rule {
        width: 92.5rem;
        padding: 5rem 7rem;
        border-radius: 0 1.2rem 1.2rem 1.2rem;
        border: 1px solid #000;
        background: #fff;
        li {
            position: relative;
            margin-left: 7rem;
            min-height: 5rem;
            display: flex;
            align-items: center;
            span {
                position: absolute;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 5rem;
                height: 5rem;
                top: 0rem;
                left: -7rem;
                border-radius: 5rem;
                background: $primary;
                color: $white;
            }
            & + li {
                margin-top: 3rem;
            }
        }
    }
}
</style>
