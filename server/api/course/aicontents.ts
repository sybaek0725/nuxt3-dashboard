type AiContents = {
    contentId: string; // 자료 아이디
    contObj: {
        thumbnailFileUrlPath: string; //썸네일
    };
    materialName: string; //제목
    kofContent: string; //자료유형타입
};

let data: Array<AiContents> = [
    {
        contentId: '1',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200316100131986.jpg'
        },
        materialName: '덧셈을 해 볼까요',
        kofContent: 'image'
    },
    {
        contentId: '2',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2130902n2627390.jpg'
        },
        materialName: '덧셈구구표',
        kofContent: 'image'
    },
    {
        contentId: '3',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200316100101561.jpg'
        },
        materialName: '덧셈을 해 볼까요',
        kofContent: 'image'
    },
    {
        contentId: '4',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4949997.jpg'
        },
        materialName: '[삽화] 색연필',
        kofContent: 'image'
    },
    {
        contentId: '5',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200311084750296.jpg'
        },
        materialName: '덧셈을 해 볼까요(1)',
        kofContent: 'image'
    },
    {
        contentId: '6',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200311084710821.jpg'
        },
        materialName: '덧셈 수학익힘',
        kofContent: 'image'
    },
    {
        contentId: '7',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200310034903801.jpg'
        },
        materialName: '덧셈 해 볼까요',
        kofContent: 'image'
    },
    {
        contentId: '8',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t200310034851005.jpg'
        },
        materialName: '덧셈_수학익힘',
        kofContent: 'image'
    },
    {
        contentId: '9',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4950887.jpg'
        },
        materialName: '두 개씩 네 묶음',
        kofContent: 'image'
    },
    {
        contentId: '10',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4950434.jpg'
        },
        materialName: '다섯개씩 세 묶음',
        kofContent: 'image'
    },
    {
        contentId: '11',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4942919.jpg'
        },
        materialName: '사탕의 개수 비교',
        kofContent: 'image'
    },
    {
        contentId: '12',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i493160.jpg'
        },
        materialName: '색칠된 마우스',
        kofContent: 'image'
    },
    {
        contentId: '13',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4918232.jpg'
        },
        materialName: '지출 내역',
        kofContent: 'image'
    },
    {
        contentId: '14',
        contObj: {
            thumbnailFileUrlPath: 'https://aidtcdn.i-screammedia.com/temp/ai/t2090116i4916263.jpg'
        },
        materialName: '수학 교구',
        kofContent: 'image'
    }
];

export default defineEventHandler(async event => {
    if (event.req.method === 'GET') {
        return data;
    }
});
