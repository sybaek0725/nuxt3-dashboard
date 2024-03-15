type Reference = {
    teachingMeterialsId: number; //수업자료콘텐츠ID
    materialName: string; //자료명
    subjectId?: string; //과목ID
    subjectName?: string; //과목명
    chapterId: string; //단원ID
    chapterName: string; //단원명
    periodId: number; //차시ID
    periodStep: string; //차시번호??
    periodName?: string; //차시명
    meterialTypeCode: string; //자료유형(누리집:nuri,콘텐츠:contents,화이트보드:whboard)
    kofContent: string; //콘텐츠종류(pdf,image,www,ppt,word,excel,hwp)
    meterialSize?: number; //콘텐츠사이즈
    meterialStoreUrl?: string; //콘텐츠url
    sendToStudentFlag?: string; //전송여부(Y:전송,N:미전송)
    createdDate?: string; //생성일
    createdBy?: string; //생성자
    lastModifiedDate?: string; //수정일
    lastModifiedBy?: string; //수정자

    grade?: string; //학년
    semester?: string; //학기
};

let data: Array<Reference> = [
    {
        teachingMeterialsId: 1,
        materialName: '두 자리 수 덧셈을 어려워 한 배추 장수 이야기(1).pdf',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 1,
        periodStep: '1',
        periodName: '단원 도입',
        meterialTypeCode: 'contents',
        meterialStoreUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        kofContent: 'pdf',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 2,
        materialName: '두 자리 수 덧셈을 어려워 한 배추 장수 이야기(2).pdf',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 1,
        periodStep: '1',
        periodName: '단원 도입',
        meterialTypeCode: 'contents',
        meterialStoreUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        kofContent: 'pdf',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 3,
        materialName: '두 자리 수 덧셈을 어려워 한 배추 장수 이야기(3).pdf',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 2,
        periodStep: '2',
        periodName: '세 자리 수의 덧셈을 해 볼까요(1) - 받아올림이 없는 경우',
        meterialTypeCode: 'contents',
        meterialStoreUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        kofContent: 'pdf',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 4,
        materialName: '삼각형 그리기(1)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '2',
        chapterName: '2. 평면도형',
        periodId: 3,
        periodStep: '1',
        periodName: '평면도형에 대해서 알아볼까요',
        meterialTypeCode: 'whboard',
        meterialStoreUrl: 'https://cdn.ctool.kr/template/template002.png',
        kofContent: 'image',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 5,
        materialName: '삼각형 그리기(2)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '2',
        chapterName: '2. 평면도형',
        periodId: 3,
        periodStep: '1',
        periodName: '평면도형에 대해서 알아볼까요',
        meterialTypeCode: 'whboard',
        meterialStoreUrl: 'https://cdn.ctool.kr/template/template003.png',
        kofContent: 'image',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 6,
        materialName: '삼각형 그리기(3)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '2',
        chapterName: '2. 평면도형',
        periodId: 4,
        periodStep: '2',
        periodName: '선분,반직선,직선을 알아볼까요.',
        meterialTypeCode: 'whboard',
        meterialStoreUrl: 'https://cdn.ctool.kr/template/template001.png',
        kofContent: 'image',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 7,
        materialName: '네이버(1)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '3',
        chapterName: '3. 나눗셈',
        periodId: 5,
        periodStep: '1',
        periodName: '어림 셈을 활용해 볼까요..',
        meterialTypeCode: 'nuri',
        meterialStoreUrl: 'https://www.naver.com/',
        kofContent: 'www',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 8,
        materialName: '네이버(2)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '3',
        chapterName: '3. 나눗셈',
        periodId: 5,
        periodStep: '1',
        periodName: '어림 셈을 활용해 볼까요..',
        meterialTypeCode: 'nuri',
        meterialStoreUrl: 'https://www.naver.com/',
        kofContent: 'www',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 9,
        materialName: '네이버(3)',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '3',
        chapterName: '3. 나눗셈',
        periodId: 5,
        periodStep: '1',
        periodName: '어림 셈을 활용해 볼까요..',
        meterialTypeCode: 'nuri',
        meterialStoreUrl: 'https://www.naver.com/',
        kofContent: 'www',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 10,
        materialName: '낮잠 자는 사자',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 1,
        periodStep: '1',
        periodName: '단원 도입',
        meterialTypeCode: 'contents',
        meterialStoreUrl:
            'https://erbankcdn.i-scream.co.kr/data/erbank/origin_img/2005/08/27/2050827r0019768.jpg?e=1704245258527&h=89465c0854e0ee7d31ccca7f077743fc',
        kofContent: 'image',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 11,
        materialName: '북청 사자놀음/중요 무형문화재 제15호/서울시',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 1,
        periodStep: '1',
        periodName: '단원 도입',
        meterialTypeCode: 'contents',
        meterialStoreUrl:
            'https://erbankcdn.i-scream.co.kr/data/erbank/origin_img/2008/12/22/2081222s265368.JPG?e=1704245258528&h=d70f0511a02f9ece9b91d78e814e373f',
        kofContent: 'image',
        grade: '3',
        semester: '1'
    },
    {
        teachingMeterialsId: 12,
        materialName: '조용조용 사자 왕이 졸리대요',
        subjectId: '1',
        subjectName: '수학',
        chapterId: '1',
        chapterName: '1. 덧셈과 뺄셈',
        periodId: 1,
        periodStep: '1',
        periodName: '단원 도입',
        meterialTypeCode: 'contents',
        meterialStoreUrl:
            'https://erbankcdn.i-scream.co.kr/data/erbank/origin_img/2013/08/07/2130807q3038390.mp4?e=1704245258714&h=cdcfb1ab2d45d8bf4c29a6993d57a3c4',
        kofContent: 'vod',
        grade: '3',
        semester: '1'
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        const { pageNum, pageSize, chapter, period, search, id } = getQuery(event);

        //id 검색
        if (id) {
            return data.filter(e => e.teachingMeterialsId == id)[0];
        } else {
            let dataTmp = data;
            const page = pageNum as number;
            const size = pageSize as number;
            const offset = (page - 1) * size;

            //검색
            if (chapter) {
                dataTmp = dataTmp.filter(e => e.chapterId == chapter);
            }

            if (period) {
                dataTmp = dataTmp.filter(e => e.periodId == period);
            }

            if (search) {
                dataTmp = dataTmp.filter(e => e.materialName.indexOf(`${search}`) > -1);
            }

            //정렬
            dataTmp.sort(function (a, b) {
                return b.teachingMeterialsId - a.teachingMeterialsId;
            });

            if (page != undefined) {
                return {
                    totalCnt: dataTmp.length,
                    data: dataTmp.slice(offset).slice(0, size)
                };
            } else {
                return {
                    totalCnt: dataTmp.length,
                    data: dataTmp
                };
            }
        }
    } else if (event.req.method === 'POST') {
        const tempArray = data.map(function (v: Reference) {
            return v.teachingMeterialsId;
        });
        const maxValue = Math.max.apply(null, tempArray);
        const body = await readBody(event);

        body.teachingMeterialsId = maxValue + 1;
        body.sendToStudentFlag = 'N';
        body.createdDate = new Date();
        body.lastModifiedDate = new Date();
        data.push(body);

        return data;
    } else if (event.req.method === 'PUT') {
        const body = await readBody(event);
        body.lastModifiedDate = new Date();

        data = data.filter(e => e.teachingMeterialsId != body.teachingMeterialsId);
        data.push(body);

        return data;
    } else if (event.req.method === 'DELETE') {
        const body = await readBody(event);

        data = data.filter(e => e.teachingMeterialsId != body.teachingMeterialsId);

        return data;
    }
});
