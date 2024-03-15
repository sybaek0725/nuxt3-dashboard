<template>
    <div class="chapter">
        <div class="chapter_wrap">
            <!-- 단원 -->
            <div class="unit unit_sm">
                <div class="subject">단원</div>
                <ul>
                    <li
                        v-for="(item, idx) in dataList.lessonList"
                        :key="idx"
                        ref="refLessonList"
                        class="list"
                        @click="selectLesson(idx, 'lesson')"
                    >
                        <p>{{ item }}</p>
                        <i class="ico ico_size_6"></i>
                    </li>
                </ul>
            </div>
            <!-- 차시 -->
            <div class="unit unit_xlg">
                <div class="subject">차시</div>
                <ul v-show="isActive[0] || false">
                    <li
                        v-for="(obj, idx) in dataList.lessonTimeList"
                        :key="idx"
                        ref="refLessonTimeList"
                        class="list font_md side_line ico_book"
                        @click="selectLesson(idx, 'time')"
                    >
                        <p>
                            <em>{{ obj.time }}</em> <span>{{ obj.sub }}</span>
                        </p>
                        <i class="ico ico_size_sm"></i>
                    </li>
                </ul>
            </div>
            <!-- 활동 내용 -->
            <div class="unit unit_md">
                <div class="subject">활동 내용</div>
                <ul v-show="isActive[1] || false">
                    <li ref="refActivityList" class="activity_conts side_line">
                        <div class="chips chips_blue">도입</div>
                        <router-link target="_blank" :to="`#`">
                            <em>학습 목표</em> <span>응원 구역 한 부분의 길이를 어떻게 구할까요?</span> <i class="ico ico_size_6"></i>
                        </router-link>
                    </li>
                    <li ref="refActivityList" class="activity_conts side_line">
                        <div class="chips chips_blue">전개</div>
                        <router-link target="_blank" :to="`#`">
                            <em>전개 1</em> <span>조사한 자료 살펴보기</span> <i class="ico video_24 ico_size_6"></i>
                        </router-link>
                        <router-link target="_blank" :to="`#`">
                            <em>전개 2</em> <span>표를 보고 알 수 있는 내용 이야기하기</span> <i class="ico ico_size_6"></i>
                        </router-link>
                        <router-link target="_blank" :to="`#`">
                            <em>전개 3</em> <span>표를 다른 방법으로 나타내고 표 해석하기</span> <i class="ico ico_size_6"></i>
                        </router-link>
                        <router-link target="_blank" :to="`#`">
                            <em>전개 4</em>
                            <span
                                >수집한 자료를 정리하여 표로 나타내고 알게된 점 이야기하기 수집한 자료를 정리하여 표로 나타내고 알게된 점
                                이야기하기수집한 자료를 정리하여 표로 나타내고 알게된 점 이야기하기수집한 자료를 정리하여 표로 나타내고
                                알게된 점 이야기하기</span
                            >
                            <i class="ico ico_size_6"></i>
                        </router-link>
                    </li>
                    <li ref="refActivityList" class="activity_conts">
                        <div class="chips chips_blue">정리</div>
                        <router-link target="_blank" :to="`#`"> <em>알짜 정리</em> <i class="ico ico_size_6"></i> </router-link>
                        <router-link target="_blank" :to="`#`"> <em>형성 평가</em> <i class="ico ico_size_6"></i> </router-link>
                        <router-link target="_blank" :to="`#`"> <em>너도 나도 수학 박사</em> <i class="ico ico_size_6"></i> </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// dummy data
const dataList = ref({
    lessonList: ['1단원 곱셈', '2단원 나눗셈', '3단원 분수의 덧셈과 뺄셈', '4단원 꺾은선 그래프', '5단원 들이와 무게', '6단원 그림 그래프'],
    lessonTimeList: [
        { time: '1차시', sub: '단원 도입' },
        { time: '2차시', sub: '(세 자리 수)×(한 자리 수)를 구해 볼까요(1)_ 올림이 없는 경우' },
        { time: '3차시', sub: '(세 자리 수)×(한 자리 수)를 구해 볼까요(2)_ 올림이 한 번 있는 경우' },
        { time: '4차시', sub: '(세 자리 수)×(한 자리 수)를 구해 볼까요(3)_ 올림이 여러 번 있는 경우' },
        { time: '5차시', sub: '(한 자리 수)×(몇십), (두 자리 수)×(몇십)을 구해 볼까요' },
        { time: '6차시', sub: '(한 자리 수)×(몇십몇)을 구해 볼까요' },
        { time: '7차시', sub: '(두 자리 수)×(두 자리 수)를 구해 볼까요(1)_ 올림이 한 번 있는 경우' },
        { time: '8차시', sub: '(두 자리 수)×(두 자리 수)를 구해 볼까요(2)_ 올림이 여러 번 있는 경우' },
        { time: '9차시', sub: '어림셈을 활용해 볼까요' },
        { time: '10차시', sub: '선생님이 만든 차시 목차 제목이 표현됩니다' },
        { time: '11차시', sub: '생각을 더하다 : 카드에 마음을 담아요' },
        { time: '12차시', sub: '놀이를 더하다 : 수학 천사는 누구일까요' },
        { time: '13차시', sub: '공부한 내용을 확인해요' }
    ]
});

// 단원 li ref
const refLessonList = ref([]);
// 차시 li ref
const refLessonTimeList = ref([]);
// 활동명 li ref
const refActivityList = ref([]);

// 상태 변수 정의
const currentId = ref(false);
const prevId = ref(false);
const isClick = ref(false);
const isActive = ref([false, false, false, false]);

// 상태 감시 및 처리
watch(currentId, newVal => {
    prevId.value = newVal;
});

// 선택된 요소 처리 함수
const handleSelected = (list, id, classToAdd) => {
    const currentElement = list.value[id];
    const prevElement = list.value[prevId.value];

    if (currentElement) {
        currentElement.classList.toggle(classToAdd);
        if (currentId.value !== prevId.value && prevElement) {
            prevElement.classList.remove(classToAdd);
        }
    }
};

// selectLesson 함수 정의
const selectLesson = (i, type) => {
    isClick.value = true;
    currentId.value = i;

    if (isClick.value) {
        switch (type) {
            case 'lesson':
                isActive.value[0] = true;
                handleSelected(refLessonList, i, `selected`);
                break;
            case 'time':
                isActive.value[1] = true;
                handleSelected(refLessonTimeList, i, `selected_bg_yellow`);
                break;
            case 'act':
                isActive.value[2] = true;
                handleSelected(refActivityList, i, `selected_bg_blue`);
                break;
        }
    }
};
</script>
