<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div id="jcsj-charts" style="width: 100%; height: 100%;" v-show="!load"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getTsjfx } from '@/api/quality'
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
        let res = await getTsjfx();
        this.load = false;
        this.xAxisData = res.data.map(item => item.clickDate.slice(5));
        this.seriesData = res.data.map(item => item.value);
        this.$nextTick(() => {
            this.initsjfx();
        })
    },
    mounted() {
        // this.initsjfx();
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
        changeType(type) {
            if (type == 1) {
                this.seriesData = [{
                    name: '新增问题',
                    data: [58, 45, 65, 28, 45, 75, 48, 90, 38, 35, 68, 68]
                },
                {
                    name: '整改问题',
                    data: [48, 68, 90, 38, 35, 68, 68, 90, 38, 35, 68, 68]
                }]
            } else if (type == 2) {
                this.seriesData = [{
                    name: '新增问题',
                    data: [80, 65, 85, 48, 65, 95, 80, 90, 38, 35, 68, 68]
                },
                {
                    name: '整改问题',
                    data: [68, 88, 10, 58, 50, 88, 88, 90, 88, 10, 58, 50]
                }]
            } else {
                this.seriesData = [{
                    name: '新增问题',
                    data: [78, 65, 85, 48, 65, 95, 68, 90, 38, 35, 68, 68]
                },
                {
                    name: '整改问题',
                    data: [68, 88, 100, 580, 55, 88, 88, 90, 38, 35, 68, 68]
                }]
            }
            this.$nextTick(() => {
                this.myChart.setOption({
                    series: [
                        { data: this.seriesData[0].data },
                        { data: this.seriesData[1].data }
                    ]
                });
            })

        },
        initsjfx() {
            this.myChart = this.$echarts.init(document.getElementById('jcsj-charts'));

            let analysisOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    axisPointer: {
                        type: 'line'
                    }
                },
                legend: {
                    data: [this.seriesData.map(item => item.name)],
                    textStyle: {
                        color: '#fff'
                    },
                    top: '2%',
                    right: '5%'
                },
                grid: {
                    top: '15%',
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
                    name: '单位：个',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    min: 0,
                    // max: 80,
                    splitNumber: 4,
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
                    name: "质量检查",
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    itemStyle: {
                        color: '#6C9BFF'
                    },
                    lineStyle: {
                        color: '#6C9BFF',
                        width: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(108,155,255,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(108,155,255,0)'
                        }])
                    },
                    data: this.seriesData
                }]
            };

            this.myChart.setOption(analysisOption);
            tooltipShow(this.myChart, analysisOption);

        }
    }
}
</script>