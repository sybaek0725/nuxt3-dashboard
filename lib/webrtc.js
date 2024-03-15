import { io } from "socket.io-client";

let socket;
let peerConnections = {};
let peerChannels = {};
let isChanageStream = false;

let socketId = [];
let userList = {};

let teacherstream = null;

let streamChangeCallback = null;

export const webrtc = {
    /**
     * Singnal 서버 연결 여부
     */
    isConnected: () => {
        try {
            return !!socket;
        } catch (error) {
            return false;
        }
    },

    /**
     * Signal 서버 연결 해제
     */
    disconnect: () => {
        // 연결이 해제된 상태일 경우
        if (!socket) {
            console.debug("is null socket");
            return;
        }

        // 서버 연결 해제
        socket.disconnect();
        socket = null;

        // 저장된 모든 채널 연결 해제
        for (const [key, channel] of Object.entries(peerChannels)) {
            channel.close();
        }

        // 저장된 모든 Peer 객체 연결 해제
        for (const [key, connection] of Object.entries(peerConnections)) {
            connection.close();
        }
    },

    /**
     * Signal 서버 연결
     * @param {*} room 네임스페이스
     * @param {*} userId 사용자 식별코드
     * @param {*} userType 사용자 식별유형
     * @param {*} callback 콜백 함수명
     */
    connect: (room, userId, userType, callback) => {
        // Signal 서버가 연결되어있을 경우 해제
        if (socket) {
            socket.disconnect();
            socket = null;
        }

        // Signal 서버 연결
        socket = io(useRuntimeConfig().public.signalServer);

        // Signal 서버 연결 이벤트
        socket.on("connect", () => {
            peerConnections = {};
            peerChannels = {};
            socketId = socket.id;
            userList = [];

            // 특정 소켓 생성 또는 참가 메세지 전송
            socket.emit("join_room", { room, userId, userType });

            // 생성된 로컬 소켓 아이디 콜백
            callback("issuedUserId", socket.id);
        });

        // socket.io.on("reconnect_attempt", () => console.log("reconnect_attempt"));
        // socket.io.on("reconnect", () => console.log("reconnect"));

        // Signal 서버 연결 오류
        socket.on("connect_error", e => {
            console.debug("connect_error", e);
        });

        // SIgnal 서버 연결 해제
        socket.on("disconnect", reason => {
            // 로그 출력
            console.debug("socket", reason);

            // 서버 연결 해제 콜백 메세지
            callback("disconnected", reason);
        });

        // peer A's code
        // 생성된 서버내 모든 피어 연결
        socket.on("all_users", users => {
            // 생성된 서버내 모든 사용자 정보
            users.forEach(async user => {
                // 관리자 유형만 다른 사용자와 Peer 연결
                if (!(userType === "admin" || (userType !== "admin" && user.userType === "admin"))) {
                    return;
                }

                // Peer 연결 객체 생성
                const pc = webrtc.createPeerConnection(user.id, user.userId, userId);
                if (!(pc && socket && socket.connected)) return;

                // 데이터를 전송할 Local Data Channel 생성
                const channel = pc.createDataChannel(room);

                channel.ondatachannel = event => {
                    // 데이터 채널 연결 콜백 메세지
                    // callback("connected datachannel", user);
                };

                channel.onopen = event => {
                    // 피어 연결된 사용자 정보 콜백
                    callback("connected", user);
                };

                channel.onclose = event => {
                    // 피어 연결 해제된 사용자 정보 콜백
                    callback("closed", user);
                };

                // channel.onerror = event => console.log(`[peer ${user.userId}] onerror`, event);

                channel.onmessage = event => {
                    if (!event.data) return;
                    const recvMessage = JSON.parse(event.data);

                    // 특정 이벤트를 제외한 공통 콜백
                    callback("message", recvMessage);
                };

                // 상대방의 Peer 정보 저장
                peerConnections[user.id] = pc;
                peerChannels[user.id] = channel;
                userList.push({ id: user.id, userId: user.userId, userType: user.userType });

                // SDP(session description protocol) 생성 - candidate 수집에 필수 조건
                const offer = await pc.createOffer({ iceRestart: true });

                // 로컬 SDP 설정 (로컬 정보)
                await pc.setLocalDescription(offer);

                // Socket을 통해 offer 전송 (Signaling)
                socket.emit("offer", {
                    sdp: pc.localDescription,
                    offerSendID: socket.id,
                    offerSendUserId: userId,
                    offerUserType: userType,
                    offerReceiveID: user.id,
                });
            });
        });

        // peer B's code
        socket.on("getOffer", async offer => {
            // 전송된 상대방 정보
            const { sdp, offerSendID, offerSendUserId, offerUserType } = offer;

            if (offerUserType === "admin") {
                // stream 변경시 (화면공유) reoffer
                console.log("teacher re offer");
                const pc = peerConnections[offerSendID];

                if (pc) {
                    pc.setRemoteDescription(sdp);

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    socket.emit("answer", {
                        sdp: pc.localDescription,
                        answerSendID: socket.id,
                        answerSendUserId: userId,
                        answerReceiveID: offerSendID,
                    });

                    return;
                }
            }

            // Peer 연결 객체 생성
            const pc = webrtc.createPeerConnection(offerSendID, offerSendUserId, userId);

            if (teacherstream) {
                console.log("stream.id ", teacherstream.id);

                console.log("peer", pc);
                // teacherstream.getTracks().forEach(function (track) {
                //     pc.addTrack(track)
                // });
                pc.addStream(teacherstream);
            }

            if (!(pc && socket && socket.connected)) return;

            // 상대방과 연결된 Peer 연결 객체 정보 저장
            peerConnections[offerSendID] = pc;

            // 상대방 SDP 설정 (상대방 정보)
            await pc.setRemoteDescription(sdp);

            // 상대방에게 전송할 SDP(session description protocol) 생성 - candidate 수집에 필수 조건
            const answer = await pc.createAnswer();

            // 로컬 SDP 설정 (로컬 정보)
            await pc.setLocalDescription(answer);

            // Socket을 통해 answer 전송 (Signaling)
            socket.emit("answer", {
                sdp: pc.localDescription,
                answerSendID: socket.id,
                answerSendUserId: userId,
                answerReceiveID: offerSendID,
            });

            // 상대방이 보내는 정보
            pc.onnegotiationneeded = async e => {
                //if (isChanageStream) {
                    const offer = await pc.createOffer({ iceRestart: true, offerToReceiveVideo: true });
                    await pc.setLocalDescription(offer);
                    console.log("setOffer", offer);
                    // send. offer
                    //
                    socket.emit("offer", {
                        sdp: pc.localDescription,
                        offerSendID: socket.id, // 내소켓
                        offerSendUserId: userId, // 내 이름
                        offerUserType: userType, // 내 유형
                        offerReceiveID: offerSendID, // 니 소켓
                    });
                    //isChanageStream = false;
                //}
            };

            // Peer 연결 이벤트 등록
            pc.ondatachannel = event => {
                // 연결을 요청한 상대방과의 데이터 채널 정보 저장
                peerChannels[offerSendID] = event.channel;

                // 연결을 요청한 상대방 정보를 Local 리스트에 추가
                userList.push({ id: offerSendID, userId: offerSendUserId, userType: offerUserType });

                event.channel.onopen = event => {
                    // 연결을 요청한 상대방 정보 콜백
                    callback("offer connected", {
                        id: offerSendID, // 상대방 소켓 Id
                        userId: offerSendUserId, // 상대방 식별코드
                        userType: offerUserType, // 상대방 식별유형
                    });
                };

                event.channel.onclose = event => {
                    // 종료된 상대방 정보를 Local 리스트에서 제거
                    userList = userList.filter(r => r.id !== offerSendID);

                    // 종료된 상대방 정보 콜백
                    callback("offer closed", {
                        id: offerSendID,
                        userId: offerSendUserId,
                        userType: offerUserType,
                    });
                };

                // event.channel.onerror = event => console.log(`[offer peer ${offerSendUserId}] onerror`, event);

                event.channel.onmessage = event => {
                    if (!event.data) return;
                    const recvMessage = JSON.parse(event.data);

                    // 특정 이벤트를 제외한 공통 콜백
                    callback("message", recvMessage);
                };
            };
        });

        // 상대방 SDP 설정
        socket.on("getAnswer", answer => {
            const { sdp, answerSendID, answerSendUserId } = answer;

            const pc = peerConnections[answerSendID];
            if (!pc) return;

            // 상대방 SDP 설정 (상대방 정보)
            pc.setRemoteDescription(sdp);
        });

        // 상대방 Candidate 정보 등록
        socket.on("getCandidate", async data => {
            const { candidate, candidateSendID, candidateSendUserID, candidateReceiveID, candidateReceiveUserID } = data;

            // 상대방의 Peer 연결 객체
            const pc = peerConnections[candidateSendID];

            if (!pc) return;

            // 상대방의 Peer 연결 객체에 Candidate를 추가
            await pc.addIceCandidate(candidate);
        });

        // 종료된 사용자 정보 전달
        socket.on("user_exit", user => {
            // 학생의 경우 선생님에게만 전송
            if (userType !== "admin") {
                return;
            }

            // 종료된 피어 정보 콜백
            callback("disconnected", user);

            // 종료된 사용자 Peer 객체 및 채널 정보 제거
            if (peerChannels[user.id]) {
                peerChannels[user.id].close();
                delete peerChannels[user.id];
            }
            if (peerConnections[user.id]) {
                peerConnections[user.id].close();
                delete peerConnections[user.id];
            }

            // 로컬 리스트에서 종료된 사용자 정보 제거
            userList = userList.filter(peerUser => peerUser.id !== user.id);
        });
    },

    /**
     * webRTC 통신을 위한 peer 연결 객체 생성
     */
    createPeerConnection: (id, remoteUserId, localUserId) => {
        try {
            // Peer 연결 객체를 생성 - STUN SERVER, TURN SERVER 정보 필요
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: useRuntimeConfig().public.stunServer },
                    {
                        urls: useRuntimeConfig().public.turnServer,
                        username: useRuntimeConfig().public.turnServerId,
                        credential: useRuntimeConfig().public.turnServerPw,
                    },
                ],
                sdpSemantics: "unified-plan",
            });

            // 상대방과 통신할 수 있는 네트워크(Candidate) 연결 이벤트
            pc.onicecandidate = e => {
                // issue.
                if (!(socket && e.candidate)) {
                    // console.log("onicecandidate failed! return", socket, e.candidate);
                    return;
                }

                // Socket을 통해 candidate 전송 (Signaling)
                socket.emit("candidate", {
                    candidate: e.candidate,
                    candidateSendID: socket.id,
                    candidateSendUserID: localUserId,
                    candidateReceiveID: id,
                    candidateReceiveUserID: remoteUserId,
                });
            };

            pc.oniceconnectionstatechange = e => {
                // console.log("oniceconnectionstatechange", e);
            };

            pc.onicegatheringstatechange = ev => {
                let connection = ev.target;

                switch (connection.iceGatheringState) {
                    case "new":
                        /* gathering is either just starting or has been reset */
                        break;
                    case "gathering":
                        /* collection of candidates has begun */
                        break;
                    case "complete":
                        /* collection of candidates is finished */
                        break;
                }
            };

            pc.ontrack = e => {
                userList = userList
                    .filter(user => user.id !== id)
                    .concat({
                        id,
                        remoteUserId,
                        stream: e.streams[0],
                    });
                if(streamChangeCallback){
                    streamChangeCallback(e.streams[0]);
                }
            };

            return pc;
        } catch (e) {
            console.debug(e);
            return undefined;
        }
    },

    /**
     * send message all
     */
    sendMessageAll: message => {
        try {
            for (const [key, channel] of Object.entries(peerChannels)) {
                try {
                    if (channel.readyState === "open") {
                        channel.send(JSON.stringify(message));
                    }
                } catch (e) {
                    console.debug("sendMessage error", e);
                }
            }
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * send message one
     */
    sendMessage: (message, user) => {
        try {
            const channel = peerChannels[user.id];
            if (!channel || channel.readyState !== "open") {
                console.debug("not found channel", user);
                return;
            }

            channel.send(JSON.stringify(message));
        } catch (error) {
            console.log(error);
        }
    },

    clear: () => {
        socket.emit("clear");

        // close peerChannels
        for (const [key, channel] of Object.entries(peerChannels)) {
            channel.close();
        }

        // close peerConnections
        for (const [key, connection] of Object.entries(peerConnections)) {
            connection.close();
        }

        peerConnections = {};
        peerChannels = {};
        userList = [];
    },

    displayShare: async (socketdata) => {
        webrtc.displaysharestop(socketdata);
        const constraints = {
            video: {
                cursor: "always",
            },
        };
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

        if (stream) {
            stream.getTracks().forEach(function (track) {
                track.onended = e => {
                    socketdata.message = "off";
                    webrtc.sendMessageAll(socketdata);
                };
            });

            isChanageStream = true;

            /* 각 피어마다 바뀐 트랙으로 스트림 갱신 */
            for (const [key, peer] of Object.entries(peerConnections)) {
                peer.addStream(stream);
            }
            teacherstream = stream;
            socketdata.message = "on"; 
            webrtc.sendMessageAll(socketdata);
        }
    },

    displaysharestop : (socketdata) => {
        if (teacherstream) {
            teacherstream.getTracks().forEach(function (track) {
                if (typeof track.stop === "function" && track.readyState !== "ended") track.stop();
            });

            socketdata.msg = "off";
            webrtc.sendMessageAll(socketdata);
            teacherstream = null;
        }
    },

    getStream(webrtcId) {
        let stream = null;
        userList.forEach(element => {
            console.log('element : ', element);
            if (element.id !== webrtcId) stream = element.stream;
        });
        return stream;
    },

    addStreamChanged(callback){
        streamChangeCallback = callback;
    }
};
