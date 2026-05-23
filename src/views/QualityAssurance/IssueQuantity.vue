<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="zlgl-wtsl-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getSelectRectifyDate } from '@/api/quality'
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            load: true,
            myChart: null,//安全预警图表
            resizeHandler: null,
            seriesData: []
        }
    },
    async created() {
        let res = await getSelectRectifyDate();
        this.seriesData = res.data;
        this.load = false;
        this.$nextTick(() => {
            this.initIssueQuantity();
        })
    },
    mounted() {
        // this.initIssueQuantity();
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
        initIssueQuantity() {
            this.myChart = this.$echarts.init(document.getElementById('zlgl-wtsl-charts'));

            let issueOption = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: '{b}: {d}%'
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
                        fontSize: 12,
                        padding: [0, 0, 0, 8],

                    },
                    formatter: function (name) {
                        let data = issueOption.series[0].data;
                        let total = data.reduce((sum, item) => sum + item.value, 0);
                        let target;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].name === name) {
                                target = (data[i].value / total) * 100;
                                break;
                            }
                        }
                        return `${name}  ${target?.toFixed(2) || '-'}%`;
                    }
                },
                color: [
                    "#d93d6c", // 红色
                    "#ff9233", // 橙色
                    "#ecd259", // 黄色
                    "#42beea", // 蓝色
                    "#50d8b4", // 绿色
                    "#9589ff"  // 紫色
                ],
                series: [{
                    name: '问题数量',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.seriesData
                }]
            };

            this.myChart.setOption(issueOption);
            tooltipShow(this.myChart, issueOption);

        }

    }
}
</script>