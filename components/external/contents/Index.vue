<!--
@파일(Method): index.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:04
@설명: 콘텐츠 연동 콘텐츠 영역
@수정: 코드 리팩토링 및 주석 추가
       addKeyValue 초기설정 조건 변경(LEE 24.02.14)
-->
<template>
    <div class="class_board class_board_box">
        <div class="tab_body">
            <div class="board_con_item2">
                <div class="sub_tit_wrap"><i class="ico book_open_30 ico_size_lg"></i>{{ subtitle }}</div>
                <div class="card_type">
                    <div class="tab_head">
                        <v-tabs v-model="layerData.contentsTab">
                            <v-tab value="search">자료 통합 검색</v-tab>
                            <v-tab value="image">이미지 올리기</v-tab>
                            <v-tab value="document">문서올리기</v-tab>
                        </v-tabs>
                    </div>
                    <div class="tab_sub_body">
                        <v-window v-model="layerData.contentsTab">
                            <v-window-item value="search" :transition="false" :reverse-transition="false">
                                <ExternalContentsSearch />
                            </v-window-item>
                            <v-window-item value="image" :transition="false" :reverse-transition="false">
                                <ExternalContentsUploadImage />
                            </v-window-item>
                            <v-window-item value="document" :transition="false" :reverse-transition="false">
                                <ExternalContentsUploadDocument />
                            </v-window-item>
                        </v-window>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showButton" class="d-flex center mgt20 gap1">
        <v-btn rounded size="large" class="black" @click="save('new')">내 수업 자료 저장</v-btn>
        <v-btn rounded size="large" class="black" @click="submit('contents', layerData[`${layerData.contentsTab}Data`])"
            >학생에게 바로 전송</v-btn
        >
    </div>
</template>

<script setup>
const { layerData, addKeyValue } = useLayerStore();
const { save, submit } = useExternal('contents');

onBeforeMount(() => {
    if (layerData.id === 'contents' && !layerData.externalTab) {
        addKeyValue(layerData.id, {
            externalTab: 'contents',
            isShowSearchDetail: layerData.isShowSearchDetail || 'off',
            isShowImageDetail: layerData.isShowImageDetail || 'off',
            isShowDocumentDetail: layerData.isShowDocumentDetail || 'off'
        });
    }
});

// 화면 별 부제 분기 처리
const subtitle = computed(() => {
    if (layerData.id === 'contents') {
        return '학생들에게 전송할 교육 자료를 검색하여 전송합니다.';
    } else if (layerData.id === 'workbook.groupActivity') {
        return '모둠 활동에 사용할 자료를 검색하고 등록합니다.';
    } else {
        return '학생들에게 전송할 교육 자료를 검색하여 등록합니다.';
    }
});

// 저장 및 전송 버튼 노출 분기처리
const showButton = computed(() => {
    if (layerData.id !== 'contents') return false;
    else if (layerData.contentsTab === 'search' && layerData.isShowSearchDetail === 'on') return true;
    else if (layerData.contentsTab === 'image' && layerData.isShowImageDetail === 'on') return true;
    else if (layerData.contentsTab === 'document' && layerData.isShowDocumentDetail === 'on') return true;
    else return false;
});
</script>
