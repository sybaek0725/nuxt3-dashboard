<!--
@파일(Method): Search.vue
@작성자: seungju.kim
@작성일: 2023-12-04 17:05
@설명: 콘텐츠 연동 - 자료 통합 검색 콘텐츠 영역
@수정: 코드 리팩토링 및 주석 추가
-->
<template>
    <!-- 검색화면 -->
    <div v-if="layerData.isShowSearchDetail === 'off'" class="text_field_wrap">
        <div class="text_field_box">
            <!-- 기본 + 최근 검색어 -->
            <div class="search_box" :class="{ active: isFocused }">
                <v-text-field
                    :ref="searchInputRef"
                    v-model="layerData.search"
                    autocomplete="off"
                    single-line
                    append-inner-icon="ico_search2"
                    variant="outlined"
                    auto-select-first
                    required
                    class="flex-full-width big"
                    density="comfortable"
                    item-props
                    outlined
                    placeholder="검색어를 입력하세요."
                    hide-details
                    @focus="toggleSearchList(true)"
                    @keydown.enter.prevent="searchItem(layerData.search)"
                    @click:append-inner="searchItem(layerData.search)"
                >
                </v-text-field>
                <div v-if="isFocused" class="search_list">
                    <p class="title">최근 검색어</p>
                    <v-list>
                        <v-list-item v-for="item in recentSearch" :key="item.title" class="list_item" @click="searchItem(item.title)">
                            <a>
                                <i class="ico search_30"></i>
                                {{ item.title }}
                            </a>
                        </v-list-item>
                    </v-list>
                </div>
            </div>
        </div>

        <!-- 검색전 -->
        <div v-if="!layerData.isSearching" class="info">
            <div class="ico search_ill_100 ico_size_25"></div>
            <p>수업에 적합한 자료를 자유롭게 검색하고 수업에 활용할 수 있습니다.</p>
        </div>

        <!-- 검색후 -->
        <div v-else>
            <!-- 검색 결과 없음 -->
            <div v-if="noData" class="info">
                <div class="ico search_no_result_100 ico_size_25"></div>
                <p>검색 결과가 없습니다.</p>
            </div>

            <!-- 검색 결과 있음 -->
            <div v-else class="thumb_con_wrap mb-30">
                <v-row no-gutters>
                    <!-- 이미지 -->
                    <v-col cols="6">
                        <div class="tit_wrap">
                            <span class="bullet_st">이미지</span>
                            <v-checkbox v-model="isShowClipArt" label="클립아트 보기" hide-details class="default"></v-checkbox>
                        </div>
                        <div class="thumb_list_wrap">
                            <ul v-if="isShowClipArt">
                                <v-row>
                                    <v-col v-for="item in clipItems" :key="item.contentsNo" cols="4">
                                        <v-img :src="item.serviceThumbnailPath" :alt="item.title" />
                                        <p>{{ item.title }}</p>
                                    </v-col>
                                </v-row>
                            </ul>

                            <ul v-else class="pr30">
                                <v-row>
                                    <v-col
                                        v-for="item in imageItems"
                                        :key="item.contentsNo"
                                        cols="4"
                                        @click="clickSearchItem('image', item)"
                                    >
                                        <li>
                                            <a>
                                                <div class="img_wrap">{{ item.title }}</div>
                                                <!-- <v-img :src="item.serviceThumbnailPath" :alt="item.title" /> -->
                                                <p>{{ item.title }}</p>
                                            </a>
                                        </li>
                                    </v-col>
                                </v-row>
                            </ul>
                            <!-- <div class="d-flex justify-center my-10">
                                <v-btn rounded size="large" class="primary" @click="showMoreItem(isShowClipArt ? '10011' : '10001')"
                                    >더보기</v-btn
                                >
                            </div> -->
                        </div>
                    </v-col>
                    <!-- 동영상 -->
                    <v-col cols="6">
                        <div class="tit_wrap">
                            <span class="bullet_st">동영상</span>
                        </div>
                        <div class="thumb_list_wrap">
                            <ul class="pr30">
                                <v-row>
                                    <v-col
                                        v-for="item in videoItems"
                                        :key="item.contentsNo"
                                        cols="4"
                                        @click="clickSearchItem('video', item)"
                                    >
                                        <li>
                                            <a>
                                                <div class="img_wrap">{{ item.title }}</div>
                                                <!-- <v-img :src="item.serviceThumbnailPath" :alt="item.title" /> -->
                                                <p>{{ item.title }}</p>
                                            </a>
                                        </li>
                                    </v-col>
                                </v-row>
                            </ul>
                            <!-- <div class="d-flex justify-center my-10">
                                <v-btn rounded size="large" class="primary" @click="showMoreItem('10002')">더보기</v-btn>
                            </div> -->
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>

    <!-- 상세보기 -->
    <div v-else class="pho_view_wrap">
        <div class="top_btn_wrap">
            <div>
                <v-btn flat rounded size="small" class="outlined_bk" @click="addKeyValue(layerData.id, { isShowSearchDetail: 'off' })">
                    <i class="ico ico_size_6 back_30" />이전</v-btn
                >
            </div>
            <div v-if="layerData.searchData.type === 'image'" class="center">
                <v-btn
                    flat
                    rounded
                    size="small"
                    class="primary"
                    @click="
                        setAddLayer('whboard', {
                            whboardData: {
                                servicePath: layerData.searchData.servicePath
                            }
                        })
                    "
                    >화이트 보드</v-btn
                >
            </div>
            <div>&nbsp;</div>
        </div>
        <!-- 동영상 -->
        <div v-if="layerData.searchData.type === 'video'">
            <ViewerVod
                :service-path="layerData.searchData.servicePath"
                :service-thumbnail-path="layerData.searchData.serviceThumbnailPath"
            />
        </div>
        <!-- 사진 -->
        <div v-else-if="layerData.searchData.type === 'image'" class="img_wrap">
            <img :src="layerData.searchData.servicePath" alt="" />
        </div>
    </div>
</template>

<script setup>
const { addKeyValue, layerData, setAddLayer } = useLayerStore();
const { items: recentSearch, setItem: setRecentSearch } = useIndexedDB('data', 'recentSearch');
const { getItems } = useApiSearchStore();
const { imagePaging, clipPaging, videoPaging, imageItems, videoItems, clipItems } = storeToRefs(useApiSearchStore());

const isLoading = ref(false);
const isShowClipArt = ref(false);
const isFocused = ref(false);
const searchInputRef = ref(null);

const toggleSearchList = status => {
    if (!recentSearch.value.length) return;
    isFocused.value = status;
};

// 검색 결과 없음
const noData = computed(() => {
    return layerData.isSearching && imageItems.value?.length === 0 && clipItems.value?.length === 0 && videoItems.value?.length === 0;
});

// 최근 검색어 업데이트
const updateRecentSearch = search => {
    recentSearch.value = recentSearch.value.filter(e => e.title !== search); //중복제거
    recentSearch.value = recentSearch.value.filter((e, idx) => idx < 14); //15개까지
    recentSearch.value.unshift({
        prependIcon: 'ico_list_search',
        title: search
    }); //추가

    setRecentSearch(recentSearch.value);
};

// 검색 결과 업데이트
const searchItem = async word => {
    if (word === undefined || word === null) return;
    if (word.trim() === '') return;
    isFocused.value = false;

    isLoading.value = true;
    layerData.search = word;
    isShowClipArt.value = false;
    imagePaging.value = 1;
    clipPaging.value = 1;
    videoPaging.value = 1;

    await getItems('10001', 1, 9, word);
    await getItems('10002', 1, 9, word);
    await getItems('10011', 1, 9, word);

    addKeyValue(layerData.id, {
        isSearching: true
    });
    updateRecentSearch(word);

    isLoading.value = false;
};

// 검색 결과 상세보기
const clickSearchItem = (type, item) => {
    addKeyValue(layerData.id, { searchData: { ...item, type: type }, isShowSearchDetail: 'on' });
};

// 더보기
const showMoreItem = async type => {
    if (type === '10001') {
        imagePaging.value = imagePaging.value + 1;
        await getItems(type, imagePaging.value, 9, layerData.search);
    } else if (type === '10011') {
        clipPaging.value = clipPaging.value + 1;
        await getItems(type, clipPaging.value, 9, layerData.search);
    } else if (type === '10002') {
        videoPaging.value = videoPaging.value + 1;
        await getItems(type, videoPaging.value, 9, layerData.search);
    }
};
</script>
