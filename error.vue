<template>
    <div class="contents_wrap">
        <div class="section_scroll">
            <div class="contents_area">
                <div class="dim-overlay">
                    <div>
                        <span class="ico_display_disabled" />
                        <p class="mb-5 ml-5">오류가 발생하였습니다.({{ error.statusCode }}) 잠시 후 다시 이용해 주세요.</p>
                        <v-btn @click="handleError">홈으로</v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    error: {
        type: Object,
        default: null
    }
});

onMounted(() => {
    useWindowEvent();
});

const handleError = () => clearError({ redirect: '/' });
</script>

<style lang="scss">
.dim-overlay {
    p {
        color: #f8f8f8;
    }
}
</style>
