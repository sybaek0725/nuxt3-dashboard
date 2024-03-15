<!--
@파일(Method): List.vue
@작성자: 박보현
@작성일: 2023-12-08 15:49
@설명: 수업자료실 - 목록(테이블형)
@수정: 수업자료실 등록 레이어ID 변경(reference.create -> reference.form)(LEE-24.02.01)
-->
<template>
    <template v-if="!isSearch && totalCnt === 0">
        <div class="nodata">
            <div class="info data_room">
                <div class="ico ico_size_25 reference_100"></div>
                <p>수업 자료를 등록하고,<br />차시를 구성하거나 학생에게 공유해 보세요.</p>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="class_board_table_wrap">
            <p>총 {{ totalCnt }}건</p>
            <div class="class_board_table">
                <div v-if="totalCnt === 0" class="table_no_data" colspan="8">
                    <div class="info">
                        <i class="ico nodata_100 ico_size_25"></i>
                        <p>검색 결과가 없습니다.</p>
                    </div>
                </div>
                <table v-else>
                    <colgroup>
                        <col style="width: 12rem" />
                        <col style="width: 78.5rem" />
                        <col style="width: 8rem" />
                        <col style="width: 8rem" />
                        <col style="width: 8rem" />
                        <col style="width: 20rem" />
                        <col style="width: 12rem" />
                        <col style="width: 19rem" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>자료 형태</th>
                            <th>자료 제목</th>
                            <th>학년</th>
                            <th>학기</th>
                            <th>과목</th>
                            <th>단원 정보</th>
                            <th>연동 차시</th>
                            <th>전송하기</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in items" :key="index">
                            <td><i class="ico ico_size_12" :class="data.kofContent"></i></td>
                            <td @click="goDetail(data)">{{ data.materialName }}</td>
                            <td>{{ data.grade }}학년</td>
                            <td>{{ data.curriculumSubjectSemester }}학기</td>
                            <td>{{ data.courseName }}</td>
                            <td>{{ data.ChapterNm }}</td>
                            <td>{{ data.PeriodNm }}</td>
                            <td><v-btn rounded flat class="black" @click="send(data)">학생 화면에 전송</v-btn></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
</template>

<script setup>
const { submit, initExternal } = useExternal();
const apiReferenceStore = useApiReferenceStore();
const { item } = storeToRefs(apiReferenceStore);

defineProps({
    items: {
        type: Array,
        default: null
    },
    totalCnt: {
        type: Number,
        default: 0
    },
    isSearch: {
        type: Boolean,
        default: false,
        required: true
    }
});
const send = item => {
    submit(item.kofContent === 'white board' ? 'whboard' : item.kofContent === 'url' ? 'nuri' : 'contents', {
        servicePath: item.materialStoreUrl,
        type: item.kofContent,
        title: item.materialName
    });
};
const goDetail = data => {
    initExternal(data, 'reference.form', 'edit');
    item.value = data;
};
</script>

<style lang="scss" scoped>
.flag {
    width: 8rem;
    padding: 0;

    &.pdf {
        background: #d44e4e;
    }
    &.image {
        background: #679a3e;
    }

    &.word {
        background: #1797e2;
    }
    &.ppt {
        background: #ec6f39;
    }
    &.hwp {
        background: #006ba9;
    }
    &.excel {
        background: #229e86;
    }
    &.url {
        background: #c29868;
    }
    &.video {
        background: #cccc00;
    }
    &.whiteboard {
        background: #b423dc;
    }
}
</style>
