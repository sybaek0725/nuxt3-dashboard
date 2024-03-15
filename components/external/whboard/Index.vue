<!--
@파일(Method): Whboard.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:09
@설명: 화이트보드 콘텐츠 영역
@수정: 화면 캡쳐 기능 useScreenCapture 사용(학생쪽 추가-24.02.21)
-->
<template>
    <div class="class_board class_board_box">
        <div class="tab_body">
            <div class="board_con_item3">
                <div>
                    <div class="sub_tit_wrap mga0">
                        <i class="ico book_open_30 ico_size_lg"></i>
                        배경 템플릿을 추가하거나, 오른쪽 작성도구를 활용하여 자유로운 {{ title }} 자료를 만들 수 있습니다.
                    </div>

                    <div class="edit_board_wrap mgt30">
                        <!-- 썸네일 리스트 -->
                        <div class="select_template">
                            <div class="com_btn_wrap mga0">
                                <v-btn class="black" size="small" rounded @click="() => fileBtn.click()">배경 템플릿 추가하기</v-btn>
                                <input
                                    ref="fileBtn"
                                    style="display: none"
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    @change="changeFile"
                                />
                            </div>
                            <div class="thumb_list">
                                <ul>
                                    <li
                                        v-for="backgroundImg in templateList"
                                        :key="backgroundImg.idx"
                                        @click="setBackground(backgroundImg.templateUrl)"
                                    >
                                        <button class="img_wrap">
                                            <img
                                                v-if="backgroundImg.templateUrl"
                                                :src="backgroundImg.templateUrl"
                                                :alt="backgroundImg.title"
                                            />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- 그리기 영역 -->
                        <div class="thum_box">
                            <div class="img_wrap">
                                <div ref="canvas_area" class="w-100 h-100">
                                    <canvas ref="canvas"></canvas>
                                </div>
                            </div>
                        </div>

                        <!-- 그리기 툴 -->
                        <div class="tool_box">
                            <p class="txt_tit">표현도구</p>
                            <div class="btn_area">
                                <v-btn size="xsmall" flat @click="setText">
                                    <div>
                                        <i class="ico ico_size_lg tool_text_30" />
                                        <span>텍스트</span>
                                    </div>
                                </v-btn>
                                <v-btn size="xsmall" flat @click="undo($event)">
                                    <div>
                                        <i class="ico ico_size_lg tool_undo_30" />
                                        <span>실행 취소</span>
                                    </div>
                                </v-btn>
                                <v-btn size="xsmall" flat @click="redo($event)">
                                    <div>
                                        <i class="ico ico_size_lg tool_redo_30" />
                                        <span>다시 실행</span>
                                    </div>
                                </v-btn>
                                <!-- color layer -->
                                <div class="item color_weight_wrap">
                                    <v-btn size="xsmall" flat @click="openColorView($event)">
                                        <div>
                                            <i class="ico ico_size_lg tool_color_30" />
                                            <span>색상</span>
                                        </div>
                                    </v-btn>
                                    <div v-if="isShowColor" class="color_weight">
                                        <v-btn
                                            v-for="(color, idx) in colors"
                                            :key="color.name"
                                            flat
                                            :class="[color.name, idx === colorIndex && 'check']"
                                            class="color"
                                            @click="setLineColor(color.name)"
                                        ></v-btn>
                                    </div>
                                </div>
                                <!-- pen layer -->
                                <v-btn size="xsmall" flat @click="openLineView($event)">
                                    <div>
                                        <i class="ico ico_size_lg tool_stroke_30" />
                                        <span>펜굵기</span>
                                    </div>
                                </v-btn>
                                <div v-if="isShowLine" class="pen_weight">
                                    <i class="circle small" />
                                    <div class="slider_wrap">
                                        <v-slider
                                            v-model="lineWidth"
                                            step="5"
                                            min="0"
                                            max="50"
                                            hide-details
                                            class="custom_point"
                                            color="#3CCCFB"
                                            @end="setLineWidth($event)"
                                        ></v-slider>
                                    </div>
                                    <i class="circle big" />
                                </div>
                                <v-btn size="xsmall" flat @click="setEraser($event)">
                                    <div>
                                        <i class="ico ico_size_lg tool_eraser_30" />
                                        <span>지우개</span>
                                    </div>
                                </v-btn>
                                <v-btn size="xsmall" flat class="last_btn" @click="allClear">
                                    <div>
                                        <i class="ico ico_size_lg tool_delete_30" />
                                        <span>전체 삭제</span>
                                    </div>
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="layerData.id === 'whboard' && user.mode == 'teacher'" class="d-flex center mgt20 gap1">
        <v-btn
            rounded
            size="large"
            class="black"
            @click="openModal({ type: 'classDataTitle', closeBtnClass: false, buttonLabels: ['취소', '저장'], title: '수업 자료 제목' })"
            >내 수업 자료 저장</v-btn
        >
        <v-btn rounded size="large" class="black" @click="submitToStudent">학생에게 바로 전송</v-btn>
    </div>

    <div v-if="layerData.id === 'whboard' && user.mode == 'student'" class="bottom_btn_wrap">
        <v-btn rounded size="large" class="primary" @click="confirmToTeacher">선생님에게 제출하기</v-btn>
    </div>

    <!-- 수업 자료 제목 -->
    <Modal v-if="type === 'classDataTitle'" @modal-closed="closeModal" @handle-action-one="saveToMine">
        <span>수업 자료 저장을 위해 제목을 입력해 주세요. </span>
        <v-text-field
            v-model="dataTitle"
            autocomplete="off"
            variant="outlined"
            label="자료 제목을 입력해 주세요."
            single-line
        ></v-text-field>
    </Modal>

    <!-- 궛속말 -->
    <Modal v-if="type === 'whboardPresentation'" @modal-closed="submitToTeacher('no')" @handle-action-one="submitToTeacher('yes')">
        <span>선생님께 발표하고 싶다고 궛속말을 남길까요?</span>
    </Modal>
</template>

<script setup>
const { layerData, addKeyValue } = useLayerStore();
const { openModal, closeModal, type } = useModal();
const { save, submit } = useExternal();
const apiWhboardStore = useApiWhboardStore();
const { items: templateList } = storeToRefs(apiWhboardStore);
const { captureStream } = useScreenCapture();
//사용자
const { user } = storeToRefs(useApiUserStore());
const {
    sdb,
    isFirstConnected,
    lineWidth,
    isShowColor,
    isShowLine,
    colorIndex,
    colors,
    isRedoing,
    objects,
    canvas,
    canvas_area,
    initDraw,
    undo,
    redo,
    setLineColor,
    setLineWidth,
    openColorView,
    openLineView,
    setText,
    allClear,
    onPaste,
    setEraser,
    setBackground
} = useWhboard();
const dataTitle = ref('');
let fileBtn = ref(null);

onMounted(async () => {
    isFirstConnected.value = true;
    await nextTick();

    window.addEventListener('paste', onPaste);

    initDraw();

    if (sdb) {
        sdb.on('object:added', function () {
            if (!isRedoing.value) {
                objects.value = [];
            }
            isRedoing.value = false;
        });
    }

    if (layerData?.whboardData?.servicePath) {
        setBackground(layerData.whboardData.servicePath);
    }

    if (layerData.id === 'whboard') {
        addKeyValue(layerData.id, {
            externalTab: 'whboard'
        });
    }
    apiWhboardStore.getItems();
});

onUnmounted(async () => {
    window.removeEventListener('paste', onPaste);
});

const changeFile = e => {
    let file = e.target.files[0];

    const fileReader = new FileReader();

    fileReader.addEventListener(
        'load',
        function () {
            let backgroundData = {
                templateUrl: fileReader.result
            };
            templateList.value.splice(1, 0, backgroundData);
        },
        false
    );

    fileReader.readAsDataURL(file);
};

// 내 수업 자료 저장
const saveToMine = () => {
    addKeyValue(layerData.id, {
        whboardData: {
            title: dataTitle.value
        }
    });
    save('new');
    closeModal();
};

//전송(교사용)
const submitToStudent = async () => {
    const capturedImage = await captureStream('canvas', true);
    submit('whboard', { servicePath: capturedImage });
};

//전송(학생용)
const confirmToTeacher = () => {
    openModal({ type: 'whboardPresentation', buttonLabels: ['아니오(조용히 제출)', '예(발표하고 싶어요)'], closeBtnClass: false });
};
const submitToTeacher = async value => {
    const capturedImage = await captureStream('canvas', true);
    const data = {
        ...user.value,
        servicePath: capturedImage
    };

    //발표
    if (value == 'yes') {
        data.presentation = true;
    }

    //교사에게 전달
    useWebRtcStore().setSendMessage('student', 'teacher', 'ExternalAction', {
        type: 'whboard',
        data: data
    });

    closeModal();
};
const title = computed(() => (layerData.id === 'workbook.groupActivity' ? '모둠 활동' : '교육'));
</script>
