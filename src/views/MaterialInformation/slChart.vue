<template>
    <div id="sl-chart" style="width: 100%; height: 100%;"></div>
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
                name: '货单重量',
                data: [580, 450, 650, 280, 450, 750, 480]
            },
            {
                name: '实际重量',
                data: [480, 680, 900, 380, 350, 680, 680]
            }]
        }
    },
    mounted() {
        this.initSlChart();
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
            if (type == 0) {
                this.seriesData = [{
                    name: '货单重量',
                    data: [580, 450, 650, 280, 450, 750, 480]
                },
                {
                    name: '实际重量',
                    data: [480, 680, 900, 380, 350, 680, 680]
                }]
            } else {
                this.seriesData = [{
                    name: '货单重量',
                    data: [780, 650, 850, 480, 650, 950, 680]
                },
                {
                    name: '实际重量',
                    data: [680, 880, 1000, 580, 550, 880, 880]
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
        // 初始化安全隐患图表
        initSlChart() {
            const chartDom = document.getElementById('sl-chart');
            this.myChart = this.$echarts.init(chartDom);


            // 图表配置
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
                        type: 'bar',
                        barWidth: 15,
                        itemStyle: {
                            color: '#4B9EFF'
                        },
                        data: this.seriesData[0].data
                    },
                    {
                        name: this.seriesData[1].name,
                        type: 'bar',
                        barWidth: 15,
                        itemStyle: {
                            color: '#FFA84B'
                        },
                        data: this.seriesData[1].data
                    }
                ]
            };

            this.myChart.setOption(option);
            tooltipShow(this.myChart, option)

            // 数据切换函数

            // $('.chart-btns button').on('click', function () {
            //     $(this).addClass('active').siblings().removeClass('active')
            //     var type = $(this).attr('data-type');

            //     var data = type === 'today' ? {
            //         plan: [580, 450, 650, 280, 450, 750, 480],
            //         actual: [480, 680, 900, 380, 350, 680, 680]
            //     } : {
            //         plan: [780, 650, 850, 480, 650, 950, 680],
            //         actual: [680, 880, 1000, 580, 550, 880, 880]
            //     };

            //     myChart.setOption({
            //         series: [
            //             { data: data.plan },
            //             { data: data.actual }
            //         ]
            //     });
            // })


        },//安全隐患情况
    }
}
</script>