<template>
    <div id="zlgl-scsl-charts" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['AA', 'BB', 'CC', 'DD', 'EE', 'FF'],
            seriesData: [
                { data: [80, 120, 90, 70, 110, 80], name: '问题按时整改数' },
                { data: [20, 30, 140, 90, 80, 30], name: '问题超时整改数' },
                { data: [20, 30, 140, 90, 80, 30], name: '问题未整改数' }
            ]
        }
    },
    mounted() {
        this.initQualityDataAnalysis();
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
        initQualityDataAnalysis() {
            // 实测实量数据图表
            this.myChart = this.$echarts.init(document.getElementById('zlgl-scsl-charts'));
            const barColors = [
                ['rgba(75,150,255,0.8)', 'rgba(75,150,255,0.1)'],
                ['rgba(255,107,107,0.8)', 'rgba(255,107,107,0.1)'],
                ['rgba(155,217,107,0.8)', 'rgba(155,217,107,0.1)'],
            ];
            const series = this.seriesData.map((item, index) => {
                const [startColor, endColor] = barColors[index];
                return {
                    name: item.name,
                    type: 'bar',
                    stack: 'total',
                    barWidth: 18,
                    data: item.data,
                    itemStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: startColor },
                            { offset: 1, color: endColor }
                        ])
                    }
                };

            });
            let scsOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    // axisPointer: {
                    //     type: 'cross'
                    // }
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
                    max: 200,
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
                            color: 'rgba(255,255,255,0.1)'
                        }
                    }
                },
                series: series
            };
            this.myChart.setOption(scsOption);
            tooltipShow(this.myChart, scsOption);

        }
    }
}
</script>