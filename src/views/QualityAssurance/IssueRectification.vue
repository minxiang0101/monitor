<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="zlgl-wtzg-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getSelectRectifyDateWarning } from '@/api/quality'
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            load: true,
            myChart: null,//安全预警图表
            resizeHandler: null,
            //xAxisData: ['⾼处作业⻛险', '电⽓安全⻛险', '机械操作⻛险', '化学品暴露⻛险', '施⼯材料⻛险', '运输安全⻛险', '环境因素⻛险', '作业⼯具安全⻛险'],
            seriesData: [
                { value: 80, name: '问题按时整改数' },
                { value: 32, name: '问题超时整改数' },
                { value: 34, name: '问题未整改数' }
            ]
        }
    },
    async created() {
        let res = await getSelectRectifyDateWarning()
        this.seriesData = res.data
        this.load = false;
        this.$nextTick(() => {
            this.initIssueRectification();
        })
    },
    mounted() {
        // this.initIssueRectification();
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
        initIssueRectification() {
            this.myChart = this.$echarts.init(document.getElementById('zlgl-wtzg-charts'));

            let rectificationOption = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    // formatter: '{a} <br/>{b}: {c}个 ({d}%)'
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
                        let data = rectificationOption.series[0].data;
                        let target;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                target = data[i].value;
                                break;
                            }
                        }
                        return `${name}  ${target || 0}个`;
                    }
                },
                color: [
                    "#d93d6c", // 红色s
                    "#ff9233", // 橙色
                    "#ecd259", // 黄色
                    "#42beea", // 蓝色
                    "#50d8b4", // 绿色
                    "#9589ff"  // 紫色
                ],
                series: [{
                    name: '整改情况',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        // borderColor: '#0B1837',
                        // borderWidth: 2
                    },
                    label: {
                        show: false,
                        formatter: '{c}个',
                        position: 'center',
                        fontSize: 28,
                        color: '#fff'
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.seriesData
                }]
            };

            this.myChart.setOption(rectificationOption);
            tooltipShow(this.myChart, rectificationOption);

        }
    }
}
</script>