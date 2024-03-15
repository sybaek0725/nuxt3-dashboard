type Learn = {
    learnId: number; //학습활동ID
    contentsId: number; //콘텐츠ID
    contentsNumber: number; //콘텐츠번호

    studentId: string; //학생ID
    name?: string; //학생ID
    number?: number; //학생번호
    profile?: string; //학생프로필
    presenterFlag?: boolean; //발표자여부
    answer?: string; //답변
    answerCount?: number; //정답개수
};

let data: Array<Learn> = [
    {
        learnId: 1,
        contentsId: 1,
        contentsNumber: 1,
        studentId: '1',
        name: '학생1',
        number: 1,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answer: 'http://ai-digital.s3-website.ap-northeast-2.amazonaws.com/assets/img_bk_thumb-eeecb94f.png',
        presenterFlag: true
    },
    {
        learnId: 2,
        contentsId: 1,
        contentsNumber: 1,
        studentId: '2',
        name: '학생2',
        number: 2,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answer: 'http://ai-digital.s3-website.ap-northeast-2.amazonaws.com/assets/img_bk_thumb-eeecb94f.png'
    },
    {
        learnId: 3,
        contentsId: 2,
        contentsNumber: 2,
        studentId: '1',
        name: '학생1',
        number: 1,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answer: 'http://ai-digital.s3-website.ap-northeast-2.amazonaws.com/assets/img_bk_thumb-eeecb94f.png'
    },
    {
        learnId: 3,
        contentsId: 3,
        contentsNumber: 3,
        studentId: '1',
        name: '학생1',
        number: 1,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answerCount: 1
    },
    {
        learnId: 4,
        contentsId: 3,
        contentsNumber: 3,
        studentId: '2',
        name: '학생2',
        number: 2,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answerCount: 3
    },
    {
        learnId: 5,
        contentsId: 3,
        contentsNumber: 3,
        studentId: '3',
        name: '학생3',
        number: 3,
        profile: '/_nuxt/assets/images/temp/img_st_photo.png',
        answerCount: 3
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        const { contentsId, contentsNumber } = getQuery(event);
        let dataTmp = data;

        //검색
        if (contentsId) {
            dataTmp = dataTmp.filter(e => e.contentsId == contentsId);
        }

        if (contentsNumber) {
            dataTmp = dataTmp.filter(e => e.contentsNumber == contentsNumber);
        }

        //정렬
        dataTmp.sort(function (a, b) {
            return b.learnId - a.learnId;
        });

        return dataTmp;
    } else if (event.req.method === 'POST') {
        const body = await readBody(event);
        data = data.filter(e => e.studentId != body.studentId); //중복제거

        const tempArray = data.map(function (v: Learn) {
            return v.learnId;
        });
        const maxValue = Math.max.apply(null, tempArray);
        body.learnId = maxValue + 1;
        data.push(body);
    } else if (event.req.method === 'PUT') {
        const body = await readBody(event);
        body.lastModifiedDate = new Date();

        data = data.filter(e => e.learnId != body.learnId);
        data.push(body);

        return data;
    } else if (event.req.method === 'DELETE') {
        const body = await readBody(event);

        data = data.filter(e => e.learnId != body.learnId);

        return data;
    }
});
