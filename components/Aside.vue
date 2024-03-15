<!--
@파일(Method): Aside.vue
@작성자: LEE
@작성일: 2023-11-30 16:29
@설명: RNB
@수정: 퍼블 적용(LEE-24.02.01) 
-->
<template>
    <aside id="aside" class="aside_wrap print-none">
        <div class="aside_area">
            <div class="aside_inner">
                <div :class="isThema == 'teacher' ? 'tc_only' : 'st_only'">
                    <div>
                        <div
                            v-if="layerHeader?.id == 'class'"
                            class="state_box"
                            :class="classState == 'ready' ? 'waiting' : ''"
                            @click="setClassStateModal()"
                        >
                            <div class="d-flex justify-center align-center flex-column">
                                <template v-if="classState == 'ready'">
                                    <v-switch v-model="classStateSwitchOff" hide-details inset class="size-sm mb-1" />
                                    <div class="state_label">수업대기</div>
                                </template>
                                <template v-else-if="classState == 'proceeding'">
                                    <v-switch v-model="classStateSwitchOn" hide-details inset class="size-sm mb-1" />
                                    <div class="state_label">수업중</div>
                                </template>
                                <template v-else>
                                    <i class="ico send_fill_30 ico_color_blue mb-1" />
                                    <p class="font-header3 font-color-blue">이력 전송</p>
                                </template>
                            </div>
                        </div>
                        <div class="nav_wrap mb-5">
                            <details
                                v-for="(item, idx) in layerDatas.filter(
                                    e => e.area == 'aside1' && e.parent == layerHeader?.id && e.useYn != false
                                )"
                                :key="idx"
                            >
                                <template
                                    v-if="layerDatas.filter(e => e.area == 'aside2' && e.parent == item.id && e.useYn != false).length > 0"
                                >
                                    <summary class="d-flex align-center justify-space-between" @click="addLayer(item)">
                                        {{ t(item.name) }}
                                        <i class="ico aside_btn ico_size_4" />
                                    </summary>
                                    <ul>
                                        <li
                                            v-for="(item1, idx1) in layerDatas.filter(
                                                e => e.area == 'aside2' && e.parent == item.id && e.useYn != false
                                            )"
                                            :key="idx1"
                                            :class="[{ active: layerData?.id == item1.id }]"
                                            @click="addLayer(item1)"
                                        >
                                            {{ t(item1.name) }}
                                        </li>
                                    </ul>
                                </template>
                                <template v-else>
                                    <summary class="d-flex align-center justify-space-between" @click="addLayer(item)">
                                        {{ t(item.name) }}
                                    </summary>
                                </template>
                            </details>
                        </div>
                    </div>
                    <div>
                        <div class="chat_bot" @click="setChatbot">
                            <span>아이쌤<br />챗봇 </span>
                        </div>
                        <div class="util_wrap">
                            <template v-if="isThema == 'teacher'">
                                <button class="util_btn" type="button" @click="setMonitoring">{{ t('aside.info.monitoring.name') }}</button>
                                <button class="util_btn" type="button" @click="setScreenShare">{{ t('aside.info.send') }}</button>
                                <button class="util_btn screenHide" type="button" @click="setScreenHide">
                                    {{ hiddenState ? t('aside.info.show') : t('aside.info.hide') }}
                                </button>
                            </template>
                            <template v-else>
                                <div class="sound_control align-center d-flex flex-column">
                                    <i class="ico ico_size_10 mb-1" :class="user?.soundVolume == 0 ? 'sound_off_30' : 'sound_30'" />
                                    <span class="label">소리 {{ user?.soundVolume == 0 ? '꺼짐' : '켜짐' }} </span>
                                </div>
                            </template>
                            <div class="screen_control">
                                <span class="label">{{ t('aside.info.ratio') }}</span>
                                <div class="controller">
                                    <button class="zoom" @click="changeZoom('out')"><i class="ico ico_size_4 arrow_up_30" /></button>
                                    <span>{{ zoom }}</span>
                                    <button class="zoom" @click="changeZoom('in')"><i class="ico ico_size_4 arrow_down_30" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-if="type === 'ready'" @modal-closed="classStateSwitchOff = false" @handle-action-one="setClassState">
            <span>수업을 시작합니다. <br />학생이 수업에 입장합니다.</span>
        </Modal>
        <Modal v-if="type === 'proceeding'" @modal-closed="classStateSwitchOn = true" @handle-action-one="setClassState">
            <span>수업을 종료하고, <br />이력을 전송합니다</span>
        </Modal>
    </aside>
</template>

<script setup>
onMounted(() => {
    watch(
        () => user.value?.soundVolume,
        (newValue, oldValue) => {
            if (user.value?.mode == 'student' && user.value?.soundVolume == 0) {
                openAlert({ message: '소리가 꺼졌습니다.' });
            }
        }
    );
});

const props = defineProps({
    isThema: {
        type: String,
        default: ''
    }
});

const { t } = useI18n();
const { openModal, closeModal, type } = useModal();
const { openAlert } = useAlert();

//사용자
const { user } = storeToRefs(useApiUserStore());

//레이어
const layerStore = useLayerStore();
const { layerDatas, layerData, layerHeader } = storeToRefs(layerStore);
const addLayer = value => {
    if (value.externalUrl) {
        window.open(value.externalUrl, '_blank');
    } else {
        value.state = 'on';
        layerStore.setLayer(value);
    }
};

//webRtc
const webRtcStore = useWebRtcStore();
const { userPeerList } = storeToRefs(webRtcStore);

//수업상태
const classStateSwitchOff = ref(false);
const classStateSwitchOn = ref(true);
const apiClassStore = useApiClassStore();
const { classState, classStudent } = storeToRefs(apiClassStore);
const setClassStateModal = () => {
    if (user.value.mode == 'teacher') {
        if (classState.value == 'end') {
            apiClassStore.setClassState('ready');
            classStateSwitchOn.value = true;
            classStateSwitchOff.value = false;

            //전체 학생에게 전달(수업종료->수업대기)
            webRtcStore.setSendMessage('teacher', 'all', 'ClassAction', { type: 'wait', state: classState.value });
        } else {
            openModal({ type: classState.value, buttonLabels: ['취소', '확인'], closeBtnClass: false });
        }
    }
};
const setClassState = () => {
    if (classState.value == 'ready') {
        apiClassStore.setClassState('proceeding');
        classStateSwitchOn.value = true;
        classStateSwitchOff.value = false;

        //전체 학생에게 전달(수업대기->수업중)
        webRtcStore.setSendMessage('teacher', 'all', 'ClassAction', {
            type: 'start',
            state: classState.value,
            data: { id: layerData.value?.id }
        });
    } else if (classState.value == 'proceeding') {
        apiClassStore.setClassState('end');
        classStateSwitchOn.value = true;
        classStateSwitchOff.value = false;

        /*
        TODO: 이력전송
        */

        //전체 학생에게 전달(수업중->수업종료)
        webRtcStore.setSendMessage('teacher', 'all', 'ClassAction', { type: 'end', state: classState.value });
    }

    closeModal();
};

//챗봇
const setChatbot = () => {
    window.open('http://chatbot-front-22484207-9e1da2fc624c.kr.lb.naverncp.com/chatbot/student', '_blank');
};

//모니터링
const setMonitoring = () => {
    const item = layerDatas.value.find(e => e.id == 'monitoring');
    addLayer(item);
};

//화면가리기
const hiddenStore = useHiddenStore();
const { hiddenState, hiddenMode } = storeToRefs(hiddenStore);
const setScreenHide = () => {
    hiddenStore.setHidden(!hiddenState.value, 'hidden');

    //전체 학생에게 전달
    webRtcStore.setSendMessage('teacher', 'all', 'ControlAction', { type: 'screen', data: 'hidden' });
};

//화면공유
const setScreenShare = () => {
    //전체 학생에게 전달
    webRtcStore.setSendMessage('teacher', 'all', 'DisplayShareAction', 'on');
};

//화면 확대/축소
let scale = ref(1);
let zoom = ref(100);
const changeZoom = type => {
    if ('out' === type) {
        scale.value += 0.1;
        zoom.value += 10;
    } else {
        scale.value -= 0.1;
        zoom.value -= 10;
    }
    scale.value = Math.max(0.5, Math.min(2, scale.value));
    zoom.value = Math.max(50, Math.min(200, zoom.value));
    document.querySelector('#contents_area').style.zoom = zoom.value + '%';
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
