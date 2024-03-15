type Activity = {
    activityId: number; //학습활동ID
    contentsId: number; //콘텐츠ID
    contentsNumber: number; //콘텐츠번호
    studentId: string; //학생ID
    answer?: string; //답변
    answerCount?: number; //정답개수
};

let data: Array<Activity> = [
    {
        activityId: 1,
        contentsId: 2,
        contentsNumber: 2,
        studentId: '1',
        answer: 'test'
    },
    {
        activityId: 2,
        contentsId: 2,
        contentsNumber: 2,
        studentId: '2',
        answer: 'test'
    },
    {
        activityId: 3,
        contentsId: 1,
        contentsNumber: 1,
        studentId: '1',
        answer: 'http://ai-digital.s3-website.ap-northeast-2.amazonaws.com/assets/img_bk_thumb-eeecb94f.png'
    },
    {
        activityId: 3,
        contentsId: 3,
        contentsNumber: 1,
        studentId: '1',
        answerCount: 1
    },
    {
        activityId: 4,
        contentsId: 3,
        contentsNumber: 1,
        studentId: '2',
        answerCount: 3
    },
    {
        activityId: 5,
        contentsId: 3,
        contentsNumber: 1,
        studentId: '3',
        answerCount: 3
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        const { contents, contentsNumber } = getQuery(event);
        let dataTmp = data;

        //검색
        if (contents) {
            dataTmp = dataTmp.filter(e => e.contentsId == contents);
        }

        if (contentsNumber) {
            dataTmp = dataTmp.filter(e => e.contentsNumber == contentsNumber);
        }

        //정렬
        dataTmp.sort(function (a, b) {
            return b.activityId - a.activityId;
        });

        return dataTmp;
    } else if (event.req.method === 'POST') {
        const tempArray = data.map(function (v: Activity) {
            return v.activityId;
        });
        const maxValue = Math.max.apply(null, tempArray);
        const body = await readBody(event);

        body.activityId = maxValue + 1;
        data.push(body);
    } else if (event.req.method === 'PUT') {
    } else if (event.req.method === 'DELETE') {
    }
});
