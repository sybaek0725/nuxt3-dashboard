<template>
    <div class="carousel_wrap">
        <v-carousel v-model:model-value="carouselModel" :continuous="false" :show-arrows="true" :height="height" hide-delimiters>
            <template #prev="{ attrs, props: pProps }">
                <button class="btn_previous" v-bind="attrs" @click="pProps.onClick">
                    <span class="blind">Previous slide</span>
                </button>
            </template>
            <template #next="{ attrs, props: nProps }">
                <button class="btn_next" v-bind="attrs" @click="nProps.onClick">
                    <span class="blind">Next slide</span>
                </button>
            </template>
            <v-carousel-item v-for="item in items" :key="item.servicePath || item.problemUrl" :src="item.servicePath || item.problemUrl" />
        </v-carousel>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        require: true,
        default: 0
    },
    items: {
        type: Array,
        require: true,
        default: () => []
    },
    height: {
        type: String,
        require: false,
        default: 'auto'
    }
});
const emit = defineEmits(['update:modelValue']);

const carouselModel = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});
</script>
