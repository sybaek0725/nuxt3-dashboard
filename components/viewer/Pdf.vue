<template>
    <div class="papers_box_wrap">
        <div class="pdf_view">
            <div class="top_btn_wrap">
                <div>
                    <v-btn
                        v-if="layerData.id !== 'contents.forward' && layerData.id !== 'progress.textbook'"
                        flat
                        rounded
                        size="small"
                        class="outlined_bk"
                        @click="
                            addKeyValue(layerData.id, {
                                isShowDocumentDetail: 'off'
                            })
                        "
                        ><i class="ico ico_size_6 back_30" />이전</v-btn
                    >
                </div>
                <div v-if="entry !== 'textbook'" class="center">
                    <v-btn flat rounded size="small" class="black" @click="pdfZoom('in')">
                        <i class="ico plus_24 ico_color_white ico_size_6" />크게보기
                    </v-btn>
                    <v-btn flat rounded size="small" class="black" @click="pdfZoom('out')">
                        <i class="ico minus_24 ico_color_white ico_size_6" />작게보기
                    </v-btn>
                </div>
                <PageIndicator class-type="right" :current-page="page" :page-count="pageCount" :volume="2" @page="pdfPaging" />
            </div>

            <div class="pdfViewer">
                <div class="page" :style="`--scale-factor: ${scale}`">
                    <div class="canvasWrapper">
                        <canvas ref="canvasRef"></canvas>
                    </div>
                    <div ref="textLayerRef" class="text-layer"></div>
                    <div ref="textLayerRef2" class="text-layer"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
useHead({
    script: [
        {
            src: '/js/pdf.mjs',
            async: true,
            defer: true,
            type: 'module',
            onload: () => {
                const { pdfjsLib } = globalThis;
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.mjs';
                //     console.log('loaded');
            }
        }
    ]
});

onMounted(() => {
    setTimeout(() => {
        showPDF(props.servicePath);
    }, 100);
});

const { layerData, addKeyValue } = useLayerStore();

const props = defineProps({
    servicePath: {
        type: String,
        required: true
    },
    entry: {
        type: String,
        required: false,
        default: ''
    }
});

const page = ref(1);
const pageCount = ref(1);
const scale = ref(0.6);
let pdfDoc = null;
const isLoading = ref(false);
const canvasRef = ref(null);
const textLayerRef = ref(null);
const textLayerRef2 = ref(null);

const showPDF = url => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(pdf_doc => {
        if (pdfDoc) {
            pdfDoc.destroy();
        }
        pdfDoc = pdf_doc;
        pageCount.value = pdfDoc.numPages;

        showPage(1);
    });
};

const showPage = pageNumber => {
    isLoading.value = true;
    page.value = pageNumber;
    const context = canvasRef.value.getContext('2d', { willReadFrequently: true });

    pdfDoc.getPage(pageNumber).then(leftPage => {
        const leftViewport = leftPage.getViewport({ scale: scale.value });
        canvasRef.value.height = leftViewport.height;
        canvasRef.value.width = leftViewport.width * 2;

        const leftRenderTask = leftPage.render({
            canvasContext: context,
            viewport: leftViewport
        });

        if (pageNumber + 1 > pageCount.value) {
            leftRenderTask.promise
                .then(() => {
                    return leftPage.getTextContent();
                })
                .then(textContent => {
                    // Clear HTML for text layer
                    textLayerRef.value.innerHTML = '';

                    // Assign the CSS created to the text-layer element
                    textLayerRef.value.style.left = leftViewport.offsetLeft + 'px';
                    textLayerRef.value.style.top = leftViewport.offsetTop + 'px';
                    textLayerRef.value.style.height = leftViewport.height + 'px';
                    textLayerRef.value.style.width = leftViewport.width * 2 + 'px';

                    // Clear HTML for text layer
                    textLayerRef2.value.innerHTML = '';

                    // Assign the CSS created to the text-layer element
                    textLayerRef2.value.style.display = 'none';
                    pdfjsLib.renderTextLayer({
                        container: textLayerRef.value,
                        textContentSource: textContent,
                        viewport: leftViewport
                    });
                });
            isLoading.value = false;
            return;
        }
        pdfDoc.getPage(pageNumber + 1).then(rightPage => {
            const rightViewport = rightPage.getViewport({ scale: scale.value });

            leftRenderTask.promise
                .then(() => {
                    return leftPage.getTextContent();
                })
                .then(textContent => {
                    // Clear HTML for text layer
                    textLayerRef.value.innerHTML = '';

                    // Assign the CSS created to the text-layer element
                    textLayerRef.value.style.left = leftViewport.offsetLeft + 'px';
                    textLayerRef.value.style.top = leftViewport.offsetTop + 'px';
                    textLayerRef.value.style.height = leftViewport.height + 'px';
                    textLayerRef.value.style.width = leftViewport.width * 2 + 'px';

                    pdfjsLib.renderTextLayer({
                        container: textLayerRef.value,
                        textContentSource: textContent,
                        viewport: leftViewport
                    });
                })
                .then(() => {
                    context.translate(leftViewport.width, 0);

                    const rightRenderTask = rightPage.render({
                        canvasContext: context,
                        viewport: rightViewport
                    });

                    rightRenderTask.promise
                        .then(() => {
                            return rightPage.getTextContent();
                        })
                        .then(textContent => {
                            // Clear HTML for text layer
                            textLayerRef2.value.innerHTML = '';

                            // Assign the CSS created to the text-layer element
                            textLayerRef2.value.style.translate = rightViewport.width + 'px';
                            textLayerRef2.value.style.left = rightViewport.offsetLeft + 'px';
                            textLayerRef2.value.style.top = rightViewport.offsetTop + 'px';
                            textLayerRef2.value.style.height = rightViewport.height + 'px';
                            textLayerRef2.value.style.width = rightViewport.width * 2 + 'px';

                            pdfjsLib.renderTextLayer({
                                container: textLayerRef2.value,
                                textContentSource: textContent,
                                viewport: rightViewport
                            });

                            isLoading.value = false;
                        });
                });
        });
    });
};

const pdfPaging = num => {
    if (isLoading.value) return;
    if (num > pageCount.value) return;
    showPage(num);
};

const pdfZoom = type => {
    if (isLoading.value) return;

    if ('in' === type) {
        if (scale.value > 2.0) {
            return false;
        }
        scale.value += 0.1;
        showPage(page.value);
    } else {
        if (scale.value < 0.5) {
            return false;
        }
        scale.value -= 0.1;
        showPage(page.value);
    }
};
</script>
<style lang="scss">
.pdfViewer {
    overflow: auto;
    letter-spacing: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    .page {
        position: relative;
        overflow: visible;

        .canvasWrapper {
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .text-layer {
            position: absolute;
            text-align: initial;
            inset: 0;
            overflow: hidden;
            opacity: 1;
            line-height: 1;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            text-size-adjust: none;
            forced-color-adjust: none;
            transform-origin: 0 0;

            :is(span) {
                color: transparent;
                position: absolute;
                white-space: pre;
                cursor: text;
                transform-origin: 0% 0%;
            }
            :is(br) {
                display: none;
            }
            ::selection {
                background: rgba(22, 155, 212, 0.5);
            }
        }
    }
}
</style>
