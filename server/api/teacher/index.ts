const data = {
    success: true,
    dataSize: 1,
    timestamp: '2024-02-04 01:33:02',
    data: {
        teacherId: 'ba294ecc-0e2b-4fa9-8baa-ecdef82cff92',
        originalId: 'keenedge',
        name: '이재호',
        role: 'H',
        schoolId: '7825886d-b04f-11ee-a85f-6045bd452244',
        schoolName: '아크초등학교',
        eduOfficeCode: 'B10',
        profileUrl: 'https://aidtcdn.i-screammedia.com/temp/profile/profile_01.png',
        classInfo: {
            classId: 'ffb159c8-adbf-11ee-a85f-6045bd452244',
            grade: 'E3',
            classNum: '1',
            firstTeacherId: 'ba294ecc-0e2b-4fa9-8baa-ecdef82cff92',
            secondTeacherId: null,
            schoolId: '7825886d-b04f-11ee-a85f-6045bd452244',
            schoolName: '아크초등학교',
            gradeShortIntValue: 3,
            gradeSchoolValue: '초등'
        }
    }
};

export default defineEventHandler(event => {
    return data;
});
