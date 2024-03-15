let data = [
    {
        id: 'aab9387f-fe7d-11ec-aa1f-002248057b08',
        profileActive: false,
        profile: '',
        micVolume: 0,
        soundVolume: 0,
        isamActive1: false,
        isamActive2: false,
        ivActive1: false,
        ivActive2: false,
        alarmActive: false,
        alarmTime: 10
    },
    {
        id: 'bab9387f-fe7d-11ec-aa1f-002248057b08',
        profileActive: false,
        profile: '',
        frameColor: '',
        micVolume: 0,
        soundVolume: 0,
        alarmActive: false,
        homeworkActive: false
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        const { id } = getQuery(event);
        return data.filter(e => e.id == id)[0];
    } else if (event.req.method === 'PUT') {
        const body = await readBody(event);
        data = data.filter(e => e.id != body.id);
        data.push(body);

        return data;
    }
});
