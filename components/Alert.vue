<!--
TODO: 퍼블리싱 완료 후 UI 작업 진행
@파일(Method): Alert.vue
@작성자: 박보현
@작성일: 2023-12-04 18:46
@설명: 임시 Alert 팝업 노출 테스트
-->
<template>
    <v-dialog v-model="isOpen" :persistent="false" transition="dialog-center-transition" width="auto">
        <div class="dialog">
            <div class="dialog_message">
                <p class="txt_tit">{{ message }}</p>
            </div>
        </div>
    </v-dialog>
</template>

<script setup>
const { isOpen, message } = useAlert();
</script>
