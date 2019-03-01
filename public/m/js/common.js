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
lt.userUrl = '/m/user/index.html';
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
/* 小知识：ie6、7等低版本浏览器未定义JSON对象，可以使用json2.js */
/* 将序列化字符串转化为对象
    key1=value1&key2=value2 --- 序列化字符串
*/
lt.serialize2object = function (serializeStr) {
    let obj = {};
    if (serializeStr) {
        let arr = serializeStr.split('&');
        arr.forEach(function (item, i) {
            let itemArr = item.split('=');
            obj[itemArr[0]] = itemArr[1];
        });
    }
    return obj;
};
/* 通过id获取数据 */
lt.getItemById = function (arr, id) {
    let obj = null;
    arr.forEach(function (item, i) {
        if (item.id == id) {
            obj = item;
        }
    });
    return obj;
};