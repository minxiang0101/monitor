<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="bzxx-charts" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import { getTeamInfo } from "@/api/personnel";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            seriesData: [],
            bzxxChart: null,//安全预警图表
            resizeHandler: null,
            load: true,
            colorArray: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'],
        }
    },
    async created() {
        this.seriesData = await getTeamInfo().then(res => res.data);
        this.load = false;
        this.seriesData = this.seriesData.filter(item => item.value !== 0)
        
        // 为数据添加颜色属性并按颜色排序
        this.seriesData = this.seriesData.map((item, index) => {
            return {
                ...item,
                colorIndex: index % this.colorArray.length,
                itemStyle: {
                    color: this.colorArray[index % this.colorArray.length]
                }
            }
        })
        
        // 按颜色索引排序，相同颜色的数据会聚集在一起
        this.seriesData.sort((a, b) => a.colorIndex - b.colorIndex)
        
        this.$nextTick(() => {
            this.initBzxxCharts();
        })
    },
    mounted() {

        this.resizeHandler = () => {
            if (this.bzxxChart) {
                this.bzxxChart.resize()
            }
        }
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        // 清理事件监听器和图表实例
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        if (this.bzxxChart) {
            this.bzxxChart.dispose()
            this.bzxxChart = null
        }
    },
    methods: {
        initBzxxCharts() {
            this.bzxxChart = this.$echarts.init(document.getElementById('bzxx-charts'));
            let num = this.seriesData.reduce((acc, cur) => acc + cur.value, 0);
            let bzxxOption = {
                title: [{
                    text: num,
                    subtext: '总人数',
                    textAlign: 'center',
                    x: '33%',
                    y: '40%',
                    textStyle: {
                        fontSize: 22,
                        fontWeight: 'normal',
                        color: '#00FFFF',
                    },
                    subtextStyle: {
                        fontSize: 16,
                        fontWeight: 'normal',
                        align: "center",
                        color: '#fff'
                    },
                }],
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: '{b}: {c}人'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: '5%',
                    top: 'middle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    },
                    pageTextStyle: {
                        color: '#fff',
                        fontSize: 14
                    },

                },
                color: this.colorArray,
                series: [{
                    type: 'pie',
                    radius: ['60%', '80%'],
                    center: ['35%', '50%'],
                    data: this.seriesData,
                    label: {
                        show: false,
                        color: '#fff',
                        formatter: '{b}\n{c}人'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                }]
            };

            this.bzxxChart.setOption(bzxxOption);
            tooltipShow(this.bzxxChart, bzxxOption);


        }
        ,
    }

}
</script>