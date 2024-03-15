/*
TODO: 환경설정 정보 API 연동
@파일(Method): setting.ts
@작성자: 
@작성일: 2023-12-19 09:00
@설명: api setting store
*/
export const useApiSettingStore = defineStore(
    'apiSetting',
    () => {
        type BasicItem = {
            id: string; //사용자ID
            profileActive: boolean; //프로필사용여부
            profile?: string; //프로필사진url
            micVolume: number; //마이크볼륨
            soundVolume: number; //스피카볼륨
            isamActive1?: boolean; //교사-아이쌤사용여부1
            isamActive2?: boolean; //교사-아이쌤사용여부1
            ivActive1?: boolean; //교사-아이비사용여부1
            ivActive2?: boolean; //교사-아이비사용여부2
            alarmActive?: boolean; //교사-학생입장알림사용여부
            alarmTime?: number; //교사-학생입장알림시간
            frameColor?: string; //학생-프레임색상
        };

        type MenuItem = {
            id: string; //메뉴ID
            text: string; //메뉴명
            useYn: boolean; //사용여부
        };

        type LangItem = {
            id: string; //언어ID
            name: string; //언어명
            useYn: boolean; //사용여부
        };

        type menuData = {
            teacher: Array<MenuItem>; //교사메뉴
            student: Array<MenuItem>; //학생메뉴
        };

        const userId = useCookie('userId');

        //기본정보/수업관리/알림설정
        const basicItem = ref<BasicItem>();
        const getBasicItem = async (role: string) => {
            const { data } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/' + role + '/basicSetting', {
                method: 'get',
                query: {
                    id: userId
                }
            });
            if (data.value) {
                basicItem.value = data.value as BasicItem;
            }
        };
        const setBasicItem = async (value: BasicItem) => {
            return await useCustomFetch('/setting/basic', {
                method: 'put',
                body: JSON.stringify(value)
            });
        };

        //메뉴관리
        const teacherMenuItems = ref<Array<MenuItem>>();
        const studentMenuItems = ref<Array<MenuItem>>();
        const getMenuItems = async (role: string) => {
            const { data } = await useCustomFetch('/setting/' + role + '/menu', {
                method: 'get'
            });
            if (data.value) {
                const response = data.value as menuData;
                teacherMenuItems.value = response.teacher;
                studentMenuItems.value = response.student;
            }
        };
        const setMenuItems = async (teacher: MenuItem, student: MenuItem, role: string) => {
            return await useCustomFetch('/setting/' + role + '/menu', {
                method: 'post',
                body: JSON.stringify({
                    teacher: teacher,
                    student: student
                })
            });
        };

        //언어설정
        const languageItems = ref<Array<LangItem>>();
        const currentLang = ref<LangItem>();
        const getLongItems = async () => {
            const { data } = await useCustomFetch('/setting/lang', {
                method: 'get'
            });
            if (data.value) {
                languageItems.value = data.value as Array<LangItem>;

                //현재 설정 언어
                currentLang.value = languageItems.value.find(e => e.useYn == true);
            }
        };
        const setLongItems = async (value: LangItem) => {
            const { status } = await useCustomFetch('/setting/lang', {
                method: 'post',
                body: JSON.stringify(value)
            });

            return { status };
        };

        return {
            basicItem,
            teacherMenuItems,
            studentMenuItems,
            languageItems,
            currentLang,
            getBasicItem,
            setBasicItem,
            getMenuItems,
            setMenuItems,
            getLongItems,
            setLongItems
        };
    },
    {
        persist: true
    }
);
