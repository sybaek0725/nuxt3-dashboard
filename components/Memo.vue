<!--
@파일(Method): Memo.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:08
@설명: 화면 메모 기능
-->
<template>
    <div class="white_board_wrap">
        <!-- 그리기 영역 -->
        <div class="thum_box h-100" :style="`background-color: rgba(255,255,255,${opacity})`">
            <div class="img_wrap">
                <div ref="canvas_area" class="board">
                    <canvas ref="canvas" class=""></canvas>
                </div>
            </div>
        </div>

        <!-- 그리기 툴 -->
        <div class="tool_box print-none" data-html2canvas-ignore="true">
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
                <div class="item">
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
                        <div>
                            <i class="ico ico_size_lg tool_stroke_30" />
                            <span>펜굵기</span>
                        </div>
                    </div>
                </v-btn>
                <div v-if="isShowLine" class="pen_weight top-0">
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
                <div class="opacity_control last_btn">
                    <v-slider v-model="opacity" class="custom_point" step="0.1" min="0" max="1.0" hide-details></v-slider>
                    <span>불투명도</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { closeWhboard } = useWhboard();
const { captureStream } = useScreenCapture();
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
    setEraser
} = useWhboard();

const opacity = ref(0.5);

onMounted(async () => {
    isFirstConnected.value = true;
    await nextTick();

    window.addEventListener('paste', onPaste);

    /* NOTE: canvas_area offsetHeight 설정 후 캔버스 영역 잡기 위해 타이밍 처리 필요 */
    setTimeout(() => {
        initDraw();
    }, 100);
});

onUnmounted(async () => {
    window.removeEventListener('paste', onPaste);
});

// 화면 메모 저장
const { submit } = useExternal();
const saveMemo = async () => {
    const capturedImage = await captureStream('#memo_area');
    submit('contents', {
        servicePath: capturedImage,
        title: 'test',
        type: 'image'
    });
    closeWhboard();
};
</script>

<style scoped lang="scss">
.white_board_wrap {
    position: absolute;
    padding: 2rem 3rem 3rem 3rem !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;

    .img_wrap {
        display: block;
        .board {
            width: 100%;
            height: 100%;
        }
    }

    .tool_box {
        background-color: #fff;
        z-index: 10;
    }
}

@media print {
    .print-none {
        display: none !important;
    }

    .board {
        width: 100% !important;
        height: 100% !important;
        position: relative !important;
        canvas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: calc(100vw - 6rem) !important;
            height: 100% !important;
        }
    }
}
</style>
