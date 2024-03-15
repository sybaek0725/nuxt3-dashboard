/*
@파일(Method): modal.ts
@작성자: 박보현
@작성일: 2023-12-04 14:41
@설명: 모달 stores
@수정: 2023-12-26 message 값 (단순 텍스트) 추가 / 2024-01-11 composition api로 변경
*/

export const useModalStore = defineStore(
    'modal',
    () => {
        type ModalState = {
            isOpen: boolean;
            type: string;
            title: string;
            buttonLabels: string[];
            wrapClass: string;
            closeBtnClass: boolean;
            message: string;
        };
        const defaultModalState: ModalState = {
            isOpen: false,
            type: '',
            title: '',
            buttonLabels: [],
            wrapClass: '',
            closeBtnClass: true,
            message: ''
        };

        const modalData = ref<ModalState>({ ...defaultModalState });

        const openModalFunc = (options: ModalState) => {
            Object.assign(modalData.value, options, { isOpen: true });
        };

        const closeModalFunc = () => {
            Object.assign(modalData.value, { ...defaultModalState });
        };

        return { modalData, openModalFunc, closeModalFunc };
    },
    {
        persist: true
    }
);
