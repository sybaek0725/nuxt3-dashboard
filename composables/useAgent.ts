/*
@파일(Method): useAgent.ts
@작성자: LEE
@작성일: 2024-02-27 09:25
@설명: user Agent 정보
*/
export const useAgent = () => {
    const userAgent = navigator.userAgent;

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };

    return {
        isMobile
    };
};
