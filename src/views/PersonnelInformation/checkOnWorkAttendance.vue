<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="kq-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import { getAttendanceInfo } from '@/api/personnel'
import LoadingIndicator from "@/components/LoadingIndicator.vue";
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            seriesData: [],
            attendanceChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: [],
            load: true
        }
    },
    async created() {
        let res = await getAttendanceInfo().then(res => res.data)
        this.load = false;
        res.forEach(item => {
            this.seriesData.push({ value: item.number });
            this.xAxisData.push(item.currDate?.slice(5));
        });
        this.$nextTick(() => {
            this.initCheckOnWorkAttendance();
        });
    },
    mounted() {

        this.resizeHandler = () => {
            if (this.attendanceChart) {
                this.attendanceChart.resize()
            }
        }
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        // 清理事件监听器和图表实例
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        if (this.attendanceChart) {
            this.attendanceChart.dispose()
            this.attendanceChart = null
        }
    },
    methods: {
        initCheckOnWorkAttendance() {
            this.attendanceChart = this.$echarts.init(document.getElementById('kq-charts'));
            let attendanceOption = {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                },
                grid: {
                    top: '10%',
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
                    // max: 400,
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
                    name: '近七天考勤人数',
                    data: this.seriesData,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#4B96FF',
                        width: 2
                    },
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(75,150,255,0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(75,150,255,0)'
                        }])
                    },

                }]
            };

            this.attendanceChart.setOption(attendanceOption);
            tooltipShow(this.attendanceChart, attendanceOption);

        },
    }

}
</script>