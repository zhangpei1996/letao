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