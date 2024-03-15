/*
@파일(Method): useCustomLocalForage.ts
@작성자: LEE
@작성일: 2023-11-29 11:14
@설명: useFetch instance setting
*/
export const useCustomLocalForage = (name: string) => {
    const localForage = useLocalForage();
    const indexedDb = localForage.createInstance({
        driver: localForage.INDEXEDDB,
        name: name,
        version: 1.0,
        size: 4980736,
        storeName: 'keyvaluepairs',
        description: 'description'
    });

    return indexedDb;
};
