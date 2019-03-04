$(function () {
    /* 数据可视化 */
    barCharts();
    pieCharts();
});
let barCharts = function () {
    let data = [
        {
            name: '一月',
            value: 300
        },
        {
            name: '二月',
            value: 200
        },
        {
            name: '三月',
            value: 400
        },
        {
            name: '四月',
            value: 100
        },
        {
            name: '五月',
            value: 500
        }
    ];
    let xData = [], yData = [];
    data.forEach(function (item, i) {
        xData.push(item.name);
        yData.push(item.value);
    });

    /* 1.引入 echarts.min.js 文件 */
    /* 2.找到画图的容器 */
    let box = document.querySelector('.picTable:first-of-type');
    /* 3.初始化插件 */
    let myChart = echarts.init(box);
    /* 4.配置参数 */
    let options = {
        title: {
            text: '2019年注册人数',
        },
        legend: {
            data: ['注册人数']
        },
        color: ['red'],
        tooltip : {},
        xAxis : [
            {
                data : ['星期一', '星期二', '星期三', '星期三', '星期四', '星期五', '星期六'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'注册人数',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    };
    /* 5.设置参数 */
    options.xAxis[0].data = xData;
    options.series[0].data = yData;
    myChart.setOption(options);
};
let pieCharts = function () {
    /* 1.引入 echarts.min.js 文件 */
    /* 2.找到画图的容器 */
    let box = document.querySelector('.picTable:last-of-type');
    /* 3.初始化插件 */
    let myChart = echarts.init(box);
    /* 4.配置参数 */
    let options = {
        title : {
            text: '品牌销售占比',
            subtext: '2019年3月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
            /* a -- series.name  b -- data.name c -- data.value */
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','李宁','乔丹','匡威']
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'李宁'},
                    {value:135, name:'乔丹'},
                    {value:1548, name:'匡威'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    /* 5.设置参数 */
    myChart.setOption(options);
};