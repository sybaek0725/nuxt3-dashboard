<template>
    <template v-if="hiddenMode == 'hidden'">
        <div v-if="hiddenState" class="dim-overlay"></div>
    </template>
    <template v-else-if="hiddenMode == 'wait'">
        <v-row v-show="hiddenState" justify="center">
            <v-overlay v-model="hiddenState" persistent class="align-center justify-center">
                <div class="loading_wrap1">
                    <p class="txt_tit">잠시만 기다려 주세요.</p>
                    <div class="lds-spinner">
                        <span>
                            <i class="ico_bee_01" />
                            <i class="ico_bee_02" />
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </span>
                    </div>
                </div>
            </v-overlay>
        </v-row>
    </template>
    <template v-else>
        <v-overlay v-model="hiddenState" persistent class="align-center justify-center">
            <div class="overlay-contents">
                <div class="only_overlay">
                    <p class="font-header1 font-color font-color-white text-center mb-13">선생님께 집중해 주세요.</p>
                    <v-img src="@/assets/images/common/teacher-focus.png" alt="teacher"></v-img>
                </div>
            </div>
        </v-overlay>
    </template>
</template>

<script setup>
const { hiddenState, hiddenMode } = storeToRefs(useHiddenStore());
</script>
