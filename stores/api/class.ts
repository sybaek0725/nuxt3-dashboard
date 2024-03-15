/*
TODO: 반 정보 api 연동
@파일(Method): class.ts
@작성자: 
@작성일: 2023-11-28 00:18
@설명: api class store
*/
export const useApiClassStore = defineStore(
    'apiClass',
    () => {
        type Result = {
            data: object;
        };

        type Course = {
            teacherId: string;
            eduOfficeCode: string;
            courseId: string;
            result: string;
        };

        type Class = {
            id: string; //아이디
            name: string; //이름
            number: number; //번호
            profile: string; //사진
            pictures: string; //??
            micActive: boolean; //마이크사용여부
            soundActive: boolean; //스피커사용여부
            soundVolume: number; //스피커볼륨
            showSoundControls: boolean; //스피커컨트롤러
        };

        //courseId(clone)
        const courseId = ref('');
        const getCourseId = async (value: string) => {
            const url = 'https://aitextbookapi-stage.i-screammedia.com/fa/' + value + (value == 'student' ? '/course_check' : '/clone');
            const { data } = await useCustomFetch(url, {
                method: 'post',
                body: JSON.stringify({})
            });
            if (data.value) {
                const result = data.value as Result;

                if (value == 'student') {
                    courseId.value = (result.data as Array<Course>)[0].courseId;
                } else {
                    courseId.value = (result.data as Course).courseId;
                }
            }
        };

        //수업상태
        const classState = ref('ready');
        const setClassState = (value: string) => {
            classState.value = value;
        };

        //반 학생정보
        const classStudent = ref<Array<Class>>();
        const getClassStudent = async () => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/teacher/studentList', {
                method: 'get'
            });
            if (data.value) {
                const result = data.value as Result;
                classStudent.value = result.data as Array<Class>;

                //스피커 컨트롤러 초기화(false)
                classStudent.value.forEach(
                    e => ((e.showSoundControls = false), (e.profile = '/_nuxt/assets/images/temp/img_st_photo.png'))
                );
            }
        };
        const setClassStudent = async (value: Array<Class>) => {
            const { data } = await useCustomFetch('/teacher/student', {
                method: 'post',
                body: JSON.stringify(value)
            });
        };

        return {
            courseId,
            classState,
            classStudent,
            getCourseId,
            setClassState,
            getClassStudent,
            setClassStudent
        };
    },
    {
        persist: true
    }
);
