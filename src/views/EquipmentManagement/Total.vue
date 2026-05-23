<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div  v-show="!load" id="tjfx-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
export default {
    components: {
        LoadingIndicator  
    },
    data() {
        return {
            load:true,
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: [],
            seriesData: []
        }
    },
    mounted() {
        // this.initToatl();
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
        intData(data){
           this.load=true
           this.xAxisData = data?.dates;
           this.seriesData = data&&[[...data.dz],[...data.lj]]
           this.load=false
           this.$nextTick(() => {
            this.initToatl();
           })
           console.log(this.seriesData)
           console.log(this.seriesData[0])
        },
        changeType(type) {
            // 切换图表类型
            let data = [], name = '';
            if (type == 'weight') {
                name = '吊重'
                data = this.seriesData[0]
            } else {
                name = '力矩'
                data = this.seriesData[1]
            }
            this.$nextTick(() => {
                this.myChart.setOption({
                    series: [{
                        name: name,
                        data: data
                    }]
                });
            })
        },
        initToatl() {
            // 初始化统计分析图表
            this.myChart = this.$echarts.init(document.getElementById('tjfx-charts'));
            // 模拟数据
            // var weightData = [0.3, 0.4, 0.6, 0.5, 0.45, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0];
            // var momentData = [0.2, 0.3, 0.5, 0.4, 0.35, 0.15, 0.25, 0.35, 0.45, 0.7, 0.9];

            // 图表配置项
            let option = {
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
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#4c9bfd'
                        }
                    },
                    axisLabel: {
                        color: '#4c9bfd'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(76,155,253,0.1)',
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 1,
                    splitNumber: 5,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#4c9bfd'
                        }
                    },
                    axisLabel: {
                        color: '#4c9bfd',
                        formatter: '{value} T'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(76,155,253,0.1)',
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    name: '吊重',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    showSymbol: false,
                    lineStyle: {
                        width: 2
                    },
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(76,155,253,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(76,155,253,0)'
                        }])
                    },
                    itemStyle: {
                        color: '#4c9bfd',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: this.seriesData[0]
                }]
            };
            // 渲染图表
            this.myChart.setOption(option);
            tooltipShow(this.myChart, option)
        },
    }
}
</script>