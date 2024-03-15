/*
NOTE: useAsset Composable
@파일(Method): useAsset.ts
@작성자: seungju.kim
@작성일: 2023-12-04 17:21
@설명: 로컬에 저장된 이미지 파일을 불러오기 위해 사용
*/
export const useAsset = (path: string): string => {
    const assets = import.meta.glob('@/assets/images/**', {
        eager: true,
        import: 'default'
    });

    // @ts-expect-error: wrong type info
    return assets['/assets/' + path];
};
