export const useWindowSize = () => {
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

    window.addEventListener('resize', applyWindowSizeRatioToFontSize);
    applyWindowSizeRatioToFontSize();
};
