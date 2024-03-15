/*
@파일(Method): useWindowEvent.ts
@작성자: LEE
@작성일: 2024-03-12 09:32
@설명: Window 이벤트
*/
export const useWindowEvent = () => {
    const BASE_WINDOW_WIDTH = 1920;
    const BASE_FONT_SIZE = 10;

    const changeFontSize = (size: number) => {
        document.getElementsByTagName('html')[0].style.fontSize = size + 'px';
    };

    const applyWindowSizeRatioToFontSize = () => {
        const width = window.innerWidth;
        const ratio = width / BASE_WINDOW_WIDTH;
        const newSize = ratio * BASE_FONT_SIZE;
        changeFontSize(newSize);
    };

    const networkStatus = () => {
        const network = useCookie('network');
        network.value = navigator.onLine ? 'online' : 'offline';
    };

    const clickEvent = (event: MouseEvent) => {
        console.log('event', event.target);
    };

    window.addEventListener('click', clickEvent);
    window.addEventListener('online', networkStatus);
    window.addEventListener('offline', networkStatus);
    window.addEventListener('resize', applyWindowSizeRatioToFontSize);

    applyWindowSizeRatioToFontSize();
};
