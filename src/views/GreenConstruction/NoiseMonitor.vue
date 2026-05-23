<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="NoiseMonitoring" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import { getGreenConstruction } from "@/api/index";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
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
            seriesData: [],
            seriesName:'PM2.5',
        }
    },
    async created() {
        let res = await getGreenConstruction('1').then(res => res.data);
        this.xAxisData = res.map(item => item.hourNumber + '时');
        this.seriesData = res.map(item => item.dateCount);
        this.load = false;
        this.$nextTick(() => {
            this.initNoiseMonitor()
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
        async initData(type = '1') {
            let res = await getGreenConstruction(type).then(res => res.data);
            this.xAxisData = res.map(item => item.hourNumber + '时');
            this.seriesData = res.map(item => item.dateCount);
            let obj = {
                1: 'PM2.5',
                2: 'PM10',
                3: '噪音',
                4: '温度',
                5: '湿度',
                7: '风向',
                8: '风速',
                9: 'TSP',
                10: '气压',
            }
            this.seriesName=obj[type]
            this.load = false;
        },
        async changeType(type) {
            await this.initData(type)
            this.$nextTick(() => {
                this.myChart.setOption({
                    xAxis: {
                        data: this.xAxisData
                    },
                    series: [{
                        name: this.seriesName,
                        data: this.seriesData
                    }]
                })
            })

        },
        initNoiseMonitor() {
            this.myChart = this.$echarts.init(document.getElementById('NoiseMonitoring'));

            let noiseOption = {
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    position: 'top'
                },
                xAxis: {
                    type: 'category',
                    data: this.xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    }
                },
                yAxis: {
                    type: 'value',
                    // name: '单位：dB',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    min: 0,
                    // max: 60,
                    splitNumber: 6,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
                series: [{
                    name: this.seriesName,
                    data: this.seriesData,
                    type: 'bar',
                    barWidth: '15',
                    itemStyle: {
                        barBorderRadius: [20, 20, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#6C9BFF'
                        }, {
                            offset: 1,
                            color: 'rgba(108,155,255,0.3)'
                        }])
                    }
                }]
            };

            this.myChart.setOption(noiseOption);
            tooltipShow(this.myChart, noiseOption)

        }
    }
}
</script>