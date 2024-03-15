/*
@파일(Method): hidden.ts
@작성자: LEE
@작성일: 2023-11-28 00:15
@설명: auth store
*/
export const useHiddenStore = defineStore(
    'hidden',
    () => {
        const hiddenState = ref<boolean>(false);
        const hiddenMode = ref<string>('');
        const setHidden = async (state: boolean, mode: string) => {
            hiddenState.value = state;
            hiddenMode.value = mode;
        };

        return {
            hiddenState,
            hiddenMode,
            setHidden
        };
    },
    {
        persist: true
    }
);
