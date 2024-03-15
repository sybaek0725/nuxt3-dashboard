let data = {
    teacher: [
        {
            id: 'progress',
            text: 'progress.aside.name',
            useYn: true,
            description: '오늘의수업-진도학습'
        },
        {
            id: 'reference',
            text: 'reference.aside.name',
            useYn: true,
            description: '오늘의수업-수업자료실'
        },
        {
            id: 'contents',
            text: 'external.aside.contents.name',
            useYn: true,
            description: '오늘의수업-수업자료실-자료검색'
        },
        {
            id: 'nuri',
            text: 'external.aside.nuri.name',
            useYn: true,
            description: '오늘의수업-수업자료실-누리집연결'
        },
        {
            id: 'whboard',
            text: 'external.aside.whboard.name',
            useYn: true,
            description: '오늘의수업-수업자료실-화이트보드'
        },
        {
            id: 'tool',
            text: 'tool.aside.name',
            useYn: true,
            description: '오늘의수업-수업도구'
        },
        {
            id: 'analyze',
            text: 'result.aside.analyze.name',
            useYn: true,
            description: '학습결과-학습분석'
        },
        {
            id: 'record',
            text: 'result.aside.record.name',
            useYn: true,
            description: '학습결과-생활기록부'
        },
        {
            id: 'everyday',
            text: 'administer.aside.everyday.name',
            useYn: true,
            description: '교무수첩-과제관리-매일5분관제'
        },
        {
            id: 'recommend',
            text: 'administer.aside.recommend.name',
            useYn: true,
            description: '교무수첩-과제관리-AI추천자료'
        },
        {
            id: 'evaluation',
            text: 'administer.aside.evaluation.name',
            useYn: true,
            description: '교무수첩-과제관리-맞춤단원평가'
        }
    ],
    student: [
        {
            id: 'progress',
            text: 'progress.aside.name',
            useYn: true,
            description: '오늘의수업-진도학습'
        },
        {
            id: 'touch',
            text: 'self.aside.touch.name',
            useYn: true,
            description: '스스로학습-AI Touch VOCA'
        },
        {
            id: 'talk',
            text: 'self.aside.talk.name',
            useYn: true,
            description: '스스로학습-AI CURI Talk'
        },
        {
            id: 'level',
            text: 'self.aside.level.name',
            useYn: true,
            description: '스스로학습-AI Level Test'
        },
        {
            id: 'analyze',
            text: 'result.aside.analyze.name',
            useYn: true,
            description: '학습결과-학습분석'
        },
        {
            id: 'record',
            text: 'result.aside.record.name',
            useYn: true,
            description: '학습결과-생활기록부'
        },
        {
            id: 'everyday',
            text: 'administer.aside.everyday.name',
            useYn: true,
            description: '교무수첩-과제관리-매일5분관제'
        },
        {
            id: 'recommend',
            text: 'administer.aside.recommend.name',
            useYn: true,
            description: '알림장-오늘의과제-AI추천자료'
        },
        {
            id: 'evaluation',
            text: 'administer.aside.evaluation.name',
            useYn: true,
            description: '알림장-오늘의과제-맞춤단원평가'
        }
    ]
};

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        return data;
    } else if (event.req.method === 'POST') {
        const body = await readBody(event);
        data = Object.assign({}, body);
        return data;
    }
});
