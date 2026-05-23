<template>
    <div id="DustNoise" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['0-3时', '3-6时', '6-9时', '9-12时', '12-15时', '15-18时', '18-21时', '21-24时'],
            seriesData: [800, 700, 900, 1000, 800, 600, 400, 500]
        }
    },
    mounted() {
        this.initDustNoise();
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
            let name, data, formatter;
            if (type === '风速') {
                formatter = '{value} m/s';
                name = '风速';
                data = [12, 15, 18, 20, 16, 14, 10, 8];
            } else if (type === '风向') {
                formatter = '{value}°';
                name = '风向';
                data = [90, 180, 270, 360, 180, 90, 45, 135];
            } else {

                formatter = '{value} dB';
                name = '噪音';
                data = [800, 700, 900, 1000, 800, 600, 400, 500];
            }
            this.myChart.setOption({
                yAxis: {
                    axisLabel: {
                        formatter: formatter
                    }
                },
                series: [{
                    data: data,
                    name: name
                }]
            });
        },
        initDustNoise() {
            this.myChart = echarts.init(document.getElementById('DustNoise'));

            let dustNoiseOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: '#00B2FF',
                    textStyle: {
                        color: '#fff'
                    },
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
                    min: 0,
                    // max: 1000,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff',
                        formatter: '{value} dB'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
                series: [{
                    name: '噪音',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#4B96FF',
                        borderWidth: 2
                    },
                    lineStyle: {
                        color: '#4B96FF',
                        width: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(75,150,255,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(75,150,255,0)'
                        }])
                    },
                    data: this.seriesData
                }]
            };

            this.myChart.setOption(dustNoiseOption);
            tooltipShow(this.myChart, dustNoiseOption)


        }
    }
}
</script>