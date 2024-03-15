<!-- 
@파일(Method): Menu.vue
@작성자: 서동건
@작성일: 2023-12-04 16:46
@설명: 설정 - 메뉴설정
@수정: UI 정리(LEE-24.02.01) 
       user 과목 정보 변경(role->subject)(LEE 24.02.14)
-->
<template>
    <div class="study_item_con">
        <div class="profile_wrap">
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>{{ t('setting.menu.title') }}</em>
                    <span class="txt_area">{{ t('setting.menu.info') }}</span>
                </span>
            </div>
            <div class="section_switch">
                <div class="box">
                    <div class="sub">
                        <span class="label">{{ t('common.text.teacher') }} {{ t('setting.menu.subTitle') }}</span>
                    </div>
                    <div v-for="(item, idx) in teacherMenuItems" :key="idx" class="detail">
                        <span class="label">{{ t(item.text) }}</span>
                        <div class="v_switch_wrap">
                            <v-switch
                                v-model="item.useYn"
                                class="primary"
                                hide-details
                                inset
                                @change="toggleSwitch('teacher', item)"
                            ></v-switch>
                        </div>
                    </div>
                </div>
                <div class="box">
                    <div class="sub">
                        <span class="label">{{ t('common.text.student') }} {{ t('setting.menu.subTitle') }}</span>
                    </div>
                    <div v-for="(item, idx) in studentMenuItems" :key="idx" class="detail">
                        <span class="label">{{ t(item.text) }}</span>
                        <div class="v_switch_wrap">
                            <v-switch
                                v-model="item.useYn"
                                class="primary"
                                hide-details
                                inset
                                @change="toggleSwitch('student', item)"
                            ></v-switch>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom_btn_wrap">
                <v-btn rounded size="large" class="outlined_bk" @click="resetSettings">{{ t('setting.btn.reset') }}</v-btn>
                <v-btn rounded size="large" class="primary" @click="setSettings">{{ t('setting.btn.set') }}</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(async () => {
    await apiSettingStore.getMenuItems(user.value.subject);
});

const { t } = useI18n();
const { user } = storeToRefs(useApiUserStore());

const apiSettingStore = useApiSettingStore();
const { teacherMenuItems, studentMenuItems } = storeToRefs(apiSettingStore);

const teacher = computed(() => teacherMenuItems.value);
const student = computed(() => studentMenuItems.value);
const toggleSwitch = (type, item) => {
    if (type == 'teacher') {
        teacher.value.filter(e => e.id == item.id).forEach(e => (e.useYn = item.useYn));
    } else if (type == 'student') {
        student.value.filter(e => e.id == item.id).forEach(e => (e.useYn = item.useYn));
    }
};
const setSettings = async () => {
    await apiSettingStore.setMenuItems(teacher.value, student.value, user.value.subject);
};
const resetSettings = async () => {
    teacher.value.forEach(e => (e.useYn = true));
    student.value.forEach(e => (e.useYn = true));

    await apiSettingStore.setMenuItems(teacher.value, student.value, user.value.subject);
};
</script>
