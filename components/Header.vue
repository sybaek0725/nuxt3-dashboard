<!--
@파일(Method): Header.vue
@작성자: LEE
@작성일: 2023-11-30 16:29
@설명: GNB
@수정: 퍼블 적용(LEE-24.02.01) 
-->
<template>
    <header id="header" class="header primary print-none">
        <div class="header_myinfo">
            <a class="btn_back" href="../"><span class="blind">뒤로가기</span></a>
            <span class="txt_info">{{ headerMyinfo('class') }}</span>
            <button type="button" class="ico_member">
                <img
                    :src="user?.profileUrl ? user?.profileUrl : useAsset('images/common/ico_member.svg')"
                    :alt="isThema == 'teacher' ? t('common.text.teacher') : t('common.text.student')"
                />
                <span class="txt_member">{{ headerMyinfo('name') }}</span>
            </button>
            <div class="d-flex align-center">
                <v-btn rounded flat size="small" class="outlined_bk" @click="authStore.userLogout()">{{ t('header.info.logout') }}</v-btn>
            </div>
        </div>
        <div class="header_mydata">
            <ul class="mydata_list">
                <li v-for="(item, idx) in layerDatas.filter(e => e.area == 'header' && e.useYn != false)" :key="idx">
                    <button type="button" :class="[{ active: layerHeader?.id === item.id }]" @click="addLayer(item)">
                        <i :class="[item.areaclass, item.areaclass && 'ico']"></i>
                        <em>{{ t(item.name) }}</em>
                    </button>
                </li>
                <li v-for="(item, idx) in layerDatas.filter(e => e.area == 'header1' && e.useYn != false)" :key="idx">
                    <button type="button" @click="addLayer(item)">
                        <i :class="[item.areaclass, item.areaclass && 'ico']"></i>
                        <em></em>
                    </button>
                </li>
            </ul>
        </div>
        <Modal v-if="type === 'notLink'">
            <span>수업 종료 후 이동할 수 있습니다.</span>
        </Modal>
    </header>
</template>

<script setup>
const props = defineProps({
    isThema: {
        type: String,
        default: ''
    }
});

const { t } = useI18n();
const { openModal, closeModal, type } = useModal();

//사용자
const { user } = storeToRefs(useApiUserStore());

//인증
const authStore = useAuthStore();

//수업상태
const { classState } = storeToRefs(useApiClassStore());

//화면가리기
const hiddenStore = useHiddenStore();

//레이어 정보
const layerStore = useLayerStore();
const { layerDatas, layerData, layerHeader } = storeToRefs(layerStore);
const addLayer = value => {
    //수정중인경우 제외처리
    if (user.value.mode == 'student') {
        if (classState.value == 'proceeding' && value.proceeding != 'on') {
            //대기화면(집중하세요.)
            hiddenStore.setHidden(true, 'focus');
            return false;
        } else {
            hiddenStore.setHidden(false, '');
        }
    } else {
        if (classState.value == 'proceeding' && value.proceeding != 'on') {
            openModal({ type: 'notLink', buttonLabels: ['확인'], closeBtnClass: false });
            return false;
        }
    }

    if (!value.child) {
        value.state = 'on';
        layerStore.setLayer(value);
    } else {
        layerStore.setLayerHeader(value);
        layerStore.setAddLayer(value.child);
    }
};

//정보 표시
const headerMyinfo = type => {
    if (type == 'class') {
        return (
            t('header.info.' + user.value?.classInfo.gradeSchoolCode) +
            t('header.info.class', {
                grade: user.value?.classInfo.grade,
                semester: user.value?.classInfo.classNum
            })
        );
    } else {
        return t('header.info.name', {
            name: user.value?.name,
            type: props.isThema == 'teacher' ? t('common.text.teacher') : t('common.text.student')
        });
    }
};
</script>

<style scoped>
@media print {
    .print-none,
    .print-none * {
        display: none;
    }
}
</style>
