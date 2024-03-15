<template>
    <div id="wrap">
        <div class="dashboard-area">
            <slot />
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    useWindowSize();
});
</script>

<style>
/* CSS 임시 작업 */
.dashboard-area {
    width: 100%;
    padding: 20px;
    background-color: #e2e2e2;
}
h1 {
    padding-bottom: 20px;
}
</style>
