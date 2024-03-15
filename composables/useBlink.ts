/*
@파일(Method): useBlink.ts
@작성자: seungju.kim
@작성일: 2023-12-20 11:34
@설명: 발표하고 싶은 사람 클릭 시 프로필을 세번 깜빡 거립니다.
@설명: param으로 학생 리스트를 받으며 candidate key가 반드시 포함되어야 합니다.
*/
import type { VNodeRef } from 'vue';

type listType = {
    presentation: boolean;
    [key: string]: any;
};

export const useBlink = () => {
    const profileRef: VNodeRef | null = ref(null);

    const blinkProfile = (list: listType[]) => {
        profileRef.value.forEach((item: HTMLElement, index: number) => {
            if (list[index].presentation) {
                item.classList.add('blinking');
            }
        });

        // 3초 후에 blinking 클래스를 제거하여 깜빡임을 중지합니다.
        setTimeout(function () {
            profileRef.value.forEach((item: HTMLElement, index: number) => {
                if (list[index].presentation) {
                    item.classList.remove('blinking');
                }
            });
        }, 1500);
    };

    return {
        profileRef,
        blinkProfile
    };
};

/* NOTE: 아래의 스타일이 전역으로 선언되어야 하며 깜빡임을 적용할 태그에 blinking 클래스를 적용 */
/*
<style scoped>
.blinking {
    animation: blink 0.5s infinite;
}

@keyframes blink {
    50% {
        opacity: 0;
    }
}
</style>
*/
