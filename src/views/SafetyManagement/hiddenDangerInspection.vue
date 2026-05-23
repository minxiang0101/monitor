<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="aqgl-yhpc-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getDanger7 } from '@/api/safety'
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['04/05', '04/06', '04/07', '04/08', '04/09', '04/10', '04/11'],
            seriesData: [
                { value: 26 },
                { value: 22, },
                { value: 10, },
                { value: 32, },
                { value: 10, },
                { value: 30, },
                { value: 33, },
            ],
            load: true
        }
    },
    async created() {
        this.load = true
        let res = await await getDanger7()
        this.xAxisData = res.data?.dataX.slice(-7).map(item => item.slice(5))
        this.seriesData = res.data?.series
        this.load = false
        this.$nextTick(() => {
            this.initHiddenDangerInspection();
        })
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
        initHiddenDangerInspection() {
            this.myChart = this.$echarts.init(document.getElementById('aqgl-yhpc-charts'));
            const getRandomColor = () => {
                const r = Math.floor(Math.random() * 256)
                const g = Math.floor(Math.random() * 256)
                const b = Math.floor(Math.random() * 256)
                return `rgb(${r},${g},${b})`
            }

            let series = this.seriesData.map((item, index) => {
                const color = getRandomColor()
                return {
                    name: item.name,
                    data: item.data,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    itemStyle: {
                        color: '#fff',
                        borderColor: color,
                        borderWidth: 2
                    },
                    lineStyle: {
                        color: color,
                        width: 2
                    },
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: color.replace('rgb', 'rgba').replace(')', ',0.3)')
                            },
                            {
                                offset: 1,
                                color: color.replace('rgb', 'rgba').replace(')', ',0)')
                            }
                        ])
                    }
                }
            })

            // 图表配置
            // echarts 官方文档：onsole.log(series)
            // 图表配置
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
                series: series

            };

            this.myChart.setOption(dangerOption);
            tooltipShow(this.myChart, dangerOption);
        }
    }
}
</script>