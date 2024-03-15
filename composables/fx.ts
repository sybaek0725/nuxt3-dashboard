export const $fx = {
    userMethods: () => {
        const { ...userMethods } = storeToRefs(useApiUserStore());
        return userMethods;
    },
    layerMothods: () => {
        const { ...layerMethods } = useLayerStore();
        return layerMethods;
    },
    classMothods: () => {
        const { ...apiClassMethods } = useApiClassStore();
        return apiClassMethods;
    },
    administerMothods: () => {
        const { ...apiAdminiSter } = useApiAdministerStore();
        return apiAdminiSter;
    },
    modalMethods: () => {
        const { ...modalMethods } = useModal();
        return modalMethods;
    },
    login: () => {
        useAuthStore().userLogin();
    },
    logout: () => {
        useAuthStore().userLogout();
    },
    openModal: (params: ModalState) => {
        const { openModal } = useModal();
        openModal(params);
    },
    openAlert: (options: AlertState) => {
        const { openAlert } = useAlert();
        openAlert(options);
    },
    closeModal: () => {
        const { closeModal } = useModal();
        closeModal();
    },
    t: (msg: string, params: any = undefined) => {
        const { t } = useI18n();
        if (params) {
            return t(msg, params);
        } else {
            return t(msg);
        }
    },
    fetch: async (url: string, params: Object = {}, method: string = 'get') => {
        const result = await useCustomFetch(url, {
            method: method,
            body: JSON.stringify(params)
        });
        return result;
    },
    getLayerData: () => {
        const { layerData } = useLayerStore();
        return layerData;
    },
    getUserInfo: () => {
        const { user } = storeToRefs(useApiUserStore());
        return user;
    }
};
