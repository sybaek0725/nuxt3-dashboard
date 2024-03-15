let data = [
    {
        id: 'ko',
        name: 'setting.lang.ko',
        useYn: true,
        description: '한국어'
    },
    {
        id: 'en',
        name: 'setting.lang.en',
        useYn: false,
        description: '영어'
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        return data;
    } else if (event.req.method === 'POST') {
        const body = await readBody(event);
        data = Object.assign([], body);
        return data;
    }
});
