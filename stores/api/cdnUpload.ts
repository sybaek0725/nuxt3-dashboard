/*
@파일(Method): cdnUpload.ts
@작성자: seungju.kim
@작성일: 2024-02-06 17:37
@설명: local file cdn upload
@수정: 
*/
export const useApiCdnUploadStore = defineStore(
    'apiCdnUpload',
    () => {
        const getCdnUrl = async (file: File | Blob) => {
            type CdnItem = {
                result: string;
                result_msg: string;
                filename: string;
                filesize: number;
            };

            const formData = new FormData();
            formData.append('file', file);

            const { data, status } = await useCustomFetch('https://aitextbookapi-stage.i-screammedia.com/etc/cdnUpload', {
                method: 'post',
                body: formData
            });

            if (status.value) {
                return data.value as CdnItem;
            } else {
                return null;
            }
        };

        return {
            getCdnUrl
        };
    },
    {
        persist: true
    }
);
