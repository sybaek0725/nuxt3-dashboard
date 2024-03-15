/*
@파일(Method): error.handler.ts
@작성자: LEE
@작성일: 2023-11-29 11:22
@설명: error handler
*/
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.log(error);
    };

    // Also possible
    nuxtApp.hook('vue:error', (error, instance, info) => {
        console.log(error);
    });
});
