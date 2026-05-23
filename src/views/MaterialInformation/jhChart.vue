<template>
    <div id="jh-chart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['混凝土', '砂浆', '水泥', '钢筋', '砖', '防水材料', '橡合剂'],
            seriesData: [{
                name: '计划用量',
                data: [580, 450, 650, 280, 450, 750, 480]
            },
            {
                name: '实际重量',
                data: [480, 680, 900, 380, 350, 680, 680]
            }]
        }
    },
    mounted() {
        this.initJhChart();
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
        initJhChart() {
            this.myChart = this.$echarts.init(document.getElementById('jh-chart'));
            const option = {
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                },
                legend: {
                    data: [this.seriesData[0].name, this.seriesData[1].name],
                    right: 10,
                    top: 0,
                    textStyle: {
                        color: '#fff'
                    }
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
                    name: '单位：T',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    max: 1000,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: this.seriesData[0].name,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        showSymbol: false,
                        itemStyle: {
                            color: '#4B9EFF'
                        },
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(75,158,255,0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(75,158,255,0)'
                                }
                            ])
                        },
                        data: this.seriesData[0].data
                    },
                    {
                        name: this.seriesData[1].name,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        showSymbol: false,
                        itemStyle: {
                            color: '#00FFFF'
                        },
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(0,255,255,0.3)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(0,255,255,0)'
                                }
                            ])
                        },
                        data: this.seriesData[1].data
                    }
                ]
            };

            this.myChart.setOption(option);
            tooltipShow(this.myChart, option)


        },
    }
}
</script>