<!--
@파일(Method): Document.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:02
@설명: 콘텐츠 연동 - 문서올리기 콘텐츠 영역
@수정: 2024-01-17 pptx 및 docx 추가
-->
<template>
    <div v-if="layerData.isShowDocumentDetail === 'off'" class="p-4">
        <button flat class="document_upload w-100" @click="fileBtn.click" @dragenter="drag" @dragleave="drag" @dragover="drag" @drop="drop">
            <i class="ico upload_80 ico_size_20"></i>
            <span>
                이곳을 클릭하거나, 파일을 드롭하세요.<br />
                <em>(파일 1개, 업로드 용량 제한 5MB)</em>
            </span>
        </button>
        <input
            ref="fileBtn"
            type="file"
            :style="{ display: 'none' }"
            accept="application/pdf, .xls, .xlsx, .hwp, .pptx, .docx"
            @change="changeFile"
        />
    </div>

    <!-- 문서올리기 -->
    <div v-else class="search_result">
        <div v-if="layerData.documentData.type === 'pdf'">
            <div class="today_study viewer viewer_with_btn preview">
                <ViewerPdf :service-path="layerData.documentData.servicePath" />
            </div>
        </div>

        <div v-else>
            <div class="top_btn_wrap">
                <v-btn flat rounded class="outlined_bk" size="small" @click="addKeyValue(layerData.id, { isShowDocumentDetail: 'off' })">
                    <i class="ico ico_size_6 back_30" />

                    이전</v-btn
                >
            </div>

            <ViewerFileCard
                :file-name="layerData.documentData.title"
                :file-type="layerData.documentData.type"
                :file-url="layerData.documentData.servicePath"
            />
        </div>
    </div>
</template>
<script setup>
const { layerData, addKeyValue } = useLayerStore();
const { changeFile, drag, drop } = useUpload('document', 5);

const fileBtn = ref(null);
</script>
<style lang="scss" scoped>
@import '@/assets/scss/foundations/variables.scss';
@import '@/assets/scss/foundations/mixin.scss';
@import '@/assets/scss/foundations/color.scss';

.document_upload {
    display: flex;
    padding: 3rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    border-radius: 1.2rem;
    border: 2px dashed $G400;
    background: $white;
    height: 34rem;
    @include font_body3;
    text-align: center;

    em {
        color: $font-light;
    }
}
</style>
