/*
@파일(Method): useScreenCapture.ts
@작성자: LEE
@작성일: 2024-02-20 14:45
@설명: 화면 캡쳐
*/
export const useScreenCapture = () => {
    const { $html2canvas } = useNuxtApp();
    const { getCdnUrl } = useApiCdnUploadStore();

    const captureStream = async (object: string, upload: boolean) => {
        let captureStream = '';
        let imageType = upload ? 'image/png' : 'image/webp';
        let canvas = document.querySelector(object) as HTMLElement;
        canvas.setAttribute('crossorigin', 'anonymous');

        //아이프레임인 경우
        if (canvas.getElementsByTagName('iframe').length > 0) {
            console.log('아이프레임');
        }

        //화면캡쳐
        await $html2canvas(canvas, {
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            captureStream = canvas?.toDataURL(imageType, 0.1);
        });

        //업로드
        if (upload && captureStream) {
            const blobBin = atob(captureStream.split(',')[1]);
            const array = [];

            for (let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }

            const file = new Blob([new Uint8Array(array)], { type: imageType });
            const url = await getCdnUrl(file);
            if (url) captureStream = url?.filename;
        }

        return captureStream;
    };

    return { captureStream };
};
