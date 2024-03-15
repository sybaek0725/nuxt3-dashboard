<!--
@파일(Method): index.vue
@작성자: LEE
@작성일: 2024-01-26 17:45
@설명: 영어 메인페이지
-->
<template>
    <div></div>
</template>

<script setup>
import teacherData from '@/assets/data/eng/teacher.json';
import studentData from '@/assets/data/eng/student.json';

onBeforeMount(async () => {
    const route = useRoute();
    const token = useCookie('token');
    const type = useCookie('type');
    const subject = useCookie('subject');

    if (!token.value && !route.query.idToken) {
        authStore.userLogin();
    } else {
        token.value = token.value ? token.value : route.query.idToken;
        type.value = type.value ? type.value : route.query.type;
        subject.value = 'eng';

        await apiSettingStore.getMenuItems('eng');
        await apiSettingStore.getLongItems();
        login(type.value);
    }
});

//다국어
const i18n = useI18n();

//클래스 정보
const selectedStudent = ref();
const apiClassStore = useApiClassStore();
const { classStudent } = storeToRefs(apiClassStore);

//인증
const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);

//사용자
const apiUserStore = useApiUserStore();

//메뉴
const apiSettingStore = useApiSettingStore();
const { teacherMenuItems, studentMenuItems, currentLang } = storeToRefs(apiSettingStore);

//레이어
const layerStore = useLayerStore();
const { layerData, layerDatas } = storeToRefs(layerStore);

//로그인 처리
const login = async path => {
    await authStore.userAuthenticate();
    if (authenticated) {
        //언어설정
        const locale = currentLang.value?.id || 'ko';
        i18n.setLocale(locale);

        //메뉴설정 및 이동
        if (path == 'T') {
            await apiClassStore.getCourseId('teacher');
            await apiUserStore.getUser('teacher');
            await layerStore.setLayerData(teacherData, teacherMenuItems);
            await initLayer();
            useRouter().push('/eng/teacher');
        } else {
            await apiClassStore.getCourseId('student');
            await apiUserStore.getUser('student');
            await layerStore.setLayerData(studentData, studentMenuItems);
            await initLayer();
            useRouter().push('/eng/student');
        }
    }
};

const initLayer = async () => {
    //초기페이지(오늘의학습)
    if (layerData.value == null) {
        const init = layerDatas.value.find(e => e.id == 'class');
        layerStore.setLayerHeader(init);
        layerStore.setAddLayer(init.child);
    }
};
</script>
