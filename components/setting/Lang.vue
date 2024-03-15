<!-- 
@파일(Method): Lang.vue
@작성자: 서동건
@작성일: 2023-12-04 16:46
@설명: 설정 - 언어변경
@수정: UI 정리(LEE-24.02.01) 
-->
<template>
    <div class="study_item_con">
        <div class="profile_wrap">
            <div class="title_setting">
                <span class="tit_txt_wrap">
                    <em>{{ t('setting.lang.title') }}</em>
                    <span class="txt_area">{{ t('setting.lang.info') }}</span>
                    <span class="txt_info">{{ t('setting.lang.state', { state: currentLang?.name ? t(currentLang.name) : '' }) }}</span>
                </span>
            </div>
            <div class="language_wrap">
                <table class="table_type1">
                    <caption>
                        {{
                            t('setting.lang.title')
                        }}
                    </caption>
                    <colgroup>
                        <col style="width: 25%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <div class="col3">
                                    <v-radio-group v-model="selectLang" class="large primary" inline hide-details>
                                        <v-radio
                                            v-for="(item, idx) in languageItems"
                                            :key="idx"
                                            :label="t(item.name)"
                                            :value="item.id"
                                            @click="toggleRadio(item)"
                                        ></v-radio>
                                    </v-radio-group>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bottom_btn_wrap">
                <v-btn rounded size="large" class="outlined_bk" @click="setSettings('ko')">{{ t('setting.btn.reset') }}</v-btn>
                <v-btn rounded size="large" class="primary" @click="setSettings(selectLang)">{{ t('setting.btn.set') }}</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(async () => {
    await apiSettingStore.getLongItems();
    selectLang.value = currentLang.value.id;
});

const i18n = useI18n();
const { t } = useI18n();
const apiSettingStore = useApiSettingStore();
const { languageItems, currentLang } = storeToRefs(apiSettingStore);

const selectLang = ref();
const toggleRadio = item => {
    selectLang.value = item.id;
};
const setSettings = async value => {
    languageItems.value.filter(e => e.id != value).forEach(e => (e.useYn = false));
    languageItems.value.filter(e => e.id == value).forEach(e => (e.useYn = true));
    selectLang.value = value;

    const { status } = await apiSettingStore.setLongItems(languageItems.value);
    if (status.value == 'success') {
        i18n.setLocale(value);
    }
};
</script>
