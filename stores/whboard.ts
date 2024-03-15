/*
@파일(Method): whboard.ts
@작성자: seungju.kim
@작성일: 2023-12-04 17:24
@설명: 화면 메모 기능을 전역으로 관리
*/
export const useWhboardStore = defineStore(
    'whboard',
    () => {
        const isOpen = ref(false);

        const openWhboard = () => {
            isOpen.value = true;
        };
        const closeWhboard = () => {
            isOpen.value = false;
        };

        return {
            isOpen,
            openWhboard,
            closeWhboard
        };
    },
    {
        persist: true
    }
);
