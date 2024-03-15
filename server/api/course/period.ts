type Period = {
    periodId: number; //차시ID
    chapterId: string; //단원ID
    chapterName: string; //단원명
    periodType: string; //차시타입(MY:교사추가,EDIT:)
    periodStep: string; //차시번호
    periodName: string; //차시명
    textbookFilePath: string; //교과서 파일 경로
    textbookStartPage?: number; //교과서 시작 쪽수
    textbookEndPage?: number; //교과서 종료 쪽수
    tutorialStartPage?: number; //익힘책 시작 쪽수
    tutorialEndPage?: number; //익힘책 종료 쪽수
    studyGoal: string; //학습목표
    periodState?: string; //학습상태(done:수업완료)
};

let data: Array<Period> = [
    {
        periodId: 1,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '1',
        periodName: '단원 도입',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal: '우리 주변에서 덧셈과 뺄셈이 이용될 수 있는 상황들을 통해 학습에 흥미를 가진다.',
        textbookStartPage: 1
    },
    {
        periodId: 2,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '2',
        periodName: '세 자리 수의 덧셈을 해 볼까요(1) - 받아올림이 없는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아올림이 한 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아올림이 한 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 덧셈을 하기 전에 계산 결과를 어림하고 계산하며 수 감각과 연산 감각을 기를 수 있다.\n• 덧셈의 계산 결과를 어림하고, 계산하는 데 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 4
    },
    {
        periodId: 6,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '3',
        periodName: '세 자리 수의 덧셈을 해 볼까요(2) - 받아올림이 한 번 있는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아올림이 한 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아올림이 한 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 덧셈을 하기 전에 계산 결과를 어림하고 계산하며 수 감각과 연산 감각을 기를 수 있다.\n• 덧셈의 계산 결과를 어림하고, 계산하는 데 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 6
    },
    {
        periodId: 6,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '4',
        periodName: '세 자리 수의 덧셈을 해 볼까요(3) - 받아올림이 여러 번 있는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아올림이 여러 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아올림이 여러 번 있는 (세 자리 수)+(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 덧셈을 하기 전에 계산 결과를 어림하고 계산하며 수 감각과 연산 감각을 기를 수 있다.\n• 계산기를 사용하여 세 자리 수의 덧셈을 할 수 있다.\n• 덧셈의 계산 결과를 어림하고, 계산하는 데 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 8
    },
    {
        periodId: 7,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '5',
        periodName: '세 자리 수의 뺄셈을 해 볼까요(1) - 받아내림이 없는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아내림이 없는 (세 자리 수)-(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아내림이 없는 (세 자리 수)-(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 받아내림이 없는 (세 자리 수)-(세 자리 수)를 계산하는 데 흥미와 관심을 가지고 참여한다.',
        textbookStartPage: 10
    },
    {
        periodId: 8,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '6',
        periodName: '세 자리 수의 뺄셈을 해 볼까요(2) - 받아내림이 한 번 있는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아내림이 한 번 있는 (세 자리 수)-(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아내림이 한 번 있는 (세 자리 수)-(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 뺄셈을 하기 전에 계산 결과를 어림하고 계산하며 수 감각과 연산 감각을 기를 수 있다.\n• 뺄셈의 계산 결과를 어림하고, 계산하는 데 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 12
    },
    {
        periodId: 9,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '7',
        periodName: '세 자리 수의 뺄셈을 해 볼까요(3) - 받아내림이 두 번 있는 경우',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '받아내림이 두 번 있는 (세 자리 수)-(세 자리 수)의 계산 원리와 형식을 이해한다.\n• 받아내림이 두 번 있는 (세 자리 수)-(세 자리 수)의 계산 원리를 탐구하고, 계산할 수 있다.\n• 뺄셈을 하기 전에 계산 결과를 어림하고 계산하며 수 감각과 연산 감각을 기를 수 있다.\n• 계산기를 사용하여 세 자리 수의 뺄셈을 할 수 있다.\n• 뺄셈의 계산 결과를 어림하고, 계산하는 데 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 14
    },
    {
        periodId: 10,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '8',
        periodName: '생각을 더하다 - 또 다른 나, 어때요',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '세 자리 수의 덧셈과 뺄셈의 계산 원리와 형식을 이해한다.\n• 덧셈과 뺄셈을 하기 전에 계산 결과를 어림하며 수 감각과 연산 감각을 기를 수 있다.\n• 덧셈과 뺄셈을 다루는 문제 상황에서 적절한 문제해결 전략을 활용하여 문제를 해결하고 그 과정을 설명할 수 있다.\n• 계산기를 사용하여 세 자리 수의 덧셈과 뺄셈을 할 수 있다.\n• 덧셈과 뺄셈의 어림과 계산 활동에 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 16
    },
    {
        periodId: 11,
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodType: 'EDIT',
        periodStep: '9',
        periodName: '놀이를 더하다 - 뒷면에 어떤 수가 있을까요',
        textbookFilePath: 'https://aidtcdn.i-screammedia.com/dev/contents/textbook/chapter/158.pdf',
        studyGoal:
            '세 자리 수의 덧셈과 뺄셈의 계산 원리와 형식을 이해한다.\n• 세 자리 수의 덧셈과 삘셈을 다루는 문제 상황에서 적절한 문제해결 전략을 활용하여 문제를 해결할 수 있다.\n• 덧셈과 뺄셈의 어림과 계산 활동에 흥미와 관심을 가지고 적극적으로 참여한다.',
        textbookStartPage: 18
    },
    {
        periodId: 3,
        chapterId: '2',
        chapterName: '2. 평면도형',
        periodType: 'EDIT',
        periodStep: '1',
        periodName: '평면도형에 대해서 알아볼까요',
        textbookFilePath:
            'https://aitext.i-screammedia.com/userdata/file/chapter_item/20231227/8820728a-d457-41dd-88a6-99bc78512d9c_초등수학교과서 3-1 2단원_최종본_231120.pdf',
        studyGoal: '초과와 미만의 뜻을 알고, 초과와 미만의 범위에 있는 수를 알 수 있다.',
        periodState: 'done'
    },
    {
        periodId: 4,
        chapterId: '2',
        chapterName: '2. 평면도형',
        periodType: 'EDIT',
        periodStep: '2',
        periodName: '선분,반직선,직선을 알아볼까요.',
        textbookFilePath:
            'https://aitext.i-screammedia.com/userdata/file/chapter_item/20231227/8820728a-d457-41dd-88a6-99bc78512d9c_초등수학교과서 3-1 2단원_최종본_231120.pdf',
        studyGoal: '상황에 맞는 어림 방법을 알고, 실생활 문제를 해결할 수 있다.'
    },
    {
        periodId: 5,
        chapterId: '3',
        chapterName: '3. 나눗셈',
        periodType: 'EDIT',
        periodStep: '1',
        periodName: '어림 셈을 활용해 볼까요..',
        textbookFilePath:
            'https://aitext.i-screammedia.com/userdata/file/chapter_item/20231227/ab8dc321-a801-4a90-ba6b-41c63698da6f_초등수학교과서 3-1 3단원_최종본_231120.pdf',
        studyGoal: '올림과 버림, 반올림의 뜻을 알고, 어림수로 나타낼 수 있다.'
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        let dataTmp = data;

        const { chapter } = getQuery(event);

        //검색
        if (chapter) {
            dataTmp = data.filter(e => e.chapterId == chapter);
        }

        //정렬
        dataTmp.sort((a, b) => {
            if (a.periodStep < b.periodStep) {
                return -1;
            } else {
                return 0;
            }
        });

        return dataTmp;
    } else if (event.req.method === 'POST') {
        const tempArray = data.map(function (v: Period) {
            return v.periodId;
        });
        const maxValue = Math.max.apply(null, tempArray);
        const body = await readBody(event);

        body.periodId = maxValue + 1;
        data.push(body);

        return data;
    } else if (event.req.method === 'PUT') {
        const body = await readBody(event);
        body.lastModifiedDate = new Date();

        data = data.filter(e => e.periodId != body.periodId);
        data.push(body);

        return data;
    } else if (event.req.method === 'DELETE') {
        const body = await readBody(event);

        data = data.filter(e => e.periodId != body.periodId);

        return data;
    }
});
