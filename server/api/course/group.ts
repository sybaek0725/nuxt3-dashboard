type GroupStudent = {
    studentId: string; //학생ID
    name?: string; //학생ID
    number?: number; //학생번호
    profile?: string; //학생프로필
    prePresenterFlag?: boolean; //발표자여부
    RealPresenterFlag?: boolean; //최종발표자여부
    mainDeviceFlag?: string; //대표기기여부
};

type Group = {
    groupId: number; //모둠ID
    contentsId: number; //콘텐츠ID
    contentsNumber: number; //콘텐츠번호
    groupNumber: number; //모둠번호
    groupState?: boolean; //모둠활동완료여부
    praiseFeedback?: string; //모둠칭찬피드백
    presentationOrder?: number; //발표순서
    groupActivityTypeCd?: string; //활동유형(pdf,image,www,ppt,word,excel,hwp)
    groupActivityContext?: string; //활동내용
    mainDevice?: string; //대표기기학생ID
    student?: Array<GroupStudent>; //학생정보
};

let data: Array<Group> = [
    {
        groupId: 1,
        contentsId: 4,
        contentsNumber: 1,
        groupNumber: 1,
        groupState: false,
        mainDevice: '1',
        student: [
            {
                studentId: '1',
                name: '학생1',
                number: 1,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '2',
                name: '학생2',
                number: 2,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '3',
                name: '학생3',
                number: 3,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '4',
                name: '학생4',
                number: 4,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '5',
                name: '학생5',
                number: 5,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: true,
                mainDeviceFlag: 'N'
            }
        ]
    },
    {
        groupId: 2,
        contentsId: 4,
        contentsNumber: 1,
        groupNumber: 2,
        groupState: true,
        mainDevice: '6',
        groupActivityTypeCd: 'image',
        groupActivityContext: 'http://ai-digital.s3-website.ap-northeast-2.amazonaws.com/assets/img_bk_thumb-eeecb94f.png',
        student: [
            {
                studentId: '6',
                name: '학생6',
                number: 6,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '7',
                name: '학생7',
                number: 7,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: true,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '8',
                name: '학생8',
                number: 8,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            },
            {
                studentId: '9',
                name: '학생9',
                number: 9,
                profile: '/_nuxt/assets/images/temp/img_st_photo.png',
                prePresenterFlag: false,
                RealPresenterFlag: false,
                mainDeviceFlag: 'N'
            }
        ]
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
            return a.groupNumber - b.groupNumber;
        });

        return dataTmp;
    } else if (event.req.method === 'POST') {
        const body = await readBody(event);

        //기존데이터 삭제(기존에 학생이 세팅된 경우??)
        if (body.contentsId && body.contentsNumber) {
            data = data.filter(e => !(e.contentsId == body.contentsId && e.contentsNumber == body.contentsNumber));
        }

        for (let index = 0; index < body.count; index++) {
            const tempArray = data.map(function (v: Group) {
                return v.groupId;
            });
            const maxValue = tempArray.length == 0 ? 0 : Math.max.apply(null, tempArray);
            const temp = {
                groupId: maxValue + 1,
                contentsId: body.contentsId,
                contentsNumber: body.contentsNumber,
                groupNumber: index + 1
            };
            data.push(temp);
        }
    } else if (event.req.method === 'PUT') {
        const body = await readBody(event);

        if (Array.isArray(body)) {
            //모둠구성전송시(학생재배치)
            for (let index = 0; index < body.length; index++) {
                const item = body[index];
                data.filter(
                    e1 => e1.contentsId == item.contentsId && e1.contentsNumber == item.contentsNumber && e1.groupNumber == item.groupNumber
                ).forEach(e2 => (e2.student = item.student));
            }
        } else {
            data = data.filter(e => e.groupId != body.groupId);
            data.push(body);
        }

        return data;
    } else if (event.req.method === 'DELETE') {
        const body = await readBody(event);
        if (body.contentsId && body.contentsNumber) {
            data = data.filter(e => !(e.contentsId == body.contentsId && e.contentsNumber == body.contentsNumber));
        }

        return data;
    }
});
