/*
TODO: 인증 토큰 연동 예정
@파일(Method): auth.ts
@작성자: LEE
@작성일: 2023-11-28 00:15
@설명: auth store
*/
export const useAuthStore = defineStore('auth', () => {
    const config = useRuntimeConfig();
    const authenticated = ref(false);

    const userAuthenticate = async () => {
        authenticated.value = true;
    };
    const userLogin = () => {
        window.location.href = config.public.loginUrl + window.location.href;
    };
    const userLogout = () => {
        const token = useCookie('token');
        const type = useCookie('type');
        const userId = useCookie('userId');
        const homeUrl = '//' + window.location.host; //config.public.homeUrl

        token.value = null;
        type.value = null;
        userId.value = null;
        authenticated.value = false;

        window.location.href = config.public.logoutUrl + homeUrl;
    };

    return {
        authenticated,
        userAuthenticate,
        userLogin,
        userLogout
    };
});
