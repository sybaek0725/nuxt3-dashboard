<template>
    <div class="indicator" :class="classType">
        <v-btn
            flat
            rounded
            size="small"
            class="icon_only icon_only-transparent"
            :disabled="isPrevPage"
            @click.prevent="$emit('page', currentPage - volume)"
        >
            <div class="ico_outer size_sm">
                <i class="ico left_circle_40"></i>
            </div>
            <span class="blind">이전</span>
        </v-btn>
        <span class="txt_wrap"
            ><em>{{ currentPage }}</em
            >/<span>{{ pageCount }}</span></span
        >
        <v-btn
            flat
            rounded
            size="small"
            class="icon_only icon_only-transparent"
            :disabled="isNextPage"
            @click.prevent="$emit('page', currentPage + volume)"
        >
            <div class="ico_outer size_sm">
                <i class="ico right_circle_40"></i>
            </div>
            <span class="blind">다음</span>
        </v-btn>
    </div>
</template>

<script setup>
const props = defineProps({
    classType: {
        type: String,
        required: false,
        default: 'right'
    },
    currentPage: {
        type: Number,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: false,
        default: 1
    }
});
defineEmits(['page']);
const isPrevPage = computed(() => props.currentPage === 1);
const isNextPage = computed(() => !(props.currentPage < props.pageCount));
</script>

<style scoped></style>
