<!--
@파일(Method): FileCard.vue
@작성자: seungju.kim
@작성일: 2024-03-08 09:29
@설명: 파일을 정보를 가지고 있는 카드 컴포넌트
-->
<template>
    <div class="today_study viewer viewer_with_btn preview">
        <div :class="'viewer_title_box viewer_title_box_' + fileType.toLowerCase()">
            <i :class="'ico data_' + fileType.toLowerCase() + ' ico_size_12 ico_color_white'"></i>
            {{ fileName }}
        </div>
        <div class="viewer_contents_box">
            <ul class="file_down_list">
                <li>
                    <span class="contents_title bullet_title font-color-black">자료</span>
                    <a :download="fileName" :href="fileUrl" class="button">
                        <i class="ico attached"></i>
                        <span>{{ fileName }}.{{ fileType }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
});
</script>
