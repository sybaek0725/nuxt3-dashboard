<!--
@파일(Method): Index.vue
@작성자: LEE
@작성일: 2024-01-31 09:06
@설명: AI추천자료
@수정: user 과목 정보 변경(role->subject)(LEE 24.02.14)
-->
<template>
    <div class="study_item_con">
        <div class="line_type full">
            <div class="tab_body">
                <div class="homework student">
                    <div class="w30 mb-5">
                        <v-select
                            v-model="select"
                            :items="items"
                            item-title="state"
                            item-value="abbr"
                            label="Select"
                            variant="outlined"
                            persistent-hint
                            rounded
                            return-object
                            single-line
                            hide-details
                        ></v-select>
                    </div>
                    <template v-if="user.subject == 'eng'">
                        <AdministerRecommendCard />
                    </template>
                    <template v-else>
                        <AdministerRecommendList />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { user } = storeToRefs(useApiUserStore());

const select = ref([{ state: '1.곱셈' }]);
const items = ref([{ state: '1.곱셈' }]);
</script>
