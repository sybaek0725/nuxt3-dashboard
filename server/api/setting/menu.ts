let data = {
    teacher: [
        {
            id: 'administer',
            text: 'header.menu.administer.name',
            useYn: true,
            description: '과제관리'
        },
        {
            id: 'workbook',
            text: 'aside.menu.workbook.name',
            useYn: true,
            description: '수학익힘문제'
        },
        {
            id: 'tool',
            text: 'aside.menu.tool.name',
            useYn: true,
            description: '수업활동도구'
        },
        {
            id: 'nuri',
            text: 'aside.menu.nuri.name',
            useYn: true,
            description: '누리집연동'
        },
        {
            id: 'contents',
            text: 'aside.menu.contents.name',
            useYn: true,
            description: '콘텐츠연동'
        },
        {
            id: 'whboard',
            text: 'aside.menu.whboard.name',
            useYn: true,
            description: '화이트보드'
        }
    ],
    student: [
        {
            id: 'administer',
            text: 'header.menu.administer.name',
            useYn: true,
            description: '과제관리'
        },
        {
            id: 'workbook',
            text: 'aside.menu.workbook.name',
            useYn: true,
            description: '수학익힘문제'
        },
        {
            id: 'tip',
            text: 'aside.menu.tip.name',
            useYn: true,
            description: '꿀팁수학(코스웨어)'
        },
        {
            id: 'note',
            text: 'aside.menu.note.name',
            useYn: true,
            description: 'AI오답노트(코스웨어)'
        },
        {
            id: 'assess',
            text: 'aside.menu.assess.name',
            useYn: true,
            description: 'AI진단평가'
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
