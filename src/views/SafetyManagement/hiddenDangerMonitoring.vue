<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="aqgl-yh-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getAiAlarmCount } from "@/api/safety";
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            load: true,
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: [],
            seriesData: []
        }
    },
    async created() {
        this.load = true;
        let res = await getAiAlarmCount();
        this.seriesData = res.data.map(item => item.count);
        this.xAxisData = res.data.map(item => item.time.slice(5));
        this.load = false;
        this.$nextTick(() => {
            this.initHiddenDangerMonitoring();
        })
    },
    mounted() {
        // this.initHiddenDangerMonitoring();
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
        initHiddenDangerMonitoring() {
            this.myChart = this.$echarts.init(document.getElementById('aqgl-yh-charts'));

            var dangerOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                },
                grid: {
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    // max: 50,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        formatter: '{value}个'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
                series: [{
                    name:'隐患监测',
                    data: this.seriesData,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#FF69B4',
                        borderWidth: 2
                    },
                    lineStyle: {
                        color: '#FF69B4',
                        width: 2
                    },
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255,105,180,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(255,105,180,0)'
                        }])
                    }
                }]
            };

            this.myChart.setOption(dangerOption);
            tooltipShow(this.myChart, dangerOption);
        }
    }
}
</script>