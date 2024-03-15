let data = [
    {
        studentId: '1',
        name: '학생1',
        number: 1,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '2',
        name: '학생2',
        number: 2,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '3',
        name: '학생3',
        number: 3,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '4',
        name: '학생4',
        number: 4,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '5',
        name: '학생5',
        number: 5,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '6',
        name: '학생6',
        number: 6,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '7',
        name: '학생7',
        number: 7,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '8',
        name: '학생8',
        number: 8,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
    },
    {
        studentId: '9',
        name: '학생9',
        number: 9,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        micActive: true,
        soundActive: true,
        soundVolume: 50
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
