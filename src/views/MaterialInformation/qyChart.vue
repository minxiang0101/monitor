<template>
    <div id="qy-chart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import tooltipShow from "roc-tooltip-show";
export default {
    data() {
        return {
            myChart: null,//安全预警图表
            resizeHandler: null,
            xAxisData: ['混凝土', '砂浆', '水泥', '钢筋', '砖', '防水材料', '橡合剂'],
            seriesData: [
                { name: '混凝土', value: 95 },
                { name: '砂浆', value: 80 },
                { name: '水泥', value: 25 },
                { name: '钢筋', value: 78 },
                { name: '砖', value: 60 },
                { name: '防水材料', value: 45 },
                { name: '橡合剂', value: 10 },
                { name: '粉煤灰', value: 30 }
            ]
        }
    },
    mounted() {
        this.initQyChart();
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
        initQyChart() {
           this.myChart = this.$echarts.init(document.getElementById('qy-chart'));

            // // 材料数据
            // const materials = [
            //     { name: '混凝土', value: 95 },
            //     { name: '砂浆', value: 80 },
            //     { name: '水泥', value: 25 },
            //     { name: '钢筋', value: 78 },
            //     { name: '砖', value: 60 },
            //     { name: '防水材料', value: 45 },
            //     { name: '橡合剂', value: 10 },
            //     { name: '粉煤灰', value: 30 }
            // ];

            // 创建布局网格
            const grid = {
                top: '1%',
                bottom: '2%',
                left: '3%',
                right: '3%',
                containLabel: true
            };

            // 计算每个图表的位置
            const positions = [];
            const rows = 2;
            const cols = 4;
            const width = (100 - grid.left - grid.right) / cols;
            const height = (100 - grid.top - grid.bottom) / rows;

            for (let i = 0; i < this.seriesData.length; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                positions.push([
                    grid.left + col * width,
                    grid.top + row * height,
                    width,
                    height
                ]);
            }

            // 创建系列数据
            const series = this.seriesData.map((item, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                const centerX = (col * (100 / cols)) + (50 / cols);
                const centerY = (row * (100 / rows)) + (50 / rows);

                return {
                    name: item.name,
                    type: 'pie',
                    radius: ['20%', '26%'],
                    center: [centerX + '%', centerY + '%'],
                    startAngle: 90,
                    label: {
                        show: true,
                        position: 'center',
                        formatter: item.value + '%',
                        fontSize: 16,
                        color: '#fff',
                        // padding: [0, 0, 20, 0]
                    },
                    data: [
                        {
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#00FFFF' },
                                    { offset: 1, color: '#4B9EFF' }
                                ])
                            }
                        },
                        {
                            value: 100 - item.value,
                            name: 'gap',
                            itemStyle: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    ],

                };
            });

            const option = {
                grid,
                series,
                title: this.seriesData.map((item, index) => {
                    const row = Math.floor(index / cols);
                    const col = index % cols;
                    const centerX = (col * (100 / cols)) + (50 / cols);
                    const centerY = (row * (100 / rows)) + (50 / rows);
                    return {
                        text: item.name,
                        left: centerX + '%',
                        top: centerY + 16 + '%',
                        textAlign: 'center',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: '300'
                        }
                    };
                })
            };

            this.myChart.setOption(option);
            tooltipShow(this.myChart, option)


        },
    }
}
</script>