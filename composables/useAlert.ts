/*
NOTE: Alert 노출 
@파일(Method): useAlert.ts
@작성자: 박보현
@작성일: 2023-12-04 18:41
@설명: Alert 노출 로직 캡슐화
*/
export type AlertState = {
    isOpen?: boolean;
    message: string;
    timeout?: number;
};
export const useAlert = () => {
    const alertStore = useAlertStore();
    const { alertData } = storeToRefs(alertStore);
    const isOpen = computed(() => alertData.value.isOpen);
    const { message, timeout } = toRefs(alertData.value);
    const openAlert = (data: AlertState) => {
        alertStore.openAlertFunc(data);
    };
    return {
        isOpen,
        openAlert,
        message,
        timeout
    };
};
