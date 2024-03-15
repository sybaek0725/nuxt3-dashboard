/*
@파일(Method): webrtc.ts
@작성자: LEE
@작성일: 2023-11-28 00:17
@설명: 
*/
export const useWebRtcStore = defineStore(
    'webRtc',
    () => {
        type Info = {
            id: string; //peer id
            userType: string; //구분(admin:교사, user:학생)
            userId: string | undefined; //아이디
            userName: string | undefined; //이름
            [key: string]: any;
        };

        type Message = {
            [key: string]: any;
        };

        const userInfo = ref<Info>();
        const teacherInfo = ref<Info>();
        const userMessage = ref<Array<Message>>([]); //메시지이력
        const userPeerList = ref<Array<Info>>([]); //학생접속목록
        const userWhboardList = ref<Array<Message>>([]); //화이트보드활동목록
        const userLearnList = ref<Array<Message>>([]); //학습활동(이미지형)목록
        const userDisplayShare = ref(false); //화면공유여부

        const teacherWebRTC = useTeacherWebRTC();
        const studentWebRTC = useStudentWebRTC();

        const { classState } = storeToRefs(useApiClassStore());

        const getUserInfo = () => {
            return userInfo.value;
        };

        const setUserInfo = (data: Info) => {
            userInfo.value = data;
        };

        const getTeacherInfo = () => {
            return teacherInfo.value;
        };

        const setTeacherInfo = (data: Info) => {
            teacherInfo.value = data;
        };

        const setUserMessage = (data: Message) => {
            userMessage.value.push(data);
        };

        const setUserPeerList = (type: string, data: Info) => {
            if (type == 'entry') {
                userPeerList.value = userPeerList.value.filter(e => e.userId != data.userId);
                userPeerList.value.push(data);
            } else if (type == 'exit') {
                userPeerList.value = userPeerList.value.filter(e => e.userId != data.userId);
            }
        };

        const setUserMonitoringList = (data: Message) => {
            userPeerList.value.filter(e => e.id == data.from.id).forEach(e => (e.monitoringImg = data.message.img));
        };

        const setUserWhboardList = (data: Message) => {
            userWhboardList.value = userWhboardList.value.filter(e => e.studentId != data.from.userId);
            userWhboardList.value.push(data.message.data);
        };

        const setUserLearnList = (data: Message) => {
            const resultObj = data.message.data?.userItem;
            resultObj.answerShow = false; //결과물노출여부
            userLearnList.value.push(resultObj); //제출한순서대로정렬
        };

        const setDisplayShare = (data: boolean) => {
            userDisplayShare.value = data;
        };

        const setSendMessage = (type: string, to: any, action: string, message: any) => {
            console.log(type, action, message);

            const user = userInfo.value as Info;
            let isSend = false;

            //화면공유
            if (action == 'DisplayShareAction') {
                teacherWebRTC.sendDisplayshare(action, message);
                return false;
            }

            //수업상태,화면가리기,모니터링
            if (action == 'ClassAction' || (action == 'ControlAction' && message.data != 'wait') || action == 'MonitoringAction') {
                isSend = true;
            } else {
                //수정중에만 전송
                if (classState.value == 'proceeding') {
                    isSend = true;
                }
            }

            if (isSend) {
                if (type == 'teacher') {
                    if (to == 'all') {
                        teacherWebRTC.sendMessageAll(action, message);
                    } else {
                        teacherWebRTC.sendMessage(action, message, to);
                    }
                } else {
                    studentWebRTC.sendMessage(action, message);
                }
            }
        };

        return {
            teacherInfo,
            userMessage,
            userPeerList,
            userWhboardList,
            userLearnList,
            userDisplayShare,
            getUserInfo,
            setUserInfo,
            getTeacherInfo,
            setTeacherInfo,
            setUserMessage,
            setUserPeerList,
            setUserMonitoringList,
            setUserWhboardList,
            setUserLearnList,
            setDisplayShare,
            setSendMessage
        };
    },
    {
        persist: true
    }
);
