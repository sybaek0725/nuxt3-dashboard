/*
TODO: 교사/학생 정보 API 연동
@파일(Method): user.ts
@작성자: 
@작성일: 2024-01-12 14:07
@설명: api user store
*/
export const useApiUserStore = defineStore(
    'apiUser',
    () => {
        type Result = {
            data: object;
        };

        type Item = {
            teacherId: string;
            studentId: string;
            originalId: string;
            name: string;
            role: string;
            grade: number;
            classNum: number;
            schoolId: string;
            schoolName: string;
            eduOfficeCode: string;
            classId: string;
            soundVolume?: number;
            mode?: string; //구분(교사:teacher,학생:student)
            subject?: string; //과목(수학:math,영어:eng)
            room?: string; //webRtc room 네임스페이스
            classInfo: {
                classId?: string;
            }; //반정보
        };

        const user = ref<Item>();
        const getUser = async (value: string) => {
            //https://aitextbookapi-stage.i-screammedia.com
            const { data, error } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/' + value, {
                method: 'get'
            });
            if (error.value) throw error.value;
            if (data.value) {
                const result = data.value as Result;
                user.value = result.data as Item;

                //id 저장
                const userId = useCookie('userId');
                if (value == 'teacher') {
                    userId.value = user.value.teacherId;
                } else {
                    userId.value = user.value.studentId;
                }

                //과목(수학/영어)
                const subject = useCookie('subject');
                user.value.subject = subject.value as string;

                //구분(교사/학생)
                user.value.mode = value;

                //임시용
                const room = useCookie('room');
                if (useRuntimeConfig().public.socketRoom == 'no') {
                    user.value.room = room.value as string;
                } else {
                    user.value.room = user.value.classInfo.classId as string;
                    room.value = user.value.room;
                }
            }
        };

        return {
            user,
            getUser
        };
    },
    {
        persist: true
    }
);
