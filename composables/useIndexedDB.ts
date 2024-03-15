/*
@파일(Method): useIndexedDB.ts
@작성자: LEE
@작성일: 2023-12-27 18:05
@설명: indexedDB 사용
*/
export const useIndexedDB = (name: string /* DB명 */, key: string) => {
    onMounted(() => getItem());

    const localForage = useCustomLocalForage(name);
    const items = ref<Array<object>>([]);
    const getItem = async () => {
        items.value = await localForage.getItem(key).then(value => {
            return JSON.parse(value as string) || [];
        });
    };
    const setItem = (value: Array<object>) => {
        localForage.setItem(key, JSON.stringify(value));
    };
    const removeItem = () => {
        localForage.removeItem(key);
    };

    return {
        items,
        getItem,
        setItem,
        removeItem
    };
};
