/*
@파일(Method): layer.ts
@작성자: LEE
@작성일: 2023-11-30 16:27
@설명: layer store
*/
export const useLayerStore = defineStore(
    'layer',
    () => {
        type Layer = {
            id: string; //id
            state: 'on' | 'off' | 'min' | 'max'; //레이어 상태
            area: string; //노출위치
            name: string; //명칭
            class: string; //class
            info: string; //상세정보
            component: string; //동적 컴포넌트
            subComponent: string; //서브 동적 컴포넌트
            contentsComponent: string; //콘텐츠 동적 컴포넌트
            locale: 'on' | 'off'; //다국어 지원여부
            titleWrap: 'on' | 'off'; //타이틀띠 노출여부
            [key: string]: string | object | number; //기타 추가 정보
        };

        type Options = {
            [key: string]: string | object;
        };

        //메모
        const { closeWhboard } = useWhboard();

        //레이어
        const layerDatas = ref<Array<Layer>>([]);
        const layers = ref<Array<Layer>>([]);
        const layerHeader = ref<Layer>();
        const layerData = computed(() =>
            layers.value.filter(e => e.state == 'on').length == 0 ? null : layers.value.find(e => e.state == 'on')
        );

        const setLayerData = async (value: Array<Layer>, menu: any) => {
            //메뉴사용여부(설정-메뉴관리)
            if (menu.value != undefined) {
                const dataMenu: Array<Layer> = isProxy(menu.value) ? toRaw(menu.value) : menu.value;
                value.map(item1 => {
                    return Object.assign(
                        item1,
                        dataMenu.find(item2 => {
                            return item2 && item1.id === item2.id;
                        })
                    );
                });
            }

            layerDatas.value = value;
        };

        const setLayerHeader = (value: Layer) => {
            layerHeader.value = value;
        };

        const setLayer = (value: Layer) => {
            //페이지이동시 이동여부 체크(꿀팁수학 등)
            if (layerData.value?.beforeunload && layerData.value?.pageOut != 'on') {
                layerData.value.pageOut = 'on';
                layerData.value.page = value;
                return false;
            }
            if (value.beforeunload) value.pageOut = 'off';
            //-----------------------------------

            if (value.state == 'on') {
                //해당 메뉴 설정
                if (value.titleWrap == 'off') {
                    layers.value = layers.value.filter(e => e.id != value.id);
                    layers.value.push(value);
                } else {
                    if (!layers.value.find(e => e.id == value.id)) {
                        layers.value.push(value);
                    } else {
                        layers.value.filter(e => e.id == value.id).forEach(e => (e.state = 'on'));
                    }
                }

                //다른 메뉴 비활성화
                layers.value.filter(e => e.id != value.id).forEach(e => (e.state = 'off'));
            } else if (value.state == 'off') {
                //해당 메뉴 삭제
                layers.value = layers.value.filter(e => e.id != value.id);
            } else {
                //해당 메뉴 상태 변경
                layers.value.filter(e => e.id == value.id).forEach(e => (e.state = value.state));
            }

            //활성화 상태 확인
            setLayerState();
        };

        const addKeyValue = (id: string, options: Options) => {
            const item = layers.value.find(e => e.id == id);
            if (item) {
                for (const key in options) {
                    item[key] = options[key];
                }
            }
        };

        const setAddLayer = (id: string, options: Options) => {
            const itmes = isProxy(layerDatas.value) ? toRaw(layerDatas.value) : layerDatas.value;
            const item = itmes.find(e => e.id == id);
            if (item) {
                for (const key in options) {
                    item[key] = options[key];
                }

                item.state = 'on';
                setLayer(item);
            }
        };

        const setDeleteLayer = (target: string) => {
            //해당 페이지 삭제
            layers.value = layers.value.filter(e => e.id != target);

            //활성화 상태 확인
            setLayerState();
        };

        const setDeleteAddLayer = (target: string, id: string, options: Options) => {
            //해당 페이지 삭제
            layers.value = layers.value.filter(e => e.id != target);

            //새 레이어 추가
            setAddLayer(id, options);
        };

        const setLayerState = () => {
            //화면공유 예외
            if (layerData.value?.id == 'display.share' && layerData.value?.state == 'on') {
                return false;
            } else {
                if (layerHeader.value?.id == 'class') {
                    //타이틀띠 없는경우(모니터링,북마크 등) 예외
                    if (layerData.value?.titleWrap == 'off') return false;

                    //오늘의수업인경우
                    const titleWrap = layers.value.filter(e => e.titleWrap == 'on');
                    const titleWrapOn = titleWrap.filter(e => e.state == 'on');
                    if (titleWrap.length > 0 && titleWrapOn.length == 0) {
                        titleWrap[titleWrap.length - 1].state = 'on';
                        titleWrap[titleWrap.length - 1].timestamp = Date.now();
                    } else {
                        titleWrapOn[0].timestamp = Date.now();
                    }
                } else {
                    const layersOn = layers.value.filter(e => e.titleWrap == 'off' && e.state == 'on');
                    if (layersOn.length == 0) {
                        layers.value[layers.value.length - 1].state = 'on';
                    }
                }
            }

            //메모영역 닫기
            closeWhboard();
        };

        return {
            layerDatas,
            layerData,
            layerHeader,
            layers,
            setLayerData,
            setLayerHeader,
            setLayer,
            addKeyValue,
            setAddLayer,
            setDeleteLayer,
            setDeleteAddLayer
        };
    },
    {
        persist: true
    }
);
