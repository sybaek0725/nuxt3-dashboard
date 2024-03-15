<!--
@파일(Method): Document.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:02
@설명: 콘텐츠 연동 - 이미지 올리기 콘텐츠 영역
@수정: 이미지 주소 정규식, toast 추가
-->
<template>
    <!-- 이미지 업로드 -->
    <div v-if="layerData.isShowImageDetail === 'off'" class="img_upload_wrap">
        <div class="upload_area">
            <button flat class="info w-100 h-100" @click="fileBtn.click" @dragenter="drag" @dragleave="drag" @dragover="drag" @drop="drop">
                <div class="ico ico_size_20 upload_80"></div>
                <p>이곳을 클릭하거나, 파일을 드롭하세요.<br /><em>(파일 1개, 업로드 용량 제한 4MB)</em></p>
                <input ref="fileBtn" type="file" :style="{ display: 'none' }" accept="image/jpeg, image/png" @change="changeFile" />
            </button>
        </div>

        <div class="copy_area">
            <div class="info">
                <div class="ico calander_80 ico_size_20"></div>
                <p>이미지 주소를 복사한 뒤, 이곳에 붙여넣기 하세요.</p>
            </div>
            <div class="form_group">
                <div class="text_field_box">
                    <v-text-field
                        v-model="url"
                        clearable
                        variant="outlined"
                        auto-select-first
                        required
                        class="big hover"
                        density="comfortable"
                        item-props
                        outlined
                        placeholder="http://www.주소입력.com"
                        hide-details
                    ></v-text-field>
                </div>
                <v-btn flat rounded size="small" class="black" @click="handleURL">확인</v-btn>
            </div>
        </div>
    </div>

    <!-- 이미지 업로드 결과 -->
    <div v-else class="search_result">
        <div class="top_btn_wrap">
            <v-btn flat rounded class="outlined_bk" size="small" @click="addKeyValue(layerData.id, { isShowImageDetail: 'off' })">
                <i class="ico ico_size_6 back_30" />

                이전</v-btn
            >

            <div class="center">
                <v-btn
                    flat
                    rounded
                    size="small"
                    class="primary"
                    @click="
                        setAddLayer('whboard', {
                            whboardData: {
                                servicePath: layerData.imageData.servicePath
                            }
                        })
                    "
                    >화이트 보드</v-btn
                >
            </div>
        </div>
        <div class="img_wrap resize_md">
            <v-img id="upload_img" :src="layerData.imageData.servicePath" :alt="layerData.imageData.title" @error="imgLoadError" />
        </div>
        <!--
        <Modal v-if="type === 'fileSize'" @modal-closed="classStateSwitchOff = false">
            <p>등록 가능한 파일 용량을 초과하였습니다.</p>
        </Modal>
        <Modal v-if="type === 'fileType'" @modal-closed="classStateSwitchOff = false">
            <p>등록 가능한 파일 용량을 초과하였습니다.</p>
        </Modal>
        <Modal v-if="type === 'fileSuccess'" @modal-closed="classStateSwitchOff = false">
            <p>등록 가능한 파일 용량을 초과하였습니다.</p>
        </Modal> -->
    </div>
</template>

<script setup>
const { setAddLayer, layerData, addKeyValue } = useLayerStore();
const { changeFile, drag, drop, preview, imgLoadError } = useUpload('image', 4);
const { openAlert } = useAlert();

const fileBtn = ref(null);
const url = ref('');

// URL 정규식 검사
const isValidURL = url => {
    let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
};

// 이미지 주소 검색
const handleURL = async () => {
    if (!isValidURL(url.value)) {
        openAlert({ message: '이미지 주소 형식을 입력해주세요.' });
    } else {
        preview({ servicePath: url.value });
    }
};
</script>
