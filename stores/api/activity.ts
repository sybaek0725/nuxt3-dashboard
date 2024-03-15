/*
TODO: 모둠/학습활동 api 연동
@파일(Method): activity.ts
@작성자: 
@작성일: 2024-01-03 16:49
@설명: api activity store
*/
export const useApiActivityStore = defineStore(
    'apiActivity',
    () => {
        type GroupStudent = {
            studentId: string; //학생ID
            prePresenterFlag?: boolean; //발표자여부
            RealPresenterFlag?: boolean; //최종발표자여부
            mainDeviceFlag?: string; //대표기기여부
            id?: string;
        };

        type Group = {
            groupId: number; //모둠ID
            contentsId: number; //콘텐츠ID
            contentsNumber: number; //콘텐츠번호
            groupNumber: number; //모둠번호
            groupState?: boolean; //모둠활동완료여부
            praiseFeedback?: string; //모둠칭찬피드백
            presentationOrder?: number; //발표순서
            groupActivityTypeCd?: string; //활동유형(누리집,컨텐츠,화이트보드)
            groupActivityContext?: string; //활동내용
            mainDevice?: string; //대표기기학생ID
            student?: Array<GroupStudent>; //학생정보
        };

        type LearnItem = {
            learnId: number; //학습활동ID
            contentsId: number; //콘텐츠ID
            contentsNumber: number; //콘텐츠번호
            studentId: string; //학생ID
            name?: string; //학생ID
            number?: number; //학생번호
            profile?: string; //학생프로필
            presenterFlag?: boolean; //발표자여부
            answer?: string; //답변
        };

        type ContentsItem = {
            contentsId: number; //콘텐츠ID
            periodId: number; //차시ID
            periodStep: string; //차시번호
            contentsKind: string; //콘텐츠종류(image:이미지) //contentType?: number; //콘텐츠유형(문항,활동,영상,보탬,스킨,코드)
            contentsNumber: number; //콘텐츠번호
            contentOwnerFlag?: string; //콘텐츠구분(s:자체생성,a:교과서)
            contentOrder?: number; //콘텐츠순서
            contentsInfo?: string; //콘텐츠소개
            contentsThumbnail?: string; //콘텐츠썸네일
            teacherContentsMetaId?: string; //교사용콘텐츠 메타Id
            studentContentsMetaId?: string; //학생용콘텐츠 메타Id
            teacherContentsMeta?: string; //교사용콘텐츠 메타임시용
            studentContentsMeta?: string; //학생용콘텐츠 메타임시용
            questionCount?: number; //문항개수
            learningStageCd?: string; //학습단계(01 도입(introduction), 02:전개(development), (03:활동(activities)), 04:정리(conclusion), 05:평가(assessment))
            textbookPage?: string; //교과서쪽
            groupActivityFlag?: boolean; //모둠활동여부
            groupActivityState?: string; //모둠활동상태(1:활동준비,2:활동중,3:활동완료)
            learnActivityFlag?: boolean; //학습활동여부
            learnActivityType?: string; //학습활동타입(descriptive:서술형,image:이미지형,choice객관식형)
        };

        const userId = useCookie('userId');
        const { contentsItem } = storeToRefs(useApiCourseStore());

        //모듬활동
        const groupItems = ref<Array<Group>>();
        const getGroupItems = async (contentsId: number, contentsNumber: number) => {
            //모둠전체조회(학생포함)
            const { data } = await useCustomFetch('/course/group', {
                method: 'get',
                query: {
                    contentsId: contentsId,
                    contentsNumber: contentsNumber
                }
            });
            if (data.value) {
                groupItems.value = data.value as Array<Group>;
            }
        };
        const setGroupItems = async (contentsId: number, contentsNumber: number, count: number) => {
            //모둠전체등록(학생초기화)-교사:모둠 만들기
            const { status } = await useCustomFetch('/course/group', {
                method: 'post',
                body: JSON.stringify({
                    contentsId: contentsId,
                    contentsNumber: contentsNumber,
                    count: count
                })
            });

            //서버단에서 처리시 삭제 - 콘텐츠 모둠활동 상태 변경
            if (status.value == 'success') {
                const data = contentsItem.value as ContentsItem;
                data.groupActivityState = '1'; //활동준비
                await useApiCourseStore().setContentsUpdateItem(data);
            }

            return { status };
        };
        const setGroupDeleteItems = async (contentsId: number, contentsNumber: number) => {
            //모둠전체삭제(학생포함)-교사:모둠 만들기 취소
            const { status } = await useCustomFetch('/course/group', {
                method: 'delete',
                body: JSON.stringify({
                    contentsId: contentsId,
                    contentsNumber: contentsNumber
                })
            });

            //서버단에서 처리시 삭제 - 콘텐츠 모둠활동 상태 변경
            if (status.value == 'success') {
                const data = contentsItem.value as ContentsItem;
                data.groupActivityState = '0'; //활동대기
                await useApiCourseStore().setContentsUpdateItem(data);
            }

            return { status };
        };
        const setGroupUpdateItems = async (value: Array<Group>) => {
            //모둠전체수정(학생포함)-교사:모둠 구성 전송 버튼
            const { status } = await useCustomFetch('/course/group', {
                method: 'put',
                body: JSON.stringify(value)
            });

            //서버단에서 처리시 삭제 - 콘텐츠 모둠활동 상태 변경
            if (status.value == 'success') {
                const data = contentsItem.value as ContentsItem;
                data.groupActivityState = '2'; //활동중
                await useApiCourseStore().setContentsUpdateItem(data);
            }

            return { status };
        };
        const setGroupUpdateItem = async (group: Group, item: GroupStudent) => {
            //서버단에서 처리시 삭제 - 모둠학생 정보 가공
            await getGroupItems(group.contentsId, group.contentsNumber);
            const value = groupItems.value?.find(e => e.groupId == group.groupId) as Group;
            value.mainDevice = group.mainDevice; //대표기기
            value.presentationOrder = group.presentationOrder; //발표순서
            value.praiseFeedback = group.praiseFeedback; //칭찬피드백
            value.groupActivityTypeCd = group.groupActivityTypeCd; //활동유형
            value.groupActivityContext = group.groupActivityContext; //활동내용

            if (item != null) {
                const student = value?.student || [];
                const temp = student.filter(e => e.studentId != item.studentId) || [];
                temp.push(item);
                value.student = temp;
            }

            //모둠개별수정(학생포함)-학생모둠선택,학생발표자,칭찬피드백
            const { status } = await useCustomFetch('/course/group', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };

        //학습활동
        const learnItems = ref<Array<LearnItem>>();
        const getLearnItems = async (contentsId: number, contentsNumber: number) => {
            const { data } = await useCustomFetch('/course/learn', {
                method: 'get',
                query: {
                    contentsId: contentsId,
                    contentsNumber: contentsNumber
                }
            });
            if (data.value) {
                learnItems.value = data.value as Array<LearnItem>;
            }
        };
        const setLearnItem = async (value: LearnItem) => {
            const { status } = await useCustomFetch('/course/learn', {
                method: 'post',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setLearnUpdateItem = async (value: LearnItem) => {
            const { status } = await useCustomFetch('/course/learn', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setLearnDeleteItem = async (value: LearnItem) => {
            const { status } = await useCustomFetch('/course/learn', {
                method: 'delete',
                body: JSON.stringify(value)
            });

            return { status };
        };

        return {
            groupItems,
            learnItems,
            getGroupItems,
            setGroupDeleteItems,
            setGroupUpdateItems,
            setGroupItems,
            setGroupUpdateItem,
            getLearnItems,
            setLearnItem,
            setLearnUpdateItem,
            setLearnDeleteItem
        };
    },
    {
        persist: true
    }
);
