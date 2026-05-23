<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show='!load' id="aqgl-yj-charts" style="width: 100%; height: 100%;"></div>
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
            myChart: null,//安全预警图表
            resizeHandler: null,
            seriesData: [],
            load: true
        }
    },
 
    async created() {
        this.seriesData = await getSafetyPie().then(res => res.data)
        this.load = false
        this.$nextTick(() => {
            this.initWarningManagement();
        })
    },
    mounted() {
        // this.initWarningManagement();
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
        initWarningManagement() {
            this.myChart = this.$echarts.init(document.getElementById('aqgl-yj-charts'));

            let warningOption = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                },
                legend: {
                    type: 'plain',
                    orient: 'vertical',
                    right: '5%',
                    top: 'middle',
                    itemWidth: 8,
                    itemHeight: 8,
                    itemGap: 10,
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 14,
                        padding: [0, 0, 0, 8]
                    },
                    formatter: function (name) {
                        let data = warningOption.series[0].data;
                        let target;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                target = data[i].value;
                                break;
                            }
                        }
                        return `${name}：${target}个`;
                    }
                },
                color: ['#D83D6C', '#FFD426', 'rgb(33,181,255)'],
                series: [{
                    name: '安全巡检',
                    type: 'pie',
                    radius: ['30%', '55%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        // borderColor: '#0B1837',
                        // borderWidth: 2
                    },
                    label: {
                        show: false,
                        formatter: '{b}\n{c}个',
                        color: '#fff'
                    },
                    labelLine: {
                        show: false,
                        length: 10,
                        length2: 10,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    data: this.seriesData
                }]
            };

            this.myChart.setOption(warningOption);
            tooltipShow(this.myChart, warningOption);
        }
    }
}
</script>