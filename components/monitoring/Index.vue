<!--
@파일(Method): Index.vue
@작성자: LEE
@작성일: 2024-01-30 09:58
@설명: 모니터링
@수정: 하단 버튼 조정(LEE-24.03.12)
-->
<template>
    <div class="study_item_con">
        <div class="study_thumb_list">
            <ul>
                <li v-for="(item, idx) in classStudent" :key="idx">
                    <div class="st_info_wrap">
                        <div class="st_info_area">
                            <div class="st_pho">
                                <img :src="item.profileUrl ? item.profileUrl : useAsset('images/common/ico_member.svg')" />
                            </div>
                            <span class="txt_num">{{ item.number }}번</span>
                            <span class="txt_name ellipsis">{{ item.name }}</span>
                        </div>
                        <div class="btn_wrap">
                            <v-btn flat class="icon_type reqular sound" :class="{ active: item.soundVolume }" @click="setSound(item)">
                                <span class="blind">{{ t('aside.info.monitoring.sound') }}</span>
                            </v-btn>
                        </div>
                    </div>
                    <div v-if="userPeerList.filter(e => e.userId == item.studentId).length == 0" class="img_wrap img_wrap_not_loading">
                        수업 입장 전입니다.
                    </div>
                    <div
                        v-else-if="userPeerList.filter(e => e.userId == item.studentId && e.monitoringImg != undefined).length == 0"
                        class="img_wrap"
                    ></div>
                    <div v-else class="img_wrap" @mouseover="toggleSoundControls(item, true)" @mouseout="toggleSoundControls(item, false)">
                        <div v-show="item.showSoundControls" class="sound_wrap">
                            <div class="sound_area">
                                <div class="slider_wrap">
                                    <v-slider
                                        v-model="item.soundVolume"
                                        class="custom_white"
                                        color="white"
                                        step="1"
                                        :thumb-size="40"
                                        :prepend-icon="volumeIcon(item)"
                                        @end="e => setSoundChange(item, e)"
                                    ></v-slider>
                                </div>
                            </div>
                        </div>
                        <img :src="setImage(item)" />
                    </div>
                </li>
            </ul>
        </div>
        <div id="fixed_btn_wrap" class="fixed_btn_wrap">
            <v-btn rounded size="large" class="outlined" @click="setSoundAll(0)">{{ t('aside.info.monitoring.soundOn') }}</v-btn>
            <v-btn rounded size="large" class="primary" @click="setSoundAll(50)">{{ t('aside.info.monitoring.soundOff') }}</v-btn>
        </div>
        <Modal v-if="type === 'soundOn'">
            <span>모든 학생의 스피커가 켜졌습니다.</span>
        </Modal>
        <Modal v-if="type === 'soundOff'">
            <span>모든 학생의 스피커가 꺼졌습니다.</span>
        </Modal>
    </div>
</template>

<script setup>
onMounted(() => {
    //전체 학생에게 전달
    webRtcStore.setSendMessage('teacher', 'all', 'MonitoringAction');
});

const { t } = useI18n();
const { openModal, closeModal, type } = useModal();

//webRtc
const webRtcStore = useWebRtcStore();
const { userPeerList } = storeToRefs(webRtcStore);

//모니터링
const apiClassStore = useApiClassStore();
const { classStudent } = storeToRefs(apiClassStore);

const volumeIcon = computed(() => item => {
    return item.soundVolume === 0 ? 'icon_type reqular small on' : 'icon_type reqular big';
});
const toggleSoundControls = (item, value) => {
    item.showSoundControls = value;
};
const setSound = item => {
    item.showSoundControls = !item.showSoundControls;
};
const setSoundAll = value => {
    //데이터 저장
    classStudent.value.forEach(e => (e.soundVolume = value));
    apiClassStore.setClassStudent(classStudent.value);

    //전체 학생에게 전달
    webRtcStore.setSendMessage('teacher', 'all', 'ControlAction', { type: 'sound', data: value });

    //안내메시지
    if (value == 0) {
        openModal({ type: 'soundOff', buttonLabels: ['확인'], closeBtnClass: false });
    } else {
        openModal({ type: 'soundOn', buttonLabels: ['확인'], closeBtnClass: false });
    }
};
const setSoundChange = (item, value) => {
    //데이터 저장
    item.soundVolume = value;
    classStudent.value.filter(e => e.id == item.studentId).forEach(e => (e = item));
    apiClassStore.setClassStudent(classStudent.value);

    //해당 학생에게 전달
    const data = userPeerList.value.find(e => e.userId == item.studentId);
    webRtcStore.setSendMessage('teacher', data, 'ControlAction', { type: 'sound', data: item.soundVolume });
};
const setImage = item => {
    const data = userPeerList.value.find(e => e.userId == item.studentId);
    return data.monitoringImg;
};
</script>

<style scoped>
.fixed_btn_wrap {
    position: fixed;
    width: calc(100% - 100px);
    left: 0px;
    bottom: 0px;
}
</style>
