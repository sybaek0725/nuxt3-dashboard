<!--
@파일(Method): student.vue
@작성자: LEE
@작성일: 2023-11-26 14:24
@설명: 수학 학생 레이아웃
-->
<template>
    <div id="wrap" class="wrap student">
        <Header :is-thema="isThema" />
        <div class="container">
            <slot />
            <Aside :is-thema="isThema" />
        </div>
    </div>
</template>

<script setup>
const isThema = ref('student');
</script>
