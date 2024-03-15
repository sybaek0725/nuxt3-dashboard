/*
TODO: 단원정보 api 연동
@파일(Method): course.ts
@작성자: 
@작성일: 2024-01-02 15:44
@설명: api course store
@수정: 콘텐츠 getContentsItem 전송 body 수정(juyoungkoo-24.02.28)
       getContentsItem api 연동 주소 수정(juyoungkoo-24.03.08)
*/
export const useApiCourseStore = defineStore(
    'apiCourse',
    () => {
        type ChapterItem = {
            chapterId: string; //단원ID
            chapterName: string; //단원명
            achievementCriterion: string; //성취기준
            teachingMethod: string; //지도방법
            curriculumChapterId: string; //단원ID
            teachingActivityType: string; // 교사 수업활동 유형 (01:진도학습, 03:수학익힘)
        };

        type PeriodItem = {
            periodId: number; //차시ID
            chapterId: string; //단원ID
            chapterName: string; //단원명
            periodType: string; //차시타입(MY:교사추가,EDIT:)
            periodStep: string; //차시번호
            periodName: string; //차시명
            textbookFilePath: string; //교과서 파일 경로
            textbookStartPage?: number; //교과서 시작 쪽수
            textbookEndPage?: number; //교과서 종료 쪽수
            tutorialStartPage?: number; //익힘책 시작 쪽수
            tutorialEndPage?: number; //익힘책 종료 쪽수
            studyGoal: string; //학습목표
            periodState?: string; //학습상태(done:수업완료)
            curriculumPeriodId: number; //차시ID
            lessonOwnerFlag: string; //차시타입(S:교사추가,A:)
            courseLessonId: string; // 진도학습-차시Id
            entry: string; // 수업활동 인입 type (진도학습 : progress, 수학익힘 : workbook)
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

        type ChapterData = {
            data: Array<ChapterItem>; //데이터
        };

        type PeriodData = {
            data: Array<PeriodItem>; //데이터
        };

        type Data = {
            totalCnt: number; //총건수
            data: Array<ContentsItem>; //데이터
            dataSize: number; //총건수
        };

        const { courseId } = storeToRefs(useApiClassStore());
        const { user } = storeToRefs(useApiUserStore());
        const type = useCookie('type');

        //단원
        const chapterItems = ref<Array<ChapterItem>>();
        const getChapterItems = async () => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/curriculum/chapters', {
                method: 'get'
            });
            console.log(data);
            if (data.value) {
                const response = data.value as ChapterData;
                chapterItems.value = response.data as Array<ChapterItem>;
            }
        };

        //차시
        const periodItems = ref<Array<PeriodItem>>();
        const getPeriodItems = async (value: ChapterItem) => {
            const { data } = await useCustomFetch(`https://aitextbookapi-stage.i-screammedia.com/fa/${user.value?.mode}/lesson_only`, {
                method: 'post',
                body: JSON.stringify({
                    courseId: courseId.value,
                    curriculumChapterId: value.curriculumChapterId,
                    metaType: type.value,
                    teachingActivityType: value.teachingActivityType
                })
            });
            if (data.value) {
                const response = data.value as PeriodData;
                periodItems.value = response.data as Array<PeriodItem>;
            }
        };
        const setPeriodItem = async (value: PeriodItem) => {
            const { status } = await useCustomFetch('/course/period', {
                method: 'post',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setPeriodUpdateItem = async (value: PeriodItem) => {
            const { status } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/update/lesson', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };
        const setPeriodDeleteItem = async (value: PeriodItem) => {
            const { status } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/fa/delete/lesson', {
                method: 'delete',
                body: JSON.stringify(value)
            });

            return { status };
        };

        //콘텐츠
        const contentsTotalCnt = ref(0);
        const contentsItems = ref<Array<ContentsItem>>();
        const contentsItem = ref<ContentsItem>();
        const getContentsItems = async (value: ContentsItem) => {
            const { data } = await useCustomFetch(`https://aitextbookapi-stage.i-screammedia.com/fa/${user.value?.mode}/lesson/content`, {
                method: 'post',
                body: JSON.stringify({
                    ...value,
                    teachingActivityType: '01'
                })
            });
            if (data.value) {
                const response = data.value as Data;
                contentsItems.value = response.data as Array<ContentsItem>;
                contentsTotalCnt.value = response.dataSize;
            }
        };
        const setContentsUpdateItems = async (period: PeriodItem, value: Array<ContentsItem>) => {
            const data = {
                periodId: period.periodId,
                periodStep: period.periodStep,
                data: value
            };
            const { status } = await useCustomFetch('/course/contents', {
                method: 'put',
                body: JSON.stringify(data)
            });

            return { status };
        };
        const getContentsItem = async (period: PeriodItem, currentPage: number) => {
            const teachingActivityType = period.entry === 'progress' ? '01' : '03'; // 01: 진도학습, 03:수학익힘
            const { data } = await useCustomFetch(
                `https://aitextbookapi-stage.i-screammedia.com/fa/${user.value?.mode}/lesson/content_detail`,
                {
                    method: 'post',
                    body: JSON.stringify({
                        metaType: type.value,
                        courseLessonId: period.courseLessonId,
                        teachingActivityType: teachingActivityType
                    })
                }
            );
            if (data.value) {
                const response = data.value as Data;
                const contentsItems = response.data as Array<ContentsItem>;
                contentsTotalCnt.value = response.dataSize;

                if (contentsItems.length > 0) {
                    contentsItem.value = contentsItems.find(e => e.contentOrder == currentPage);
                }
            }
        };
        const setContentsUpdateItem = async (value: ContentsItem) => {
            const { status } = await useCustomFetch('/course/contents', {
                method: 'put',
                body: JSON.stringify(value)
            });

            return { status };
        };

        return {
            chapterItems,
            periodItems,
            contentsItems,
            contentsItem,
            contentsTotalCnt,
            getChapterItems,
            getPeriodItems,
            setPeriodItem,
            setPeriodUpdateItem,
            setPeriodDeleteItem,
            getContentsItems,
            setContentsUpdateItems,
            getContentsItem,
            setContentsUpdateItem
        };
    },
    {
        persist: true
    }
);
