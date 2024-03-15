/*
@파일(Method): vuedraggable.ts
@작성자: 박보현
@작성일: 2023-12-12 13:43
@설명: vuedraggable
@수정: 
*/
import { DatePicker } from 'v-calendar';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('DatePicker', DatePicker);
});
