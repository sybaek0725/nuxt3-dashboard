import { webrtc } from '@/lib/webrtc.js';

export const useTeacherWebRTC = () => {
    //사용자
    const { user } = storeToRefs(useApiUserStore());

    //레이어
    const layerStore = useLayerStore();

    //webRtc
    const webRtcStore = useWebRtcStore();
    const { userPeerList, userWhboardList } = storeToRefs(webRtcStore);

    //접속
    const connect = () => {
        const room = useCookie('room');
        const userId = useCookie('userId');
        webrtc.connect(room.value, userId.value, 'admin', callback);
    };

    //종료
    const disconnect = () => {
        webrtc.disconnect();
    };

    //응답
    const callback = (type: string, data: any) => {
        console.log(type, data);

        switch (type) {
            case 'issuedUserId': //id set
                webRtcStore.setUserInfo({
                    id: data,
                    userId: user.value?.teacherId,
                    userName: user.value?.name,
                    userType: 'admin'
                });
                break;
            case 'connected':
            case 'offer connected': //student Entry
                webRtcStore.setUserPeerList('entry', data);
                break;
            case 'closed':
            case 'offer closed': //student Exit
                webRtcStore.setUserPeerList('exit', data);
                break;
            case 'message':
                message(data);
                break;
            default:
                break;
        }
    };

    //메시지
    const message = (data: any) => {
        //이력 저장
        webRtcStore.setUserMessage(data);

        const type = data.message.type;
        switch (data.action) {
            case 'MonitoringAction': //모니터링
                webRtcStore.setUserMonitoringList(data);
                break;
            case 'ExternalAction': //외부연동
                if (type == 'whboard') {
                    webRtcStore.setUserWhboardList(data); //화이트보드
                }
                break;
            case 'LearnActivityAction': //학습활동
                if (type == 'submit') {
                    //활동 제출
                    webRtcStore.setUserLearnList(data); //학습활동(이미지형)
                }
                break;
            default:
                break;
        }
    };

    //메시지전송(user만)
    const sendMessage = (action: string, message: object, to: object) => {
        webrtc.sendMessage(
            {
                key: Date.now(),
                mode: 'teacher',
                from: webRtcStore.getUserInfo(),
                to: to,
                action: action,
                message: message
            },
            to
        );
    };

    //메시지전송(전체)
    const sendMessageAll = (action: string, message: object) => {
        if (message == undefined) message = {};

        webrtc.sendMessageAll({
            key: Date.now(),
            mode: 'teacher',
            from: webRtcStore.getUserInfo(),
            to: null,
            action: action,
            message: message
        });
    };

    //화면공유
    const sendDisplayshare = async (action: string, message: object) => {
        const socketData = {
            key: Date.now(),
            mode: 'teacher',
            from: webRtcStore.getUserInfo(),
            to: null,
            action: action,
            message: message
        };

        await webrtc.displayShare(socketData);
    };

    return { connect, disconnect, sendMessage, sendMessageAll, sendDisplayshare, userPeerList, userWhboardList };
};
