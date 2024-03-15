//<!--
@파일(Method): Modal.vue
@작성자: 박보현
@작성일: 2023-12-04 14:38
@설명: 모달 팝업
@수정: 2023-12-26 message (단순 텍스트) 분기 추가
-->
<template>
    <v-dialog v-model="isOpen" persistent transition="dialog-center-transition" width="auto">
        <div class="dialog" :class="wrapClass">
            <div v-if="title !== ''" class="title">
                <span>{{ title }}</span>
                <i class="ico ico_size_lg close_30" @click="closeModalAndEmit"></i>
            </div>
            <div class="dialog_message">
                <span v-if="message !== ''">{{ message }}</span>
                <slot v-else></slot>
            </div>
            <div v-if="buttonLabels.length > 0" class="dialog_btn_wrap">
                <slot name="footer">
                    <v-btn
                        v-if="buttonLabels[0]"
                        rounded
                        flat
                        :class="[buttonLabels.length === 1 ? 'black' : 'outlined_bk']"
                        @click="closeModalAndEmit"
                    >
                        <span style="white-space: pre-line" v-text="buttonLabels[0]"
                    /></v-btn>
                    <v-btn v-if="buttonLabels[1]" rounded flat class="black" type="submit" @click="$emit('handleActionOne')"
                        ><span style="white-space: pre-line" v-text="buttonLabels[1]"
                    /></v-btn>
                    <v-btn v-if="buttonLabels[2]" rounded flat class="black" type="submit" @click="$emit('handleActionTwo')"
                        ><span style="white-space: pre-line" v-text="buttonLabels[2]"
                    /></v-btn>
                </slot>
            </div>
            <slot name="bottom" />
        </div>
    </v-dialog>
</template>

<script setup>
const { isOpen, title, buttonLabels, wrapClass, message, closeModal } = useModal();
const emits = defineEmits(['handleActionOne', 'handleActionTwo', 'modalClosed']);
const closeModalAndEmit = () => {
    closeModal();
    emits('modalClosed');
};
</script>

<style scoped></style>
