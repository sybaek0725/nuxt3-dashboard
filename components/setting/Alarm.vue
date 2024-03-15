<!--
@파일(Method): Alarm.vue
@작성자: 서동건
@작성일: 2024-01-31 14:32
@설명: 설정 - 알람설정
@수정: UI 정리(LEE-24.02.01) 
-->
<template>
    <div class="study_item_con">
        <div class="profile_wrap">
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>수업 관리</em>
                    <span class="txt_area">아이쌤와 아이비 사용여부 설정이 가능합니다.</span>
                </span>
            </div>
            <div v-for="(menu, index) in menus2" :key="index" class="section_switch">
                <div class="box">
                    <div class="sub">
                        <span class="label"> {{ menu.caption }}</span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="menus1.model" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                    <div v-for="(item, idx) in menu.items" :key="idx" class="detail">
                        <span class="label">{{ item.name }}</span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="item.model" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                </div>
                <div v-for="(menu, index) in menus4" :key="index" class="box">
                    <div class="sub">
                        <span class="label"> {{ menu.caption }}</span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="menus3.model" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                    <div v-for="(item, idx) in menu.items" :key="idx" class="detail">
                        <span class="label">{{ item.name }}</span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="item.model" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                </div>
            </div>
            <!-- //title_wrap -->
            <!-- title_wrap -->
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>알림 설정</em>
                    <span class="txt_area">수업에 필요한 알림을 설정할 수 있습니다.</span>
                </span>
            </div>
            <!-- //title_wrap -->
            <div class="section_switch">
                <div class="box">
                    <div class="sub">
                        <span class="label">학생 입장 알림</span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="model7" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                    <div class="sub">
                        <span class="label label_inline">
                            수업 시작
                            <v-text-field
                                v-model="firstname"
                                :rules="[nameRules, isNumeric]"
                                variant="outlined"
                                required
                                hide-details
                                :disabled="isTextFieldDisabled"
                                type="number"
                                class="text-filed"
                            ></v-text-field>
                            분 후 미입장 학생에 알림
                        </span>
                        <div class="v_switch_wrap">
                            <v-switch v-model="model8" class="primary" hide-details inset></v-switch>
                        </div>
                    </div>
                </div>
            </div>
            <!-- //title_wrap -->
            <div class="bottom_btn_wrap">
                <v-btn rounded size="large" class="outlined_bk" @click="resetBtn">설정 초기화하기</v-btn>
                <v-btn rounded size="large" class="primary">설정 저장하기</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
const nameRules = ref(false);
const model7 = ref(true);
const model8 = ref(true);
const firstname = ref('');
const models = [];
for (let i = 1; i <= 6; i++) {
    models.push(ref(false));
}
const menus1 = ref({
    name: '아이쌤 사용 여부',
    model: models[0]
});

const menus2 = ref([
    {
        caption: '아이쌤 사용 여부',
        label: '아이쌤 사용 여부',
        items: [
            {
                name: '세부기능 01',
                model: models[1]
            },
            {
                name: '세부기능 02',
                model: models[2]
            }
        ]
    }
]);
const menus3 = ref({
    name: '아이비 사용 여부',
    model: models[3]
});
const menus4 = ref([
    {
        caption: '아이비 사용 여부',
        label: '아이비 사용 여부',
        items: [
            { name: '세부기능 01', model: models[4] },
            {
                name: '세부기능 02',
                model: models[5]
            }
        ]
    }
]);

watch(models[0], newValue => {
    if (newValue) {
        models[1].value = true;
        models[2].value = true;
    } else {
        models[1].value = false;
        models[2].value = false;
    }
});
watch(models[3], newValue => {
    if (newValue) {
        models[4].value = true;
        models[5].value = true;
    } else {
        models[4].value = false;
        models[5].value = false;
    }
});

const resetBtn = () => {
    models.forEach(model => {
        model.value = false;
    });
    model7.value = true;
    model8.value = true;
};

const isTextFieldDisabled = computed(() => {
    return model8.value === false;
});
const isNumeric = value => {
    if (!value) return true; // Allow empty value
    const numericRegex = /^\d+$/;
    return numericRegex.test(value);
};
</script>
