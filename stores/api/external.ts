/*
TODO: 외부 자료 연동 API 연동
@파일(Method): reference.ts
@작성자: 
@작성일: 2024-01-02 15:07
@설명: api reference store
*/
export const useApiExternalStore = defineStore(
    'apiExternal',
    () => {
        type Item = {
            teachingMeterialsId?: number; //수업자료콘텐츠ID
            materialName: string; //자료명
            subjectId?: string; //과목ID
            subjectName?: string; //과목명
            chapterId?: string; //단원ID
            chapterName?: string; //단원명
            periodId?: number; //차시ID
            periodStep?: string; //차시번호??
            periodName?: string; //차시명
            materialTypeCode: string; //자료유형(누리집:nuri,콘텐츠:contents,화이트보드:whboard)
            kofContent: string; //콘텐츠종류(pdf,image,www,ppt,word,excel,hwp)
            materialSize?: number; //콘텐츠사이즈
            materialStoreUrl: string; //콘텐츠url
            sendToStudentFlag?: string; //전송여부(Y:전송,N:미전송)
            createdDate?: string; //생성일
            createdBy?: string; //생성자
            lastModifiedDate?: string; //수정일
            lastModifiedBy?: string; //수정자
            grade?: string; //학년
            semester?: string; //학기
            curriculumSubjectId: number;
            curriculumChapterId: number;
            curriculumPeriodId: number;
            materialId: string;
        };

        type Search = {
            chapter: String; //단원
            period: String; //차시
            search: String; //검색어
        };

        type Data = {
            totalCnt: number; //총건수
            data: Array<Item>; //데이터
            dataSize: number; //총건수
        };

        const userId = useCookie('userId');
        const totalCnt = ref(0);
        const items = ref<Array<Item>>();
        const item = ref<Item>();
        const getItems = async (value: Item) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/teacher/material', {
                method: 'post',
                body: JSON.stringify(value)
            });
            if (data.value) {
                const response = data.value as Data;
                items.value = response.data;
                totalCnt.value = response.dataSize;
            }
        };
        const getItem = async (value: number) => {
            const { data } = await useCustomFetch('/reference', {
                method: 'get',
                query: {
                    id: value
                }
            });
            if (data.value) {
                item.value = data.value as Item;
            }
        };
        const setItem = async (value: Item) => {
            const { status } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/update/material', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setUpdateItem = async (value: Item) => {
            const { status } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/update/material', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setDeleteItem = async (value: Item) => {
            const { status } = await useCustomFetch('/reference', {
                method: 'delete',
                body: JSON.stringify(value)
            });

            return { status };
        };

        return {
            totalCnt,
            items,
            item,
            getItems,
            getItem,
            setItem,
            setUpdateItem,
            setDeleteItem
        };
    },
    {
        persist: true
    }
);
