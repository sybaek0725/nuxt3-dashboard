/*
TODO: 외부연동 - 화이트보드 템플릿 api 연동
@파일(Method): whboard.ts
@작성자: 
@작성일: 2024-01-02 14:51
@설명: api whboard store
*/
export const useApiWhboardStore = defineStore(
    'apiWhboard',
    () => {
        type Item = {
            idx: number; //번호
            title: string; //제목
            templateUrl: string | null; //이미지url
        };

        type Data = {
            data: Array<Item>;
        };

        const items = ref<Array<Item>>([]);
        const getItems = async (pageIndex: number, pageSize: number) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/etc/getTemplateList', {
                method: 'get',
                query: {
                    pageIndex: 1,
                    pageSize: 20
                }
            });
            if (data.value) {
                const datas = data.value as Data;
                items.value = [
                    {
                        templateUrl: null,
                        idx: 0,
                        title: '템플릿0'
                    },
                    ...datas.data
                ];
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
