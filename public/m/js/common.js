let lt = {};
lt.getParamsByURL = function () {
    /* 以对象存储地址栏信息 */
    let paramas = {};
    let search = location.search;
    if (search) {
        let str = search.substring(1);
        /* 如果有多个参数 */
        let arr = str.split('&');
        arr.forEach(function (item, i) {
            let itemArr = item.split('=');
            paramas[itemArr[0]] = itemArr[1];
        });
        return paramas;
    }
    return;
};
/* 需要登录的ajax请求 */
lt.loginUrl = '/m/user/login.html';
lt.cartUrl = '/m/user/cart.html';
lt.loginAjax = function (params) {
    $.ajax({
        type: params.type || 'get',
        url: params.url || '#',
        data: params.data || '',
        dataType: params.dataType || 'json', 
        success: function (res) {
            /* 未登录的处理 {error: 400, message: "未登录！"} 所有的需要登录的接口，没有登录都会返回这样的数据 */
            if (res.error == 400) {
                /* 跳转到登录页 */
                location.href = lt.loginUrl + '?returnUrl=' + location.href;
                return;
            } else {
                params.success && params.success(res);
            }
        },
        error: function () {
            /* ajax 请求发送失败 */
            mui.toast('服务器繁忙');
        }
    });
};