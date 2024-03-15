/*
TODO: AI 추천 api 연동
@파일(Method): aicontents.ts
@작성자: 
@작성일: 2024-01-10 17:07
@설명: api ai contents store
*/
export const useApiAiContentsStore = defineStore(
    'apiAiContents',
    () => {
        type Item = {
            contentsInfo: string; //제목
            contentsThumbnail: string; //썸네일
        };

        const items = ref<Array<Item>>([]);
        const getItems = async () => {
            const { data } = await useCustomFetch('/course/aicontents', {
                method: 'get'
            });
            if (data.value) {
                items.value = data.value as Array<Item>;
            }
        };

        return {
            items,
            getItems
        };
    },
    {
        persist: true
    }
);
