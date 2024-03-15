<template>
    <div>
        <h1>AI 학기말 생활기록부 화면 진입</h1>
        <v-btn
            rounded
            flat
            size="large"
            class="primary"
            @click="
                openModal({
                    type: 'notice2',
                    message: '학습결과(대시보드) 화면으로 이동됩니다.',
                    buttonLabels: ['', '확인'],
                })
            "
            >학습결과(대시보드)</v-btn
        >
        <Modal
            @handle-action="
                useRouter().push('/');
                closeModal();
            "
        />
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});

const { openModal, closeModal } = useModal();
</script>
