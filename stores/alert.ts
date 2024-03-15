export const useAlertStore = defineStore(
    'alert',
    () => {
        type AlertState = {
            isOpen?: boolean;
            message: string;
            timeout?: number;
        };
        const defaultAlertState: AlertState = {
            isOpen: false,
            message: '',
            timeout: 1500
        };

        const alertData = ref<AlertState>({ ...defaultAlertState });

        const openAlertFunc = (options: AlertState) => {
            Object.assign(alertData.value, options, { isOpen: true });
            setTimeout(() => {
                Object.assign(alertData.value, { ...defaultAlertState });
            }, options.timeout || defaultAlertState.timeout);
        };

        return {
            alertData,
            openAlertFunc
        };
    },
    {
        persist: false
    }
);
