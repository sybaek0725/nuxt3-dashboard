export interface ModalState {
    isOpen: boolean;
    type: string;
    buttonLabels: string[];
    message: string;
}

export const useModal = () => {
    const modalStore = useModalStore();
    const { modalData } = storeToRefs(modalStore);
    const isOpen = computed(() => modalData.value.isOpen);
    const { type, buttonLabels, message } = toRefs(modalData.value);
    const openModal = (data: ModalState) => {
        modalStore.openModalFunc(data);
    };
    const closeModal = () => {
        modalStore.closeModalFunc();
    };
    return {
        isOpen,
        type,
        buttonLabels,
        message,
        openModal,
        closeModal,
    };
};
