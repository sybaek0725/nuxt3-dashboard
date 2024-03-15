<!--
@파일(Method): OffLine.vue
@작성자: LEE
@작성일: 2024-03-12 15:58
@설명: 인터넷 오프라인
-->
<template>
    <div v-if="message" class="d-flex flex-column justify-center align-center h-100">
        <i class="ico wifi_disconnected_80 ico_size_20 mb-5" />
        <span class="font-body3 text-center">
            인터넷 연결이 불안정합니다.<br />
            인터넷 연결 상태를 확인 후 다시 시도해 주세요.
        </span>
    </div>
</template>

<script setup>
onMounted(() => {
    watch(
        () => [layerData.value?.id, network.value],
        () => {
            if (network.value == 'offline') {
                if (layerHeader.value?.proceeding == 'on') {
                    openAlert({
                        message:
                            '인터넷 환경이 불안정하여, 인터넷 연결되지 않은 상태로 수업이 진행됩니다.(일부 수업 내용을 불러오지 못할 수 있습니다.)',
                        timeout: 3000
                    });
                    message.value = false;
                    document.querySelector('#contents_area').style.display = 'block';
                } else {
                    message.value = true;
                    document.querySelector('#contents_area').style.display = 'none';
                }
            } else {
                message.value = false;
                document.querySelector('#contents_area').style.display = 'block';
            }
        }
    );
});

const { openAlert } = useAlert();
const { layerData, layerHeader } = storeToRefs(useLayerStore());

const network = ref(useCookie('network'));
const message = ref(false);
</script>
