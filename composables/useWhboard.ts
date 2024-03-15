/*
@파일(Method): useWhboard.ts
@작성자: seungju.kim
@작성일: 2023-12-04 17:22
@설명: 화면 메모가 필요한 부분에 사용
*/
declare global {
    interface Window {
        fabric: any;
    }
}

export const useWhboard = () => {
    const { layerData, addKeyValue } = useLayerStore();
    const whboardStore = useWhboardStore();
    let sdb: any = null;
    const fabric = window.fabric;
    const isFirstConnected = ref(true);
    const lineWidth = ref(5);
    const isShowColor = ref(false);
    const isShowLine = ref(false);
    const colorIndex = ref(9);
    const isRedoing = ref(false);
    const objects = reactive<any[]>([]);
    const canvas_area = ref<any>(null);
    const canvas = ref(null);
    const isDrawingMode = ref(true);
    const colors = reactive([
        { name: 'red', code: '#ff1919' },
        { name: 'pink', code: '#ff88d1' },
        { name: 'orange', code: '#ff7f0e' },
        { name: 'yellow', code: '#ffe500' },
        { name: 'green', code: '#3edd45' },
        { name: 'skyblue', code: '#2dcdff' },
        { name: 'blue', code: '#0758ff' },
        { name: 'purple', code: '#6f2bff' },
        { name: 'gray', code: '#969696' },
        { name: 'black', code: '#000' }
    ]);

    const initDraw = () => {
        sdb = new fabric.Canvas(canvas.value, {
            width: canvas_area.value.offsetWidth,
            height: canvas_area.value.offsetHeight
        });
        sdb.setOverlayColor('rgba(0,0,0,0)', undefined, { erasable: false });
        setLineWidth();
    };
    const undo = (e: any) => {
        e.stopPropagation();
        if (sdb._objects.length > 0) {
            objects.push(sdb._objects.pop());
            sdb.renderAll();
        }
        clearView();
    };
    const redo = (e: any) => {
        e.stopPropagation();
        if (objects.length > 0) {
            isRedoing.value = true;
            sdb.add(objects.pop());
        }
        clearView();
    };
    const setLineColor = (val: string) => {
        if (!sdb.isDrawingMode) {
            sdb.isDrawingMode = true;
            isDrawingMode.value = true;
        }
        const index = colors.findIndex(item => item.name == val);
        const color = colors.find(item => item.name == val);
        let brush = sdb.freeDrawingBrush;
        brush.color = color?.code;
        colorIndex.value = index;
        isFirstConnected.value = false;
        isShowColor.value = false;
    };
    const setLineWidth = () => {
        sdb.freeDrawingBrush = new fabric.PencilBrush(sdb);
        sdb.freeDrawingBrush.width = parseInt(String(lineWidth.value), 10) || 1;
        sdb.isDrawingMode = true;
        sdb.freeDrawingCursor = `crosshair`;
        isDrawingMode.value = true;
        setLineColor(colors[colorIndex.value].name);
        isShowLine.value = false;
    };
    const openColorView = (e: any) => {
        e.stopPropagation();
        isShowLine.value = false;
        isShowColor.value = !isShowColor.value;
    };
    const openLineView = (e: any) => {
        e.stopPropagation();
        isShowColor.value = false;
        isShowLine.value = !isShowLine.value;
    };
    const setText = () => {
        lock();
        sdb.add(
            new fabric.IText('여기에 입력해 주세요', {
                left: 50,
                top: 50,
                fontFamily: 'arial black',
                fill: '#333',
                fontSize: 30
            })
        );

        sdb.isDrawingMode = false;
        isDrawingMode.value = false;
        sdb.renderAll();
    };
    const clearView = () => {
        isShowColor.value = false;
        isShowLine.value = false;
    };
    const allClear = () => {
        sdb.clear();
        clearView();
    };
    const onPaste = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        lock();

        sdb.transparentCorners = false;
        let items = e.clipboardData.items;

        //Loop through files
        for (let i = 0; i < items.length; i++) {
            let file = items[i],
                type = file.type;

            if (type.indexOf('image') != -1) {
                let imageData = file.getAsFile();
                var URLobj = window.URL || window.webkitURL;
                var img = new Image();
                img.src = URLobj.createObjectURL(imageData);
                fabric.Image.fromURL(img.src, function (img2: any) {
                    let scaleWidth = 0;
                    let scaleHeight = 0;

                    if (sdb.width > img.width && sdb.height > img.height) {
                        scaleWidth = 1;
                        scaleHeight = 1;
                    } else if (sdb.width > img.width) {
                        scaleHeight = sdb.height / img.height;
                        scaleWidth = scaleHeight;
                    } else if (sdb.height > img.height) {
                        scaleWidth = sdb.width / img.width;
                        scaleHeight = scaleWidth;
                    } else if (sdb.width <= img.width && sdb.height <= img.height) {
                        scaleWidth = sdb.width / img.width;
                        scaleHeight = scaleWidth;
                    }
                    img2.set({
                        scaleX: scaleWidth,
                        scaleY: scaleHeight
                    });
                    sdb.add(img2);
                    sdb.centerObject(img2);
                    sdb.isDrawingMode = false;
                    sdb.renderAll();
                    clearView();
                    isDrawingMode.value = false;
                });
            }
        }
    };
    const lock = () => {
        sdb._objects.forEach(function (item: any) {
            if (item.get('type') != 'image' && item.get('type') != 'i-text') {
                item.selectable = false;
                item.evented = false;
                item.hoverCursor = 'pointer';
            }
        });

        sdb.discardActiveObject().renderAll();
    };
    const setEraser = () => {
        const getDrawCursor = () => {
            const circle = `
                                  <svg
                                    height="30"
                                    fill="#fff"
                                    viewBox="0 0 40 40"
                                    width="30"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      stroke="black"
                                      cx="50%"
                                      cy="50%"
                                      r="20"
                                    />
                                  </svg>
                                `;
            return `data:image/svg+xml;base64,${window.btoa(circle)}`;
        };

        sdb.freeDrawingCursor = `url(${getDrawCursor()}) 10 10, crosshair`;
        sdb.freeDrawingBrush = new fabric.EraserBrush(sdb);
        sdb.freeDrawingBrush.width = 30;
        sdb.isDrawingMode = true;
        isDrawingMode.value = true;
        clearView();

        sdb.renderAll();
        if (!sdb.isDrawingMode) {
            sdb.isDrawingMode = true;
            isDrawingMode.value = true;
        }
    };
    const setBackground = (url: string) => {
        fabric.Image.fromURL(
            url,
            function (img: any) {
                let scaleWidth = 0;
                let scaleHeight = 0;

                if (sdb.width > img.width && sdb.height > img.height) {
                    scaleWidth = sdb.width / img.width;
                    scaleHeight = scaleWidth;
                } else if (sdb.width > img.width) {
                    scaleHeight = sdb.height / img.height;
                    scaleWidth = scaleHeight;
                } else if (sdb.height > img.height) {
                    scaleWidth = sdb.width / img.width;
                    scaleHeight = scaleWidth;
                } else if (sdb.width <= img.width && sdb.height <= img.height) {
                    scaleWidth = sdb.width / img.width;
                    scaleHeight = scaleWidth;
                }
                const center = sdb.getCenter();
                sdb.setBackgroundImage(
                    img,
                    sdb.renderAll.bind(sdb),
                    {
                        scaleX: sdb.width / img.width,
                        scaleY: sdb.height / img.height,
                        // top: center.top,
                        // left: center.left,
                        originX: 'left',
                        originY: 'top'
                    },
                    {
                        crossOrigin: 'Anonymous'
                    }
                );
                img.set({ erasable: false });
            },
            {
                crossOrigin: 'Anonymous'
            }
        );
    };
    const isOpen = computed(() => whboardStore.isOpen);
    const openWhboard = () => {
        whboardStore.openWhboard();
    };
    const closeWhboard = () => {
        whboardStore.closeWhboard();
    };
    return {
        sdb,
        fabric,
        colors,
        isFirstConnected,
        lineWidth,
        isShowColor,
        isShowLine,
        colorIndex,
        isRedoing,
        objects,
        canvas,
        canvas_area,
        isDrawingMode,
        isOpen,
        openWhboard,
        closeWhboard,
        initDraw,
        undo,
        redo,
        setLineColor,
        setLineWidth,
        openColorView,
        openLineView,
        setText,
        clearView,
        allClear,
        onPaste,
        lock,
        setEraser,
        setBackground
    };
};
