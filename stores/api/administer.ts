/*
TODO: 사진 과제 API 연동
@파일(Method): administer.ts
@작성자: 서동건
@작성일: 2024-02-21 15:07
@설명: api administer store
*/
export const useApiAdministerStore = defineStore(
    'apiAdminister',
    () => {
        const { getCdnUrl } = useApiCdnUploadStore();
        type Item = {
            problemDueDate?: string; //과제 제출 예정일자
            problemsetId?: string; //과제 ID
            problemUrl?: string; //과제주소
            isCnfStamp?: string; //확인도장여부
            submitTypeCode?: string; //과제제출 타입코드("02")
            ismotiv?: string; //독려여부
            problemPlanStartDt?: string; //과제시작날짜
            problemPlanEndDt?: string; //과제종료날짜
            problemName?: string; //과제제목
            isSubmit?: string; //제출여부(0 : 미제출 ,1:제출)
        };
        type detailItems = {
            stdt?: string; //과제기간시작
            eddt?: string; //과제기간종료
            problemsetNm?: string; //과제제목
            doneCnt?: string; //과제제출학생수
            studentId?: string; //학생아이디
            problemThumbnailUrl?: string; //과제썸네일 주소
            problemUrl?: string; // 과제주소
            isCnfStamp?: string; // 확인도장 유무
            is_motiv?: string; // 독려여부
            nDoneCnt?: string; //과제미제출학생수
        };
        type calendarItems = {
            doneCnt: string; //과제제출학생 수
            isNotDone: string;
            nDoneCnt: string; //과제미제출학생 수
            problemDueDate: string; //과제제출예정일자
            problemSetId: string; // 과제아이디
            totCnt: string; // 총과제수
        };
        type itemData = {
            data: Array<Item>;
            dataSize: number;
        };

        type detailData = {
            data: Array<detailItems>; //데이터
            dataSize: number; //총건수
        };
        type calendarData = {
            data: Array<calendarItems>; //데이터
            dataSize: number; //총건수
        };

        const detailSize = ref(0);
        const detailItem = ref<Array<detailItems>>();
        // 선생님 - 사진과제 상세(일자)
        const getItem = async (value: detailItems) => {
            const { data, error } = await useCustomFetch(
                'https://aitextbookapi-stage.i-screammedia.com/fa/tproblem/schedule/statusDetail',
                {
                    method: 'post',
                    body: JSON.stringify(value)
                }
            );
            if (data.value) {
                const response = data.value as detailData;
                detailItem.value = response.data;
                detailSize.value = response.dataSize;
            } else {
                detailItem.value = [];
                detailSize.value = 0;
            }
        };
        const calendarSize = ref(0);
        const calendarItem = ref<Array<calendarItems>>();
        //선생님 - 사진과제 캘린더 제출여부, 미제출 리스트
        const getCalendar = async (value: calendarItems) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/tproblem/schedule/statusIsDone ', {
                method: 'post',
                body: JSON.stringify(value)
            });
            if (data.value) {
                const response = data.value as calendarData;
                calendarItem.value = response.data;
                calendarSize.value = response.dataSize;
            } else {
                calendarItem.value = [];
                calendarSize.value = 0;
            }
        };
        // //선생님 - 독려 메시지 보내기
        // const getMessage = async () => {
        //     const { date } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/tproblem/schedule/sndMotivMsg', {
        //         method: 'post',
        //         body: JSON.stringify({})
        //     });
        // };
        const assignmentItems = ref<Array<Item>>();
        const dataSize = ref(0);
        //학생 - 사진과제 본인의과제현황 보여주기
        const getStudentSchedule = async (value: Item) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/tproblem/studentSchedule/status', {
                method: 'post',
                body: JSON.stringify(value)
            });
            if (data.value) {
                const response = data.value as itemData;
                assignmentItems.value = response.data;
                dataSize.value = response.dataSize;
            } else {
                assignmentItems.value = [];
                dataSize.value = 0;
            }
        };

        //학생- 사진과제 저장하기
        const setStudentScheduleSubmit = async (value: Item) => {
            let itemData: any = {};
            if (value.problemUrl) {
                const byteCharacters = atob((value.problemUrl as any).split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);

                const blob = new Blob([byteArray], { type: 'image/png' });
                const file = new File([blob], value.problemName as any, { type: 'image/png' });

                const url = await getCdnUrl(file);

                itemData = {
                    ...value,
                    problemUrl: url?.filename
                };
            }

            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/tproblem/studentSchedule/submit', {
                method: 'post',
                body: JSON.stringify(itemData)
            });
            return data;
        };

        return {
            assignmentItems,
            detailSize,
            detailItem,
            calendarItem,
            calendarSize,
            getItem,
            getStudentSchedule,
            setStudentScheduleSubmit,
            getCalendar
        };
    },
    {
        persist: true
    }
);
