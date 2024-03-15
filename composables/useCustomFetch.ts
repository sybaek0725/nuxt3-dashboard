/*
@파일(Method): useCustomFetch.ts
@작성자: LEE
@작성일: 2023-11-29 11:13
@설명: useFetch Authorization token setting
*/
export const useCustomFetch = (url: string, options: object) => {
    const config = useRuntimeConfig();
    const token = useCookie('token');
    const network = useCookie('network');
    const headers = {
        accept: 'application/json'
    };

    //오프라인인 경우
    if (network.value == 'offline') {
        return {
            data: '',
            status: 'error'
        };
    }

    return useFetch(() => url, {
        baseURL: config.public.apiBase,
        timeout: 1000,
        headers: headers,
        ...options,
        onRequest: ({ options }) => {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token.value}`
            };
            console.log(`request=>${url}`, options);
        },
        onRequestError({ error }) {
            console.log(error);
            throw createError({ statusCode: 500, statusMessage: error.message, fatal: true });
        },
        onResponse: ({ response, options }) => {
            console.log(`response=>${url}`, response._data);
            //토큰만료
            if (response._data.errorCode == '401') {
                useAuthStore().userLogout();
            }
        },
        onResponseError: ({ error }) => {
            console.log(error);
            throw createError({ statusCode: 500, statusMessage: error?.message, fatal: true });
        }
    });
};
