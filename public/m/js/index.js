$(function () {
    /* 区域滚动 */
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
    });
    /* 轮播图 */
    mui('.mui-slider').slider({
        interval: 3000
    });
});