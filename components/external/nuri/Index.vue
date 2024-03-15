<!--
@파일(Method): Nuri.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:09
@설명: 누리집 연동 콘텐츠 영역
-->
<template>
    <div class="class_board class_board_box">
        <div class="tab_body">
            <div class="board_con_item1">
                <div class="sub_tit_wrap">
                    <i class="ico book_open_30 ico_size_lg"></i>
                    {{ subtitle }}
                </div>
                <div class="class_board">
                    <div class="list_area">
                        <ul class="info_list_wrap">
                            <li>
                                <span v-if="layerData.id !== 'workbook.groupActivity'" class="contents_title bullet_title font-color-black"
                                    >수업에 활용할 누리집 주소를 입력하거나, 최근 저장한 누리집 주소에서 선택하세요.</span
                                >

                                <div class="form_group">
                                    <v-row no-gutters class="center">
                                        <v-col cols="2">
                                            <div class="text_field_box">
                                                <v-text-field
                                                    v-model="layerData.nuriData.title"
                                                    required
                                                    class="mr-3"
                                                    density="comfortable"
                                                    variant="outlined"
                                                    placeholder="사이트명"
                                                    hide-details
                                                />
                                            </div>
                                        </v-col>
                                        <div class="text_field_box flex-fill">
                                            <v-text-field
                                                v-model="layerData.nuriData.servicePath"
                                                required
                                                class="flex-grow-2"
                                                placeholder="https://www.주소입력.com"
                                                variant="outlined"
                                                density="comfortable"
                                                hide-details
                                            />
                                        </div>
                                    </v-row>
                                </div>
                            </li>
                            <li>
                                <span class="contents_title bullet_title font-color-black"
                                    >최근 저장한 누리집 주소입니다. (최대 5건 저장)</span
                                >
                                <div class="form_group">
                                    <div v-for="recentUrl in recentUrls" :key="recentUrl" class="input_btn_wrap">
                                        <div class="list_box" :class="{ active: layerData.nuriData.servicePath === recentUrl.servicePath }">
                                            {{ recentUrl.title || '최근 방문한 URL' }}
                                            <span class="font-color-blue font-weight-regular">{{ recentUrl.servicePath }}</span>
                                        </div>
                                        <v-btn
                                            flat
                                            rounded
                                            :class="layerData.nuriData.servicePath === recentUrl.servicePath ? 'black' : 'outlined_bk'"
                                            size="small"
                                            @click="
                                                addKeyValue(layerData.id, {
                                                    nuriData: {
                                                        title: recentUrl.title,
                                                        servicePath: recentUrl.servicePath
                                                    }
                                                })
                                            "
                                        >
                                            <i
                                                class="ico ico_size_6 check_30"
                                                :class="{ ico_color_white: layerData.nuriData.servicePath === recentUrl.servicePath }"
                                            ></i>
                                            선택
                                        </v-btn>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="layerData.id === 'nuri'" class="d-flex center mgt20 gap1">
        <v-btn flat rounded size="large" class="black" @click="saveToMine">내 수업 자료 저장</v-btn>
        <v-btn flat rounded size="large" class="black" @click="sendToStudents"> 학생에게 바로 전송</v-btn>
    </div>
</template>
<script setup>
const { layerData, addKeyValue } = useLayerStore();
const { items: recentUrls, setItem: setRecentUrls } = useIndexedDB('data', 'recentUrls');
const { save, submit } = useExternal('nuri');
const { openAlert } = useAlert();

// 누리집 데이터 초기 세팅
onBeforeMount(() => {
    if (layerData.id === 'nuri') {
        addKeyValue(layerData.id, {
            nuriData: {},
            externalTab: 'nuri'
        });
    }
});

// 최근 검색어 업데이트
const updateRecentUrls = url => {
    recentUrls.value = recentUrls.value.filter(e => e.servicePath !== url.servicePath); //중복제거
    recentUrls.value = recentUrls.value.filter((e, idx) => idx < 4); //5개까지
    recentUrls.value.unshift(url); //추가

    setRecentUrls(recentUrls.value);
};

// 화면 별 부제 분기 처리
const subtitle = computed(() => {
    if (layerData.id === 'nuri') {
        return '학생들에게 웹페이지를 전송합니다.';
    } else if (layerData.id === 'workbook.groupActivity') {
        return '모둠 활동에 사용할 누리집 주소를 입력하고 등록합니다.';
    } else {
        return '학생들에게 전송할 웹 페이지를 등록합니다.';
    }
});

// URL 정규식 검사
const isValidURL = url => {
    let urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
};

// 내 수업 자료 저장
const saveToMine = () => {
    if (layerData.nuriData.title.length > 50) {
        openAlert({ message: '사이트명은 최대 50자 입니다.' });
    } else if (!isValidURL(layerData.nuriData.servicePath)) {
        openAlert({ message: '웹 주소 형식을 입력해주세요.' });
    } else {
        save('new');
    }
};

// 학생에게 바로 전송
const sendToStudents = () => {
    if (layerData.nuriData.title.length > 50) {
        openAlert({ message: '사이트명은 최대 50자 입니다.' });
    } else if (!isValidURL(layerData.nuriData.servicePath)) {
        openAlert({ message: '웹 주소 형식을 입력해주세요.' });
    } else {
        submit('nuri', layerData.nuriData);
        updateRecentUrls(layerData.nuriData);
    }
};
</script>
