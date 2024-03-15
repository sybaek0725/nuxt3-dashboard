/*
@파일(Method): useAsyncComponent.ts
@작성자: seungju.kim
@작성일: 2023-12-04 17:22
@설명: 동적 컴포넌트, 동적 컨테이너 할당에 사용
@수정: loader 부분 수정(LEE)
*/
export const useAsyncComponent = (path: string) => {
    if (!path) return;

    type AsyncComponentLoader = () => Promise<{ default: Component }>;

    const components = import.meta.glob('@/components/*/**/*.vue');
    const filePath = `/components/${path}.vue`;

    return defineAsyncComponent({
        loader: <AsyncComponentLoader>components[filePath],
        timeout: 3000
    });
};
