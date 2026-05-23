<template>
    <div id="qyzl-charts" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            //xAxisData: ['⾼处作业⻛险', '电⽓安全⻛险', '机械操作⻛险', '化学品暴露⻛险', '施⼯材料⻛险', '运输安全⻛险', '环境因素⻛险', '作业⼯具安全⻛险'],
            seriesData: [
                { value: 16, name: '⾼处作业⻛险' },
                { value: 20, name: '电⽓安全⻛险' },
                { value: 66, name: '机械操作⻛险' },
                { value: 54, name: '化学品暴露⻛险' },
                { value: 54, name: '施⼯材料⻛险' },
                { value: 54, name: '运输安全⻛险' },
                { value: 54, name: '环境因素⻛险' },
                { value: 54, name: '作业⼯具安全⻛险' }]
        }
    },
    mounted() {
        this.initQualityCheck();
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
        initQualityCheck() {
            this.myChart = this.$echarts.init(document.getElementById('qyzl-charts'));

            let qualityOption = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    //formatter: '{a} <br/>{b}: {c}个 ({d}%)'
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
                        padding: [0, 0, 0, 8]
                    }
                },
                color: ['#4ECDC4', '#FF6B6B', '#96C3EB', '#45B7D1', '#FF6B6B', '#4ECDC4', '#96C3EB', '#45B7D1'],
                series: [{
                    name: '企业质量检查',
                    type: 'pie',
                    radius: ['40%', '65%'],
                    center: ['32%', '45%'],
                    avoidLabelOverlap: false,
                    itemStyle: {

                    },
                    label: {
                        show: false,
                        position: 'center',
                        // formatter: '总共\n{c}个',
                        fontSize: 20,
                        color: '#fff'
                    },
                    data: this.seriesData,
                }]
            };

            this.myChart.setOption(qualityOption);
            tooltipShow(this.myChart, qualityOption);

        }

    }
}
</script>