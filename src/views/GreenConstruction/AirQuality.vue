<template>
    <div id="AirQuality" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01', '02', '03', '04', '05', '06', '07'],
            seriesData: [{
                name: 'PM10',
                data: [45, 52, 48, 55, 42, 38, 47, 53, 58, 45, 42, 38, 35, 32, 28, 25, 30, 35, 40, 45, 50, 48, 42]
            },
            {
                name: 'PM2.5',
                data: [25, 30, 28, 32, 24, 22, 26, 30, 35, 28, 25, 22, 20, 18, 15, 12, 18, 22, 25, 28, 32, 30, 25]
            }]
        }
    },
    mounted() {
        this.initAirQuality();
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
        initAirQuality() {
            this.myChart = this.$echarts.init(document.getElementById('AirQuality'));

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
                    data: this.seriesData.map(item => item.name),
                    right: 10,
                    top: 0,
                    textStyle: {
                        color: '#fff'
                    }
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
                            color: 'rgba(255,255,255,0.1)',
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '单位：μg/m3',
                    nameTextStyle: {
                        color: '#fff'
                    },
                    min: 0,
                    max: 80,
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
                        show: true,
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)',
                            type: 'dashed'
                        }
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
                        data: this.seriesData[0].data,
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
                        data: this.seriesData[1].data,
                    }
                ]
            };

            this.myChart.setOption(option);
            tooltipShow(this.myChart, option)

        }
    }
}
</script>