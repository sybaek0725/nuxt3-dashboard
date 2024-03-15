const data = {
    success: true,
    dataSize: 1,
    timestamp: '2024-02-05 09:58:00',
    data: {
        studentId: '24c75743-47bb-4d48-8495-25bda5c05acf',
        originalId: 'keenedge4',
        name: '학생2',
        number: 2,
        profileUrl: 'https://aidtcdn.i-screammedia.com/temp/profile/profile_01.png',
        teacherId: 'ba294ecc-0e2b-4fa9-8baa-ecdef82cff92',
        teacherName: '이재호',
        schoolId: '7825886d-b04f-11ee-a85f-6045bd452244',
        schoolName: '아크초등학교',
        eduOfficeCode: 'B10',
        classInfo: {
            classId: 'ffb159c8-adbf-11ee-a85f-6045bd452244',
            grade: 'E3',
            classNum: 1,
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
