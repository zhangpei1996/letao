$(function () {
    /* 1.一级分类的默认渲染，以及第一个一级分类对应的二级分类 */
    getCategoryOneData(function (data) {
        let cateOneData = template('cate_one', {list:data.rows});
        $('.cate_left ul').html(cateOneData);
        let categoryId = $('.cate_left ul li:first-of-type').find('a').attr('data-id');
        /* 绑定事件 */
        initSecondTapHandle();
        /* 二级分类渲染 */
        rander(categoryId);
    });
    let initSecondTapHandle = function () {
         /* 2.点击一级分类加载对应的二级分类 */
        $('.cate_left ul li a').on('tap', function () {
            /* 优化：避免发生多次相同的ajax请求,当前状态为被选中时，不再次发送请求 */
            if ($(this).parent().hasClass('active')) return;
            let categoryId = $(this).attr('data-id');
            /* 更改选中的样式 */
            $(this).parent().addClass('active').siblings('li').removeClass('active');
            /* 二级分类渲染 */
            rander(categoryId);
        });
    };
});
/* 获取一级分类的数据 */
let getCategoryOneData = function (callback) {
    $.get('/category/queryTopCategory', {}, function (res) {
        callback && callback(res);
    });
};
/* 获取二级分类的数据 */
let getCategoryTwoData = function (params, callback) {
    $.get('/category/querySecondCategory', params, function (res) {
        callback && callback(res);
    });
};
/* 渲染二级分类的方法 */
let rander = function (cate_id) {
    getCategoryTwoData({
        id: cate_id
    }, function (data) {
        let cateTwoData = template('cate_two', {list:data.rows});
        $('.cate_right ul').html(cateTwoData);
    });
};