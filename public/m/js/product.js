$(function () {
    /* 获取url地址传递的参数 */
    let urlParams = lt.getParamsByURL();
    getProductData({id:urlParams.productId}, function (data) {
        setTimeout(() => {
            /* 渲染页面 */
            let productTemplate = template('productTemplate', {list:data});
            $('.mui-scroll').html(productTemplate);
            /* 区域滚动 */
            mui('.mui-scroll-wrapper').scroll({
                indicators: false, //是否显示滚动条
            }); 
            /* 初始化轮播图 */
            mui('.mui-slider').slider({
                interval: 3000
            });
        }, 1000);
    });
});
/* 获取商品参数 */
let getProductData = function (productId, callback) {
    $.get('/product/queryProductDetail', productId, function (res) {
        callback && callback(res);
    });
}