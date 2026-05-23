<template>
    <div style="width: 100%; height: 100%; position: relative;">
        <LoadingIndicator v-if="load" />
        <div v-show="!load" id="safetyIssuesChart" style="width: 100%; height: 100%;"></div>
    </div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { getSafetyHidden } from '@/api/index'
export default {
    components: {
        LoadingIndicator
    },
    data() {
        return {
            safetyHazards: [],
            safetyIssuesChart: null,//安全预警图表
            resizeHandler: null,
            load: true // 加载状态
        }
    },
    async created() {
        this.safetyHazards = await this.getSafetyHidden()
        this.load = false;
        this.safetyHazards = this.safetyHazards.filter(item => item.value !== 0)
        if (this.safetyHazards.length === 0) {
            this.safetyHazards = [{ name: '暂无数据', value: 0 }]
        }
        setTimeout(() => {
            this.$nextTick(() => {
                this.initPotentialSafetyHazard();
            });
        }, 100);

    },
    mounted() {
        // this.initPotentialSafetyHazard();
        this.resizeHandler = () => {
            if (this.safetyIssuesChart) {
                this.safetyIssuesChart.resize()
            }
        }
        window.addEventListener('resize', this.resizeHandler)
    },
    beforeDestroy() {
        // 清理事件监听器和图表实例
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler)
        }
        if (this.safetyIssuesChart) {
            this.safetyIssuesChart.dispose()
            this.safetyIssuesChart = null
        }
    },
    methods: {
        getSafetyHidden() {
            return getSafetyHidden({ limit: 10 }).then(res => res.data)
        },
        initPotentialSafetyHazard() {
            this.safetyIssuesChart = this.$echarts.init(document.getElementById('safetyIssuesChart'));
            let num = this.safetyHazards.reduce((sum, item) => sum + item.value, 0)
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {d}% <br/> {c}",
                    backgroundColor: 'rgba(0, 178, 255, .8)',
                    borderColor: 'rgba(108, 192, 255, 0.5)',
                    textStyle: {
                        color: '#fff'
                    },
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: '15%',
                    top: 'middle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12
                    }
                },
                title: {
                    text: num,
                    subtext: '总数',
                    textAlign: 'center',
                    x: '29%',
                    y: '30%',
                    textStyle: {
                        fontSize: 22,
                        fontWeight: 'normal',
                        color: '#00FFFF',
                    },
                    subtextStyle: {
                        fontSize: 18,
                        fontWeight: 'normal',
                        align: "center",
                        color: '#fff'
                    },
                },
                color: ['#3A7BFF', '#36C976','#FF8C00', '#FF4500', '#FFC000', '#FF6B4A', '#FF6A00'],
                series: [{
                    type: 'pie',
                    radius: ['60%', '90%'],
                    center: ['30%', '50%'],
                    itemStyle: {
                        // normal: {
                        //     borderWidth: 5,
                        //     borderColor: '#031845',
                        // }
                    },
                    data: this.safetyHazards,
                    labelLine: {
                        normal: {
                            show: false,
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                        }
                    }
                }]
            };
            this.safetyIssuesChart.setOption(option);
            tooltipShow(this.safetyIssuesChart, option)
        }
    },//安全隐患情况
}
</script>