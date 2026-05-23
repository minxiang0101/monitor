<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div  v-show="!load" id="aqgl-wtfx-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getSafetyPie } from '@/api/safety'
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            load:true,
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['⾼处作业⻛险','电⽓安全⻛险','机械操作⻛险','化学品暴露⻛险','施⼯材料⻛险','运输安全⻛险','环境因素⻛险','作业⼯具安全⻛险'],
            seriesData: [ ]
        }
    },
   async created(){
        this.seriesData = await getSafetyPie().then(res => res.data)
        this.load=false
         this.$nextTick(() => {
            this.initaqfx();
        })
    },
    mounted() {
        // this.initaqfx();
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
        initaqfx() {
    // 实测实量数据图表
  this.myChart = this.$echarts.init(document.getElementById('aqgl-wtfx-charts'));
    var scsOption = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 178, 255, .8)',
            borderColor: 'rgba(108, 192, 255, 0.5)',
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
            data:this.seriesData.map(item => item.name),
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
            // max: 200,
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
        series: [{
            name: '问题分析',
            type: 'bar',
            // stack: 'total',
            barWidth: 18,
            data: this.seriesData.map(item => item.value),
            itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(75,150,255,0.8)'
                }, {
                    offset: 1,
                    color: 'rgba(75,150,255,0.1)'
                }])
            }
        }]
    };
    this.myChart.setOption(scsOption);
    tooltipShow(this.myChart, scsOption);
}
    }
}
</script>