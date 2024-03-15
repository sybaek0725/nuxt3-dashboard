<!--
@파일(Method): teacher.vue
@작성자: LEE
@작성일: 2024-01-26 17:49
@설명: 영어 교사 레이아웃
-->
<template>
    <div id="wrap" class="wrap teacher">
        <Header :is-thema="isThema" />
        <div class="container">
            <slot />
            <Aside :is-thema="isThema" />
        </div>
    </div>
</template>

<script setup>
const isThema = ref('teacher');
</script>
