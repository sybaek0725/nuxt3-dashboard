<template>
    <div class="pagination_wrap re_define">
        <div class="arrow_btn_wrap">
            <v-btn
                rounded
                flat
                size="small"
                class="ico double_arrow_left_30 ico_size_lg"
                :disabled="isPrevPage"
                @click.prevent="$emit('page', 1)"
            >
                <span class="blind">처음</span>
            </v-btn>
            <v-btn
                rounded
                flat
                size="small"
                class="ico circle_arrow_left_30 ico_size_lg"
                :disabled="isPrevPage"
                @click.prevent="$emit('page', currentPage - 1)"
            >
                <span class="blind">이전</span>
            </v-btn>
        </div>
        <div class="txt_btn_wrap">
            <v-btn
                v-for="(page, index) in pageCount"
                :key="page"
                rounded
                flat
                size="small"
                :class="{ active: currentPage === index + 1 }"
                @click.prevent="$emit('page', index + 1)"
            >
                {{ page }}
            </v-btn>
        </div>
        <div class="arrow_btn_wrap">
            <v-btn
                rounded
                flat
                size="small"
                class="ico circle_arrow_right_30 ico_size_lg"
                :disabled="isNextPage"
                @click.prevent="$emit('page', currentPage + 1)"
            >
                <span class="blind">다음</span>
            </v-btn>
            <v-btn
                rounded
                flat
                size="small"
                class="ico double_arrow_right_30 ico_size_lg"
                :disabled="isNextPage"
                @click.prevent="$emit('page', pageCount)"
            >
                <span class="blind">마지막</span>
            </v-btn>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    }
});
defineEmits(['page']);
const isPrevPage = computed(() => props.currentPage === 1);
const isNextPage = computed(() => !(props.currentPage < props.pageCount));
</script>
