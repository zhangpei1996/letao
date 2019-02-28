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

            /* 尺码的选择 */
            $('.btn_size').on('tap', function () {
                $(this).addClass('now').siblings('span').removeClass('now');
            });
            /* 数量的选择 */
            $('.p_number span').on('tap', function () {
                let $input = $(this).siblings('input');
                let currentNum = $input.val();
                if ($(this).hasClass('jian')) {
                    if (currentNum == 0) {
                        return;
                    }
                    currentNum--;
                } else if ($(this).hasClass('jia')) {
                    if (currentNum >= parseInt($input.attr('data-max'))) {
                        /* 消息框点击的时候会消失  正好和+号重叠在一起(击穿--点击穿透 tap特有的)  使用延时处理 */
                        setTimeout(() => {
                            mui.toast('库存不足');
                        }, 100);
                        return;
                    }
                    currentNum++;
                }
                $input.val(currentNum);
            });
            /* 加入购物车 */
            $('.btn_addCart').on('tap', function () {
                /* 数据校验 */
                let $changeBtn = $('.btn_size.now');
                if (!$changeBtn.length) {
                    mui.toast('请选择尺码');
                    return;
                }
                let $size = $changeBtn.text();
                let $num = $('.p_number input').val();
                if ($num <= 0) {
                    mui.toast('请选择数量');
                    return;
                }
                /* 提交数据 */
                $.post('/cart/addCart', {
                    productId: urlParams.productId,
                    num: $num,
                    size: $size
                }, function (res) {
                    console.log(res);
                    if (res.error == 400) {
                        /* 代表未登录 跳转到登录页 并且把当前地址传递给登录页面 登陆成功后跳转回原页面 */
                        return;
                    }
                });
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