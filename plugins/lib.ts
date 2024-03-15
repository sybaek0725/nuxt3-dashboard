/*
@파일(Method): lib.ts
@작성자: LEE
@작성일: 2023-11-29 11:23
@설명: external library provide
*/
import { webrtc } from '@/lib/webrtc.js';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import html2canvas from 'html2canvas';

import 'v-calendar/style.css';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            webrtc,
            videojs,
            html2canvas
        }
    };
});
