<!--
@파일(Method): index.vue
@작성자: LEE
@작성일: 2023-11-26 14:23
@설명: 임시페이지
-->
<template>
    <div class="contents_wrap uiguide_wrap">
        <div class="col">
            <div class="contents_area">
                <header>
                    <NuxtLink to="/">
                        <img alt="logo" class="logo" src="@/assets/logo_beta.png" />
                    </NuxtLink>
                </header>
                <div class="type_view">
                    <div>
                        <div v-if="useRuntimeConfig().public.socketRoom == 'no'" class="w50 mb-5">
                            방선택
                            <v-select
                                v-model="selectedClass"
                                :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']"
                                label="방선택"
                                variant="outlined"
                                persistent-hint
                                rounded
                                return-object
                                single-line
                                hide-details
                                style="width: 140px !important"
                            />
                        </div>
                        <div>
                            <v-btn rounded class="primary" @click="login">로그인</v-btn>
                            <v-btn rounded flat class="gray ml-5" @click="logout">로그아웃</v-btn>
                        </div>
                        <div class="mt-5">
                            <v-btn rounded flat class="green" @click="link('math')">수학</v-btn>
                            <v-btn rounded flat class="orange ml-5" @click="link('eng')">영어</v-btn>
                            <v-btn rounded flat class="blue ml-5" @click="setClear">초기화(store)</v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    useWindowEvent();
});

const authStore = useAuthStore();
const selectedClass = ref('1');
const room = useCookie('room');

const login = () => {
    authStore.userLogin();
};

const logout = () => {
    authStore.userLogout();
};

const link = path => {
    room.value = selectedClass.value;
    window.location.href = `/${path}`;
};

const setClear = () => {
    useCustomLocalForage('store').clear();
    window.location.reload();
};
</script>

<style lang="scss">
.uiguide_wrap {
    body {
        background: #f8f8f8;
    }
    .contents_area {
        padding-left: 30px;
    }
    header {
        padding: 0 20px;
        img {
            height: 60px;
        }
    }
}
</style>
