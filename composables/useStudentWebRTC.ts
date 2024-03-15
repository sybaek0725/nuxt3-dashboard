import { webrtc } from '@/lib/webrtc.js';

export const useStudentWebRTC = () => {
    //사용자
    const apiUserStore = useApiUserStore();
    const { user } = storeToRefs(apiUserStore);

    //클래스
    const apiClassStore = useApiClassStore();
    const { classState } = storeToRefs(apiClassStore);

    //레이어
    const layerStore = useLayerStore();
    const { layerData, layerDatas } = storeToRefs(layerStore);

    //화면가리기
    const hiddenStore = useHiddenStore();
    const { hiddenState, hiddenMode } = storeToRefs(hiddenStore);

    //webRtc
    const webRtcStore = useWebRtcStore();
    const { userDisplayShare } = storeToRefs(webRtcStore);

    //접속
    const connect = () => {
        const room = useCookie('room');
        const userId = useCookie('userId');
        webrtc.connect(room.value, userId.value, 'user', callback);

        //화면공유
        webrtc.addStreamChanged((stream: any) => {
            if (userDisplayShare.value) {
                layerStore.setAddLayer('display.share', { displayShare: stream });
            }
        });
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
                    userId: user.value?.studentId,
                    userName: user.value?.name,
                    userType: 'user'
                });
                break;
            case 'connected':
            case 'offer connected': //teacher entry
                webRtcStore.setTeacherInfo(data);
                break;
            case 'closed': //teacher re-entry
                webRtcStore.setTeacherInfo(data);
                break;
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
        //화면가리기 초기화
        if (data.action == 'ControlAction' && data.message.type == 'screen' && data.message.data == 'hidden') {
            if (hiddenState.value && hiddenMode.value == 'hidden') {
                hiddenStore.setHidden(false, '');
                return true;
            }
        } else {
            hiddenStore.setHidden(false, '');
        }

        //이력 저장
        webRtcStore.setUserMessage(data);

        const type = data.message.type;
        switch (data.action) {
            case 'ClassAction': //수업상태
                classState.value = data.message.state;

                if (type == 'start') {
                    //진도학습 설정
                    const init = layerDatas.value.find(e => e.id == 'class');
                    if (init) {
                        layerStore.setLayerHeader(init);
                        layerStore.setAddLayer(init.child as string, {});
                    }

                    //수업시작-대기화면
                    hiddenStore.setHidden(true, 'wait');
                } else if (type == 'end') {
                    //수업종료
                } else if (type == 'wait') {
                    //수업대기
                }

                break;
            case 'ControlAction': //디바이스 제어
                if (type == 'sound') {
                    //음향
                    if (user.value) {
                        user.value.soundVolume = data.message.data;
                    }
                } else if (type == 'screen') {
                    //화면가리기(hidden),대기(wait),집중(focus)
                    hiddenStore.setHidden(true, data.message.data);
                }

                break;
            case 'DisplayShareAction': //화면공유
                if (data.message == 'off') {
                    webRtcStore.setDisplayShare(false);
                    layerStore.setDeleteLayer('display.share');
                } else {
                    webRtcStore.setDisplayShare(true);
                }
                break;
            case 'MonitoringAction': //모니터링
                screenCapture();
                break;
            case 'ContentsViewingAction': //콘텐츠뷰잉
                layerStore.setDeleteAddLayer('progress.contents.view', 'progress.contents.view', data.message.data);
                break;
            case 'ExternalAction': //외부연동
                if (type == 'nuri') {
                    //누리집
                    layerStore.setDeleteAddLayer('nuri.forward', 'nuri.forward', { itemData: data.message.data });
                } else if (type == 'contents') {
                    //콘텐츠
                    layerStore.setDeleteAddLayer('contents.forward', 'contents.forward', { itemData: data.message.data });
                } else if (type == 'whboard') {
                    //화이트보드
                    layerStore.setDeleteAddLayer('whboard', 'whboard', { whboardData: data.message.data });
                }

                break;
            default:
                break;
        }
    };

    //메시지전송(교사)
    const sendMessage = (action: string, message: any) => {
        if (message == undefined) message = {};

        webrtc.sendMessage(
            {
                key: Date.now(),
                mode: 'student',
                from: webRtcStore.getUserInfo(),
                to: webRtcStore.getTeacherInfo(),
                action: action,
                message: message
            },
            webRtcStore.getTeacherInfo()
        );
    };

    //화면캡쳐
    const screenCapture = async () => {
        const captureStream = await useScreenCapture().captureStream('#contents_area', true);
        sendMessage('MonitoringAction', { img: captureStream });
    };

    return { connect, disconnect, sendMessage };
};
