<!--
@파일(Method): Vod.vue
@작성자: seungju.kim
@작성일: 2023-12-12 17:42
@설명: 비디오 플레이어 화면
-->
<template>
    <div class="player_wrap" @mousemove="showControls">
        <div class="custom-video-player player_area" :class="isFullscreen ? (caption ? 'fullScreen-video-track' : 'fullScreen-video') : ''">
            <div class="img_wrap">
                <div v-show="caption" class="caption_wrap" :class="{ hidden_player_bar: !showControlsFlag && isPlaying }">
                    <p>
                        {{ subtitleText }}
                    </p>
                </div>

                <button
                    v-show="showControlsFlag || !isPlaying"
                    variant="text"
                    class="btn_action"
                    :class="[isPlaying ? 'btn_stop_big' : 'btn_play_big']"
                    @click="togglePlayPause"
                >
                    <span class="blind">{{ isPlaying ? '정지' : '재생' }}</span>
                </button>
                <video id="my-video" :poster="serviceThumbnailPath" :src="servicePath" class="video-js" @timeupdate="updateTime"></video>
            </div>

            <div v-show="showControlsFlag || !isPlaying" class="function_btn_wrap">
                <div class="player_function">
                    <!-- 버튼 활성화 active -->
                    <div class="function_l">
                        <v-btn flat class="btn_play" :class="[isPlaying ? 'off' : 'on', { active: !isPlaying }]" @click="togglePlayPause">
                            <v-tooltip class="player_tooltip" activator="parent" location="top">재생</v-tooltip>
                            <span class="blind">재생/일시정지</span>
                        </v-btn>
                        <v-btn flat class="btn_stop" @click="resetCurrentTime">
                            <v-tooltip class="player_tooltip" activator="parent" location="top">처음으로</v-tooltip>
                            <span class="blind">처음으로</span>
                        </v-btn>
                        <div class="sound_wrap">
                            <v-btn
                                flat
                                class="btn_sound"
                                :class="[sound > 0 ? 'on' : 'off', { active: soundLayer }]"
                                @click="toggleSoundLayer"
                            >
                                <v-tooltip class="player_tooltip" activator="parent" location="top">{{
                                    soundLayer ? '음량조절 끄기' : '음량조절 켜기'
                                }}</v-tooltip>
                                <span class="blind">음량</span>
                            </v-btn>
                            <div v-show="soundLayer" class="sound_slider">
                                <v-slider
                                    v-model="sound"
                                    step="0.1"
                                    :max="1.0"
                                    color="#ffffff"
                                    hide-details
                                    :thumb-size="17"
                                    direction="vertical"
                                ></v-slider>
                                <v-btn flat class="btn_sound" :class="[sound ? 'on' : 'off']" @click="toggleSound">
                                    <v-tooltip class="player_tooltip" location="top"></v-tooltip>
                                    <span class="blind">음량</span>
                                </v-btn>
                            </div>
                        </div>
                        <div class="player_bar">
                            <div class="player_slider">
                                <v-slider
                                    v-model="currentTime"
                                    step="1"
                                    :max="duration"
                                    color="#FF6600"
                                    hide-details
                                    :thumb-size="22"
                                    @end="seek"
                                ></v-slider>
                            </div>
                        </div>
                        <span class="txt_time">{{ formattedTime(currentTime) }} / {{ formattedTime(duration) }}</span>
                    </div>

                    <div class="function_r">
                        <v-btn flat class="btn_caption" :class="{ active: caption }" @click="toggleCaption">
                            <v-tooltip class="player_tooltip" activator="parent" location="top">자막</v-tooltip>
                            <span class="blind">자막</span>
                        </v-btn>
                        <div class="speed_wrap">
                            <div v-show="speedLayer" class="speed_slider">
                                <p class="txt_tit">재생속도</p>
                                <v-slider
                                    v-model="speed"
                                    :ticks="tickLabels"
                                    color="#ffffff"
                                    hide-details
                                    :max="4"
                                    step="1"
                                    show-ticks="always"
                                    tick-size="5"
                                    :thumb-size="20"
                                    @end="e => updateSpeed(e)"
                                ></v-slider>
                            </div>
                            <v-btn flat class="btn_speed" :class="{ active: speedLayer }" @click="toggleSpeed">
                                <v-tooltip class="player_tooltip" activator="parent" location="top">재생속도</v-tooltip>
                                <span class="blind">재생속도</span></v-btn
                            >
                        </div>
                        <v-btn flat title="전체화면" :class="[isFullscreen ? 'btn_small' : 'btn_big']" @click="toggleFullScreen">
                            <v-tooltip class="player_tooltip" activator="parent" location="top">{{
                                isFullscreen ? '전체화면 종료' : '전체화면'
                            }}</v-tooltip>
                            <span class="blind">전체화면</span>
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $videojs } = useNuxtApp();

const props = defineProps({
    serviceThumbnailPath: {
        require: true,
        type: String,
        default: ''
    },
    servicePath: {
        require: true,
        type: String,
        default: ''
    }
});

const showControlsFlag = ref(true);
const caption = ref(false);
const speedLayer = ref(false);
const speed = ref(2);
const soundLayer = ref(false);
const prevVolume = ref(1.0);
const sound = ref(1.0);
const tickLabels = ref({
    0: '0.5x',
    1: '0.75x',
    2: '1x (기본)',
    3: '1.5x',
    4: '2.0x'
});

const currentTime = ref(0);
const duration = ref(0);
const isPlaying = ref(false);
const subtitles = ref([]);
const subtitleText = ref('');
const isFullscreen = ref(false);
let hideControlsTimer;
let player;

onMounted(() => {
    player = $videojs('my-video');

    player.on('timeupdate', updateTime);
    player.on('loadedmetadata', () => {
        duration.value = player.duration();
    });
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    loadSubtitles();
});
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);

    // Video.js 플레이어 제거
    const player = $videojs('my-video');
    player.dispose();
});

const showControls = () => {
    showControlsFlag.value = true;
    if (hideControlsTimer) clearTimeout(hideControlsTimer);

    hideControlsTimer = setTimeout(() => {
        showControlsFlag.value = false;
    }, 2000);
};

// 재생, 시간 관련 함수들
const togglePlayPause = () => {
    if (isPlaying.value) {
        showControlsFlag.value = true;
    } else {
        setTimeout(() => {
            showControlsFlag.value = false;
        }, 2000);
    }
    isPlaying.value ? player.pause() : player.play();
    isPlaying.value = !isPlaying.value;
};

const formattedTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateTime = e => {
    if (player.isDisposed_) return;

    currentTime.value = player.currentTime();

    const subtitle = subtitles.value.find(sub => {
        return currentTime.value >= sub.start - 0.5 && currentTime.value <= sub.end + 0.5;
    });

    if (subtitle) {
        subtitleText.value = subtitle.text;
    } else {
        subtitleText.value = '';
    }
    if (e.target.currentTime >= player.duration()) {
        resetCurrentTime();
    }
};
const resetCurrentTime = () => {
    currentTime.value = 0;
    player.currentTime(0);
    isPlaying.value = false;
    player.pause();
};
const seek = () => {
    player.currentTime(currentTime.value);
};

// 사운드
const toggleSound = () => {
    if (sound.value > 0) {
        sound.value = 0;
    } else {
        sound.value = prevVolume.value;
    }

    prevVolume.value = player.volume();
};

const toggleSoundLayer = () => {
    soundLayer.value = !soundLayer.value;
};
watch(sound, newVolume => {
    player.volume(newVolume);
});

// 전체화면
const toggleFullScreen = () => {
    const customVideo = document.querySelector('.custom-video-player');
    console.log(isFullscreen.value);
    if (isFullscreen.value) {
        document.exitFullscreen();
    } else {
        customVideo.requestFullscreen();
    }
};
const handleFullscreenChange = () => {
    isFullscreen.value = Boolean(document.fullscreenElement);
};

// 자막
const loadSubtitles = () => {
    fetch('/data/caption_test.vtt')
        .then(response => response.text())
        .then(data => {
            subtitles.value = parseVttSubtitles(data);
        });
};
const parseVttSubtitles = vttData => {
    let lines;
    if (vttData.includes('\r\n\r\n')) {
        lines = vttData.split('\r\n\r\n');
    } else {
        lines = vttData.split('\n\n');
    }
    const subtitles = [];
    for (const line of lines) {
        let lineParts;
        if (vttData.includes('\r\n\r\n')) {
            lineParts = line.split('\r\n');
        } else {
            lineParts = line.split('\n');
        }
        if (lineParts.length < 2) {
            // Skip lines that don't have the expected timecode and text structure
            continue;
        }
        const time = lineParts[0].trim().split(' --> ');
        if (time.length !== 2) {
            // Skip lines that don't have a valid timecode format
            continue;
        }
        const start = parseTimecode(time[0]);
        const end = parseTimecode(time[1]);
        let text;
        if (vttData.includes('\r\n\r\n')) {
            text = lineParts.slice(1).join('\r\n').trim();
        } else {
            text = lineParts.slice(1).join('\n').trim();
        }

        subtitles.push({ start, end, text });
    }
    return subtitles;
};
const parseTimecode = timecode => {
    const timeParts = timecode.split(':');
    const secondsParts = timeParts[2].split('.');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = parseInt(secondsParts[1], 10);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};
const toggleCaption = () => {
    caption.value = !caption.value;
};

// 재생 속도
const updateSpeed = e => {
    const videoSpeed = tickLabels.value[e].split('x')[0];
    player.playbackRate(videoSpeed);
    speedLayer.value = false;
};
const toggleSpeed = () => {
    speedLayer.value = !speedLayer.value;
};
</script>

<style scoped lang="scss">
.hidden_player_bar {
    bottom: 0rem !important;
}
.video-js {
    width: 100%;
    height: 100%;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
