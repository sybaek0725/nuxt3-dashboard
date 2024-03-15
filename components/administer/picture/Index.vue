<!--
@파일(Method): Index.vue
@작성자: LEE
@작성일: 2024-01-31 09:06
@설명: 사진과제
@수정:
-->
<template>
    <div v-if="user.mode == 'teacher'" class="ma_note full_h">
        <AdministerPictureResult />
    </div>
    <div v-else-if="user.mode == 'student'" class="ma_note full_h">
        <AdministerPictureForm />
    </div>
</template>

<script setup>
const { user } = storeToRefs(useApiUserStore());
</script>
