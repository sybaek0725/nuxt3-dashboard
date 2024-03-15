/*
@파일(Method): useModal.ts
@작성자: 박보현
@작성일: 2023-12-04 18:41
@설명: 모달 open / close
*/
type ModalState = {
    isOpen: boolean;
    type: string;
    title: string;
    buttonLabels: string[];
    wrapClass: string;
    closeBtnClass: boolean;
    message: string;
};
export const useModal = () => {
    const modalStore = useModalStore();
    const { modalData } = storeToRefs(modalStore);
    const isOpen = computed(() => modalData.value.isOpen);
    const { type, title, buttonLabels, wrapClass, closeBtnClass, message } = toRefs(modalData.value);
    const openModal = (data: ModalState) => {
        modalStore.openModalFunc(data);
    };
    const closeModal = () => {
        modalStore.closeModalFunc();
    };
    return {
        isOpen,
        type,
        title,
        buttonLabels,
        wrapClass,
        closeBtnClass,
        message,
        openModal,
        closeModal
    };
};
