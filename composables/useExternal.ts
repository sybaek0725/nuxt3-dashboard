/*
@파일(Method): useExternal.ts
@작성자: seungju.kim 
@작성일: 2024-01-10 16:07
@설명: 누리집, 콘텐츠, 화이트보드 연동 화면에서 내 수업 자료 저장과 학생에게 전송버튼 이벤트 로직 분리
*/

export const useExternal = () => {
    const { setAddLayer } = useLayerStore();
    const { setItem: setReferenceItem, setUpdateItem: setUpdateReferenceItem } = useApiReferenceStore();
    const apiReferenceStore = useApiReferenceStore();
    const { item: referenceItem } = storeToRefs(apiReferenceStore);
    const { setItem: setExternalItem, setUpdateItem: setUpdateExternalItem } = useApiExternalStore();
    const apiExternalStore = useApiExternalStore();
    const { item: externalItem } = storeToRefs(apiExternalStore);
    const { layerData } = useLayerStore();
    const { openAlert } = useAlert();
    const { getCdnUrl } = useApiCdnUploadStore();
    const { captureStream } = useScreenCapture();

    const noUnitMapping = computed(() => {
        if (!layerData) return false;
        if (layerData.id === 'nuri' || layerData.id === 'contents' || layerData.id === 'whboard') {
            return true;
        } else {
            return false;
        }
    });

    // 내 수업 자료 저장
    const save = async (type: string) => {
        if (!layerData) return;
        const item = layerData.id === 'progress.contents.edit.external' ? externalItem : referenceItem;
        const isExternal = layerData.id === 'progress.contents.edit.external';
        let prop: any = noUnitMapping.value
            ? {}
            : {
                  curriculumSubjectId: item.value?.curriculumSubjectId || '',
                  curriculumChapterId: item.value?.curriculumChapterId || '',
                  curriculumPeriodId: item.value?.curriculumPeriodId || '',
                  materialTypeCode: item.value?.materialTypeCode || '',
                  materialId: item.value?.materialId || null
              };
        let itemData: any = {};

        switch (layerData.externalTab) {
            case 'nuri':
                itemData = { ...(layerData.nuriData as object), type: 'url' };
                break;
            case 'contents':
                if (layerData.contentsTab === 'image') {
                    const capturedImage = await captureStream('#upload_img', true);
                    itemData = { ...(layerData[`${layerData.contentsTab}Data`] as object), servicePath: capturedImage, type: 'image' };
                } else if (layerData.contentsTab === 'document') {
                    if ((layerData as any).documentData.servicePath.startsWith('http')) {
                        itemData = layerData[`${layerData.contentsTab}Data`];
                    } else {
                        const byteCharacters = atob((layerData as any).documentData.servicePath.split(',')[1]);

                        const byteNumbers = new Array(byteCharacters.length);

                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }

                        const byteArray = new Uint8Array(byteNumbers);

                        const blob = new Blob([byteArray], { type: (layerData as any).documentData.fileType });
                        const file = new File([blob], (layerData as any).documentData.title, {
                            type: (layerData as any).documentData.fileType
                        });
                        const url = await getCdnUrl(file);

                        itemData = { ...(layerData[`${layerData.contentsTab}Data`] as object), servicePath: url?.filename };
                    }
                } else {
                    itemData = layerData[`${layerData.contentsTab}Data`];
                }
                break;
            case 'whboard':
                const capturedWhboard = await captureStream('canvas', true);
                itemData = { ...(layerData.whboardData as object), servicePath: capturedWhboard, type: 'white board' };

                break;
        }
        prop = {
            ...prop,
            courseId: '6ecac6a5-452f-41de-b9c2-9109c1847e38',
            materialName: noUnitMapping.value ? itemData.title : item.value?.materialName,
            materialTypeCode:
                itemData.servicePath === undefined
                    ? ''
                    : layerData.externalTab === 'nuri'
                    ? '01'
                    : layerData.externalTab === 'contents'
                    ? '02'
                    : '03',
            kofContent: setKofContent(itemData.type),
            materialSize: '',
            materialStoreUrl: itemData.servicePath || '',
            sendStudentFlag: 'N',
            fromewhereCd: isExternal ? '02' : '00',
            materialUseCd: isExternal ? '01' : '00',
            thumbStoreUrl: itemData.serviceThumbnailPath || ''
        };

        let responseStatus;

        if (type === 'new') {
            if (isExternal) {
                const { status } = await setExternalItem(prop);
                responseStatus = status.value;
            } else {
                const { status } = await setReferenceItem(prop);
                responseStatus = status.value;
            }
            if (responseStatus === 'success') {
                openAlert({ message: '내 수업 자료 저장되었습니다.' });
            }
        } else if (type === 'update') {
            if (isExternal) {
                const { status } = await setUpdateExternalItem(prop);
                responseStatus = status.value;
            } else {
                const { status } = await setUpdateReferenceItem(prop);
                responseStatus = status.value;
            }

            if (responseStatus === 'success') {
                openAlert({ message: '내 수업 자료 저장되었습니다.' });
            }
        }
    };

    // 학생에게 바로 전송
    const submit = async (type: string, itemData: { [key: string]: any }) => {
        if (!layerData) return;
        let data = { ...itemData };

        if (layerData.externalTab === 'contents' && (layerData.contentsTab === 'image' || layerData.contentsTab === 'document')) {
            const byteCharacters = atob((layerData as any)[`${layerData.contentsTab}Data`].servicePath.split(',')[1]);

            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            const blob = new Blob([byteArray], { type: (layerData as any)[`${layerData.contentsTab}Data`].fileType });
            const file = new File([blob], (layerData as any)[`${layerData.contentsTab}Data`].title, {
                type: (layerData as any)[`${layerData.contentsTab}Data`].fileType
            });
            const url = await getCdnUrl(file);
            if (url) {
                data = { ...itemData, servicePath: url?.filename };
                useWebRtcStore().setSendMessage('teacher', 'all', 'ExternalAction', {
                    type,
                    data
                });

                setAddLayer(`${type}.forward`, {
                    itemData: data
                });
                return;
            }
        }

        useWebRtcStore().setSendMessage('teacher', 'all', 'ExternalAction', {
            type,
            data
        });

        setAddLayer(`${type}.forward`, {
            itemData: data
        });
    };

    const initExternal = (dataObj: { [key: string]: string }, id: string, entry: string) => {
        const data = {
            servicePath: dataObj.materialStoreUrl,
            title: dataObj.materialName,
            type: dataObj.kofContent
        };
        let externalData = {
            isShowImageDetail: 'off',
            isShowSearchDetail: 'off',
            isShowDocumentDetail: 'off',
            nuriData: {},
            whboardData: {},
            imageData: {},
            searchData: {},
            documentData: {},
            period: dataObj.period || {}
        };
        if (dataObj.kofContent === 'image') {
            if (dataObj.materialTypeCode === '03') {
                externalData.whboardData = data;
            } else {
                externalData.isShowImageDetail = 'on';
                externalData.imageData = data;
            }
        } else if (dataObj.kofContent === 'video') {
            externalData.isShowSearchDetail = 'on';
            externalData.searchData = data;
        } else if (dataObj.kofContent === 'url' || dataObj.kofContent === 'plus') {
            externalData.nuriData = data;
        } else {
            externalData.isShowDocumentDetail = 'on';
            externalData.documentData = {
                ...data,
                file: { name: dataObj.materialName }
            };
        }
        setAddLayer(id, {
            ...externalData,
            teachingMeterialsId: dataObj.materialId,
            entry: entry,
            externalTab: dataObj.kofContent === 'url' ? 'nuri' : dataObj.kofContent === 'white board' ? 'whboard' : 'contents',
            contentsTab:
                dataObj.kofContent === 'image'
                    ? 'image'
                    : dataObj.kofContent === 'video' || dataObj.kofContent === 'plus' || dataObj.kofContent === 'url'
                    ? 'search'
                    : 'document'
        });
    };

    const setKofContent = (type: string) => {
        if (!layerData) return;
        if (layerData.id === 'progress.contents.edit.external') {
            return type === 'pdf'
                ? '01'
                : type === 'image'
                ? '02'
                : type === 'pptx'
                ? '03'
                : type === 'docx'
                ? '04'
                : type === 'xlsx'
                ? '06'
                : type === 'hwp'
                ? '07'
                : type || '';
        } else {
            return type === 'pptx' ? 'ppt' : type === 'docx' ? 'word' : type === 'xlsx' ? 'excel' : type || '';
        }
    };

    return {
        save,
        submit,
        initExternal
    };
};
