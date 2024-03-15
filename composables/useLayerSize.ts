/*
@파일(Method): useLayerSize.ts
@작성자: LEE
@작성일: 2024-01-15 16:26
@설명: 레이어 확대/축소
*/
export const useLayerSize = () => {
    const tempFullState = ref(false);
    const tempLayerState = ref('min');

    const fullScreen = () => {
        tempFullState.value = false; //초기화

        //GNB,RNB 숨김
        const header = document.getElementById('header') as HTMLElement;
        header.style.display = 'none';

        const aside = document.getElementById('aside') as HTMLElement;
        aside.style.display = 'none';

        const doc = document.documentElement;
        if (doc.requestFullscreen) doc.requestFullscreen();
        //else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen(); // Chrome, Safari (webkit)
        //else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen(); // Firefox
        //else if (doc.msRequestFullscreen) doc.msRequestFullscreen(); // IE or Edge
        else {
            alert('해당 기기에서는 지원하지 않습니다.');
        }
    };

    const exitScreen = () => {
        //GNB,RNB 보임
        const header = document.getElementById('header') as HTMLElement;
        header.style.display = '';

        const aside = document.getElementById('aside') as HTMLElement;
        aside.style.display = '';

        if (document.exitFullscreen) document.exitFullscreen();
        //else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); //Chrome, Safari (webkit)
        //else if (document.mozCancelFullScreen) document.mozCancelFullScreen(); // Firefox
        //else if (document.msExitFullscreen) document.msExitFullscreen(); // IE or Edge
        else {
            alert('해당 기기에서는 지원하지 않습니다.');
        }
    };

    window.addEventListener('keydown', e => {
        if (e.keyCode == 122 /* F11 */) {
            e.preventDefault();
            e.returnValue = false;
        }

        if (tempLayerState.value == 'max') {
            if (e.keyCode == 123 /* F12 */) {
                e.preventDefault();
                e.returnValue = false;
            }
        }
    });
    window.addEventListener('resize', e => {
        if (tempFullState.value) {
            tempFullState.value = false;
            tempLayerState.value = 'min';

            //GNB,RNB 보임
            const header = document.getElementById('header') as HTMLElement;
            header.style.display = '';

            const aside = document.getElementById('aside') as HTMLElement;
            aside.style.display = '';
        }

        tempFullState.value = true;
    });

    return {
        tempFullState,
        tempLayerState,
        fullScreen,
        exitScreen
    };
};
