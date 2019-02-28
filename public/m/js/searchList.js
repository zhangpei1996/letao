$(function () {
    /* 区域滚动 */
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
    }); 
    /* 1.页面初始化得到时候：
            1.1关键字在搜索框中显示
            1.2根据关键字查询第一页数据4条    
    */
    // 获取关键字
    let urlParams = lt.getParamsByURL();
    let $input = $('.lt_search input').val(urlParams.key);
    
    /* 因为下方设置了自动刷新，所以此处不再需要默认渲染 */
	/* getSearchData({
        proName: urlParams.key,
        page: 1,
        pageSize: 4
    }, function (data) {
        let productList = template('productList', {list:data.data});
        $('.pro_item').html(productList);
    }); */

    /* 2.用户点击搜索的时候
            2.1根据新的关键字搜索商品
            2.2重置排序功能
     */
    $('.lt_search a').on('tap', function () {
        let key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return;
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function (data) {
            let productList = template('productList', {list:data.data});
            $('.pro_item').html(productList);
            /* 重置上拉加载 */
            mui('#refreshContainer').pullRefresh().refresh(true);
        });
    });
    /* 4.用户点击排序的时候
            4.1根据排序的选项去进行排序(默认的时候是 降序 再次点击的时候 升序)
    */
    $('.lt_order a').on('tap', function () {
        /* 保证搜索框内有内容才能排序 */
        let key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return;
        }
        /* 改变当前样式 */
        if ($(this).hasClass('active')) {
            /* 已经被选中 */
            /* 如果已经选择了  改变箭头的方向 */
            if ($(this).find('span').hasClass('fa-angle-up')) {
                $(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            } else {
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }
        } else {
            /* 没被选中 */
            $(this).addClass('active').siblings().removeClass('active').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        /* 获取当前点击功能的参数 */
        /* 获取数据 */
        let orderType = $(this).attr('data-type');
        let order = $(this).find('span').hasClass('fa-angle-up') ? 1 : 2;
        let params = {
            proName: key,
            page: 1,
            pageSize: 4,
            /* 排序的方式 */
        }
        params[orderType] = order;
        getSearchData(params, function (data) {
            let productList = template('productList', {list:data.data});
            $('.pro_item').html(productList);
            /* 重置上拉加载 */
            mui('#refreshContainer').pullRefresh().refresh(true);
        });
    });
   
    mui.init({
        pullRefresh : {
            /* 上拉与下拉容器 */
            container:"#refreshContainer",
            /* 5.用户下拉的时候，根据当前条件刷新，上拉加载重置，排序功能也重置 */
            down : {
                /* 自动加载 */
                auto: true,
                callback:function () {
                    /* 获取组件对象 */
                    let that = this;
                    /* 去后台获取数据 */
                    let key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return;
                    }
                    /* 重置排序样式 */
                    $('.lt_order a').removeClass('active').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                    getSearchData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        setTimeout(() => {
                            let productList = template('productList', {list:data.data});
                            $('.pro_item').html(productList);
                            /* 注意：停止下拉刷新状态 */
                            that.endPulldownToRefresh();
                            /* 重置上拉加载状态 */
                            that.refresh(true);
                        }, 2000);
                    });
                } 
            },
            /* 6.用户上拉的时候，加载下一页(没有数据就不再加载) */
            up : {
                callback : function () {
                    window.page++;
                    /* 获取组件对象 */
                    let that = this;
                    /* 去后台获取数据 */
                    let key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return;
                    }
                    let orderType = $('.lt_order a.active').attr('data-type');
                    let order = $('.lt_order a.active').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    let params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4,
                        /* 排序的方式 */
                    }
                    params[orderType] = order;
                    /* 重置排序样式 */
                    getSearchData(params, function (data) {
                        setTimeout(() => {
                            let productList = template('productList', {list:data.data});
                            $('.pro_item').append(productList);
                            /* 注意：停止上拉加载状态 */
                            if (data.data.length > 0) {
                                that.endPullupToRefresh(false);
                            } else {
                                /* 后台没有数据了，禁止上拉加载 */
                                that.endPullupToRefresh(true);
                            }
                        }, 2000);
                    });
                }
            }
        }
    });
});
/* 专门获取后台数据的函数 */
let getSearchData = function (params, callback) {
    $.get('/product/queryProduct', params, function (res) {
        /* 存储当前页码 */
        window.page = res.page;
        callback && callback(res);
    });
};