$(function () {
    $('.lt_login button').on('tap', function () {
        /* 登录功能
            1.获取表单序列化工具---必须要有name属性---获取到的是序列化字符串 key1=value1&key2=value2
            serialize()---序列化成字符串    serializeArray()序列化成数组
        */
        let data = $('.lt_login').serialize();
        /* 2.校验数据 */
        /* 2.1 先将序列化字符串转化为对象 */
        let dataObj = lt.serialize2object(data);
        /* 校验数据 */
        if (!dataObj.username) {
            mui.toast('请输入用户名');
            return;
        }
        if (!dataObj.password) {
            mui.toast('请输入密码');
            return;
        }
        $.post('/user/login', dataObj, function (res) {
            /* 获取url参数 */
            let url = location.search.replace('?returnUrl=', '');
            if (res.success == true) {
                if (url) {
                    /* 如果成功 有地址 根据传递过来的地址跳转 */
                    location.href = url;
                    return;
                } else {
                    /* 如果成功 没有地址 默认跳转到个人中心首页 */
                    location.href = lt.userUrl;
                    return;
                }
            } else {
                /* 登录失败---反馈信息 */
                mui.toast(res.message);
            }
        });
    });
});