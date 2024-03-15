<template>
    <v-dialog v-model="isOpen" persistent activator="parent" transition="dialog-center-transition" width="auto">
        <div class="dialog_wrap teacher_area">
            <div class="dialog_message">
                <span>{{ message }}</span>
            </div>
            <div :class="{ dialog_btn_wrap: buttonLabels.length > 0 }">
                <slot name="footer">
                    <v-btn v-if="buttonLabels[0]" rounded flat class="outlined_bk" @click="closeModalAndEmit"
                        ><span style="white-space: pre-line" v-text="buttonLabels[0]"
                    /></v-btn>
                    <v-btn v-if="buttonLabels[1]" class="black" flat rounded @click="$emit('handleAction')"
                        ><span style="white-space: pre-line" v-text="buttonLabels[1]"
                    /></v-btn>
                </slot>
            </div>
            <slot name="bottom" />
        </div>
    </v-dialog>
</template>

<script setup>
const { isOpen, buttonLabels, message, closeModal } = useModal();
const emits = defineEmits(['handleAction', 'modalClosed']);
const closeModalAndEmit = () => {
    closeModal();
    emits('modalClosed');
};
</script>
