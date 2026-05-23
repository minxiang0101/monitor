<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="compass-chat" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            // xAxisData: ['混凝土', '砂浆', '水泥', '钢筋', '砖', '防水材料', '橡合剂'],
            seriesData: [],
            load: true

        }
    },
    mounted() {

        this.resizeHandler = () => {
            if (this.myChart) {
                this.myChart.resize()
            }
        }
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        // 清理事件监听器和图表实例
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        if (this.myChart) {
            this.myChart.dispose()
            this.myChart = null
        }
    },
    methods: {
        initData(val) {
            this.load = true
            this.seriesData = [{ value: val }];
            this.load = false
            this.$nextTick(() => {
                this.initCompass();
            })

        },
        initCompass() {

            this.myChart = this.$echarts.init(document.getElementById('compass-chat'));

            // 指南针图表配置
            let compassOption = {
                series: [{
                    name: '指南针',
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    min: 0,
                    max: 360,
                    radius: '86%',
                    splitNumber: 12,
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: [[1, 'rgba(0,0,0,0)']]
                        }
                    },
                    splitLine: {
                        length: 12,
                        lineStyle: {
                            width: 2,
                            color: '#ffffff'
                        }
                    },
                    axisTick: {
                        length: 8,
                        lineStyle: {
                            color: '#ffffff',
                            width: 1
                        }
                    },
                    axisLabel: {
                        distance: 5,
                        color: '#ffffff',
                        fontSize: 16,
                        formatter: function (value) {
                            if (value === 0 || value === 360) return 'N';
                            if (value === 90) return 'E';
                            if (value === 180) return 'S';
                            if (value === 270) return 'W';
                            return value;
                        }
                    },
                    pointer: {
                        length: '60%',
                        width: 8,
                        itemStyle: {
                            color: '#4c9bfd'
                        }
                    },
                    detail: {
                        show: false
                    },
                    data: this.seriesData
                }]
            };

            // 更新指南针数据和时间
            this.myChart.setOption(compassOption);

        },
    }
}
</script>