<template>
    <div class="section_datepicker rounding">
        <div class="datepicker">
            <DatePicker
                ref="calendar"
                v-model="sDate"
                class="my-calendar"
                :attributes="user.mode == 'student' ? attributesStudent : attributes"
                :masks="{ title: 'YYYY년 MMM' }"
                :min-date="startLimitDate"
                :max-date="endLimitDate"
                @dayclick="(a, b) => $emit('date', a)"
            />
            <div v-if="user.mode == 'student'" class="legend_wrap">
                <span v-for="item in attributesStudent" :key="item.key" class="legend">
                    <i :class="item.class" />
                    {{ item.key }}
                </span>
            </div>

            <div v-else class="legend_wrap">
                <span v-for="item in attributes" :key="item.key" class="legend">
                    <i :class="item.class" />
                    {{ item.key }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    selectedDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    homeworkDate: {
        type: Array,
        required: false,
        default: () => []
    },
    submittedDate: {
        type: Array,
        required: false,
        default: () => []
    },
    notsubmittedDate: {
        type: Array,
        required: false,
        default: () => [],
        required: true
    },
    startCalendars: {
        type: Boolean,
        required: false
    },
    calendarType: {
        type: Boolean,
        required: false
    },
    endCalendars: {
        type: Boolean,
        required: false
    },
    doneList: {
        type: Array,
        required: false,
        default: () => []
    },
    nDoneList: {
        type: Array,
        required: false,
        default: () => []
    }
});

const { user } = storeToRefs(useApiUserStore());
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const sDate = props.selectedDate;
const startLimitDate = ref(null);
const endLimitDate = ref(null);
defineEmits(['date']);
onMounted(() => {
    limitedDate();
    if (user.value.mode == 'student') {
        attributesStudent.value[0].dates = homeworkDateAfterToday;
        attributesStudent.value[1].dates = submitDatesBeforeToday;
        attributesStudent.value[2].dates = notsubmitDatesBeforeToday;
        attributesStudent.value[3].dates = new Date();
    } else {
        attributes.value[0].dates = new Date();
        attributes.value[1].dates = selectItem;
        attributes.value[2].dates = doneList;
        attributes.value[3].dates = nDoneList;
    }
});

// 과제있는날 (학생)
const homeworkDateAfterToday = computed(() => props.homeworkDate.filter(d => d > date));
//제출한날(학생)
const submitDatesBeforeToday = computed(() => props.submittedDate.filter(d => d < date));
//미제출한날(학생)
const notsubmitDatesBeforeToday = computed(() => props.notsubmittedDate.filter(d => d < date));

//모두 제출한날(선생님)
const doneList = computed(() => {
    return props.doneList;
});
//미제출이 있는날(선생님)
const nDoneList = computed(() => {
    return props.nDoneList;
});
// 선택한 날 (선생님)
const selectItem = computed(() => {
    return props.selectedDate;
});
const attributes = ref([
    {
        key: '접속한 오늘',
        class: 'today',
        highlight: {
            style: {
                backgroundColor: '#B7E4F8'
            },
            contentStyle: {
                color: '#000000'
            }
        },
        dates: '',
        popover: true
    },
    {
        key: '선택한 날',
        class: 'select',
        highlight: {
            style: {
                backgroundColor: '#fff',
                border: '1.5px solid #000'
            },
            contentStyle: {
                color: '#000000'
            }
        },
        date: ''
    },
    {
        key: '모두 제출한 날',
        class: 'submission',
        bar: {
            style: {
                backgroundColor: '#139D42'
            }
        },
        dates: []
    },
    {
        key: '미제출이 있는 날',
        class: 'unsubmission',
        bar: {
            style: {
                backgroundColor: '#CCCCCC'
            }
        },
        dates: []
    }
]);

const attributesStudent = ref([
    {
        key: '과제 있는 날',
        class: 'today_student',
        bar: {
            style: {
                backgroundColor: '#139D42'
            },
            contentStyle: {
                color: '#000000'
            }
        },
        dates: [],
        popover: true
    },

    {
        key: '제출한 날',
        class: 'submission_student',
        bar: {
            style: {
                backgroundColor: '#FFD44D'
            }
        },
        dates: []
    },
    {
        key: '미제출한 날',
        class: 'unsubmission',
        bar: {
            style: {
                backgroundColor: '#CCCCCC'
            }
        },
        dates: []
    },
    {
        key: '선택한 날',
        class: 'select',
        highlight: {
            style: {
                backgroundColor: '#fff',
                border: '1.5px solid #000'
            },
            contentStyle: {
                color: '#000000'
            }
        },
        date: sDate
    }
]);
const limitedDate = () => {
    //1학기일때 3~6월
    if (user.value?.classInfo.classNum == '1') {
        startLimitDate.value = new Date(new Date().getFullYear(), 2, 1);
        endLimitDate.value = new Date(new Date().getFullYear(), 7, 31);
    } else {
        //2학기일때 9~12월
        startLimitDate.value = new Date(new Date().getFullYear(), 8, 1);
        endLimitDate.value = new Date(new Date().getFullYear(), 12, 31);
    }
};
</script>
<style lang="scss" scopped>
.vc-bordered {
    border: none;
}

.vc-header {
    margin-top: 1.5rem;
    min-width: 36rem;
}

.vc-weeks {
    padding-top: 1.5rem;
}
.vc-weekday {
    font-size: 1.6rem;
}
.vc-day {
    min-height: 6rem;
}
.vc-day-content {
    font-size: 2rem;
    font-style: normal;
}
.vc-weekday-1 {
    color: #ff6600;
}

.vc-weekday-2,
.vc-weekday-3,
.vc-weekday-4,
.vc-weekday-5,
.vc-weekday-6,
.vc-weekday-7 {
    color: #000000;
}
.vc-monthly .is-not-in-month * {
    opacity: 1;
    color: #b0b0b0;
    pointer-events: none;
}

.vc-bar {
    height: 0.5rem;
    border-radius: 0.25rem;
}
</style>
