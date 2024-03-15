/*
@파일(Method): useUpload.ts
@작성자: seungju.kim
@작성일: 2023-12-05 10:36
@설명: 파일 업로드 시 로직을 관리합니다.
*/

type selectedData = { file: File | null; servicePath: string | ArrayBuffer | undefined | null };

const allowedExtensions = {
    document: ['pdf', 'hwp', 'docx', 'xlsx', 'pptx'],
    image: ['jpg', 'png', 'jpeg']
};
export const useUpload = (type: 'document' | 'image', limitedSize: number = 5) => {
    const { layerData, addKeyValue } = useLayerStore();

    const changeFile = async (e: InputEvent) => {
        let file: File | null = null;
        if (e.type === 'drop') {
            file = e.dataTransfer?.files[0] || null;
        } else {
            if (e.currentTarget && e.currentTarget instanceof HTMLInputElement && e.currentTarget.files) {
                file = e.currentTarget.files[0];
            }
        }

        if (!file) return;

        if (file.size > 1024 * 1024 * limitedSize) {
            if (e.target instanceof HTMLInputElement) e.target.value = '';
            return alert('등록 가능한 파일 용량을 초과하였습니다.');
        }
        const fileType = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();

        if (!fileType || !allowedExtensions[type].includes(fileType)) {
            if (e.target instanceof HTMLInputElement) e.target.value = '';
            return alert(`등록 가능한 파일은 다음과 같습니다. ${allowedExtensions[type]}`);
        }

        const fileReader = new FileReader();
        fileReader.onload = e => {
            alert('등록되었습니다.');
            preview({ file, servicePath: e.target?.result });
        };
        fileReader.readAsDataURL(file);
    };

    const drag = (e: InputEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const drop = (e: InputEvent) => {
        e.preventDefault();
        e.stopPropagation();

        changeFile(e);
    };

    const preview = async (selected: selectedData) => {
        if (layerData) {
            if (type === 'image') {
                if (!selected.file) {
                    addKeyValue(layerData.id, {
                        imageData: {
                            title: '',
                            servicePath: selected.servicePath,
                            type: 'image'
                        },
                        isShowImageDetail: 'on'
                    });
                } else {
                    addKeyValue(layerData.id, {
                        imageData: {
                            file: selected.file,
                            title: selected.file?.name
                                .split(selected.file?.name.split('.')[selected.file?.name.split('.').length - 1].toLowerCase())
                                .join('')
                                .split('.')[0],
                            servicePath: selected.servicePath,
                            type: 'image'
                        },
                        isShowImageDetail: 'on'
                    });
                }
            } else if (type === 'document') {
                addKeyValue(layerData.id, {
                    documentData: {
                        fileType: selected.file?.type || 'application/octet-stream',
                        title: selected.file?.name.replace(
                            `.${selected.file?.name.split('.')[selected.file?.name.split('.').length - 1].toLowerCase()}`,
                            ''
                        ),
                        type: selected.file?.name.split('.')[selected.file?.name.split('.').length - 1].toLowerCase(),
                        servicePath: selected.servicePath
                    },
                    isShowDocumentDetail: 'on'
                });
            }
        }
    };

    const imgLoadError = (e: Event) => {
        if (e.target instanceof HTMLImageElement) {
            e.target.src = useAsset('images/common/error-img.png');
        }
    };

    return {
        changeFile,
        drag,
        drop,
        preview,
        imgLoadError
    };
};
