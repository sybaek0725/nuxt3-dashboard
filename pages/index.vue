<template>
    <div>
        <h1>학습결과(대시보드) 화면 진입</h1>
        <v-btn
            rounded
            flat
            size="large"
            class="primary"
            @click="
                openModal({
                    type: 'notice',
                    message: 'AI 학기말 생활기록부 화면으로 이동하시겠습니까?',
                    buttonLabels: ['아니요', '예'],
                })
            "
            >AI 학기말 생활기록부</v-btn
        >
        <Modal
            @handle-action="
                useRouter().push('/record');
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
