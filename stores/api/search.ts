/*
TODO: 외부연동 - 콘텐츠 - 자료통합검색 api 연동
@파일(Method): search.ts
@작성자: 
@작성일: 2024-01-02 14:52
@설명: api search store
*/
export const useApiSearchStore = defineStore(
    'apiSearch',
    () => {
        type Item = {
            title: string; //제목
            servicePath: string; //url
            serviceThumbnailPath: string; //썸네일
            width: string; //가로
            height: string; //세로
            ratio: string; //비율
        };

        type Data = {
            data: Array<Item>;
        };

        const imagePaging = ref(1);
        const clipPaging = ref(1);
        const videoPaging = ref(1);
        const imageItems = ref<Array<Item>>([]);
        const clipItems = ref<Array<Item>>([]);
        const videoItems = ref<Array<Item>>([]);
        const getItems = async (type: string, pageIndex: number, pageSize: number, searchKeyword: string) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/etc/getErbankList', {
                method: 'get',
                query: {
                    type: type,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    searchKeyword: searchKeyword
                }
            });
            if (data.value) {
                const datas = data.value as Data;

                if (type == '10001') {
                    //사진
                    if (pageIndex > 1) {
                        imageItems.value = [...imageItems.value, ...datas.data];
                    } else {
                        imageItems.value = datas.data;
                    }
                } else if (type == '10011') {
                    //클립아트
                    if (pageIndex > 1) {
                        clipItems.value = [...clipItems.value, ...datas.data];
                    } else {
                        clipItems.value = datas.data;
                    }
                } else if (type == '10002') {
                    //동영상
                    if (pageIndex > 1) {
                        videoItems.value = [...videoItems.value, ...datas.data];
                    } else {
                        videoItems.value = datas.data;
                    }
                }
            }
        };

        return {
            imagePaging,
            clipPaging,
            videoPaging,
            imageItems,
            videoItems,
            clipItems,
            getItems
        };
    },
    {
        persist: true
    }
);
