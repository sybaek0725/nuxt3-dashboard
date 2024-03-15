<!--
@파일(Method): Tab.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:08
@설명: 외부자료연동(수업자료실,콘텐츠편집)
@수정: 외부연동 레이어ID 변경(progress.configureSession.external -> progress.contents.edit.external)(LEE-24.02.01) 
-->
<template>
    <v-col>
        <div class="box_type tab_btn">
            <div class="tab_head mb-2">
                <v-tabs v-model="layerData.externalTab" mandatory>
                    <v-tab value="nuri"><i class="ico language_24" />누리집 연동</v-tab>
                    <v-tab value="contents"><i class="ico link2_30" />콘텐츠 연동</v-tab>
                    <v-tab value="whboard"><i class="ico write2_30" />화이트 보드</v-tab>
                </v-tabs>
            </div>
        </div>
        <div class="class_board_box">
            <div class="tab_body">
                <v-window v-model="layerData.externalTab">
                    <v-window-item value="nuri" :transition="false" :reverse-transition="false">
                        <ExternalNuri />
                    </v-window-item>
                    <v-window-item value="contents" :transition="false" :reverse-transition="false">
                        <ExternalContents />
                    </v-window-item>
                    <v-window-item value="whboard" :transition="false" :reverse-transition="false">
                        <ExternalWhboard />
                    </v-window-item>
                </v-window>
            </div>
        </div>
    </v-col>
</template>

<script setup>
onMounted(() => {
    initFunc();
});

const layerStore = useLayerStore();
const { layerData } = useLayerStore();
const apiExternalStore = useApiExternalStore();
const { item } = storeToRefs(apiExternalStore);
const { save } = useExternal();
const { openAlert } = useAlert();

// 진입 함수
const initFunc = async () => {
    if (layerData.entry === 'create') {
        item.value = {
            materialName: '',
            curriculumSubjectId: layerData.period?.curriculumSubjectId || '',
            curriculumChapterId: layerData.period?.curriculumChapterId || '',
            curriculumPeriodId: layerData.period?.curriculumPeriodId || '',
            materialTypeCode: '',
            materialStoreUrl: '',
            kofContent: ''
        };
    }
};

const externalUpdate = async () => {
    if (item.value.materialName.trim() === '') {
        openAlert({ message: '자료 이름 입력은 필수 입니다.' });
    } else {
        if (layerData.externalTab === 'nuri' && !isValidURL(layerData.nuriData.servicePath)) {
            openAlert({ message: '웹 주소 형식을 입력해주세요.' });
        } else if (!showButton.value) {
            openAlert({ message: '자료 유형 입력은 필수 입니다.' });
        } else {
            if (layerData.entry === 'edit') {
                await save('update');
            } else {
                await save('new');
            }
            deleteLayer();
        }
    }
};
const deleteLayer = () => {
    const layer = layerData;
    layer.state = 'off';
    layerStore.setLayer(layer);
};

const showButton = computed(() => {
    if (layerData.externalTab === 'nuri' || layerData.externalTab === 'whboard') return true;
    else if (layerData.externalTab === 'contents') {
        if (layerData.contentsTab === 'search' && layerData.isShowSearchDetail === 'on') return true;
        else if (layerData.contentsTab === 'image' && layerData.isShowImageDetail === 'on') return true;
        else if (layerData.contentsTab === 'document' && layerData.isShowDocumentDetail === 'on') return true;
        else return false;
    } else return false;
});

const isValidURL = url => {
    let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
};
</script>
