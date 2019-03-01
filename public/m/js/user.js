$(function () {
    /* 1.获取登录用户名与手机号 */
    lt.loginAjax({
        type: 'get',
        url: '/user/queryUserMessage',
        data: {},
        dataType: 'json',
        success: function (res) {
            setTimeout(function () {
                /* 显示用户名与绑定手机 */
                $('#username').html(res.username);
                $('#tel').html(res.mobile);
            }, 1000);
        }
    });
    /* 2.退出登录 */
    $('.logout button').on('tap', function () {
        $.get('/user/logout', {}, function (res) {
            if (res.success == true) {
                /* 退出成功 跳转到登录页面 */
                location.href = lt.loginUrl;
            }
        });
    });
});