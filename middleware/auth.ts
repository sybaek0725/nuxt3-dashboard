/*
@파일(Method): auth.ts
@작성자: LEE
@작성일: 2023-11-29 11:21
@설명: router auth check
*/
export default defineNuxtRouteMiddleware((to, from) => {
    const { authenticated } = storeToRefs(useAuthStore());
    const token = useCookie('token');
    const returnUrl = to?.path.split('/')[1];

    console.log('From auth middleware', token.value);

    if (token.value) {
        authenticated.value = true;
    }

    if (!token.value) {
        return navigateTo(`/${returnUrl}`);
    }
});
