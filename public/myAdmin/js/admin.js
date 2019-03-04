/* 后台管理系统的公共的js文件 */

/* 1.进度显示 */
/* 了解jQuery关于ajax的方法 */
/* 不显示进度条后面的小圆圈 */
NProgress.configure({ showSpinner: false });
/* 当ajax发生请求---显示进度条 */
$(window).ajaxStart(function () {
    /* 开启进度条 */
    NProgress.start();
});
/* 当ajax请求中没响应过来---显示加载进度 */
/* 当ajax响应完成---结束进度条并隐藏 */
$(window).ajaxStop(function () {
    /* 结束进度条 */
    NProgress.done();
});

/* 2.侧边栏的显示隐藏 二级菜单的显示隐藏 */
$('.fold').on('click', function () {
    $('.sidebar').toggleClass('hidden');
    $('section').toggleClass('blowUp');
});
$('.menu a[href="javascript:;"]').on('click', function () {
    $(this).siblings('.child').slideToggle();
});

/* 3.退出功能 */
/* 使用在线工具转将 HTML格式的字符串 装换成 js拼接的字符串 */
let modalHTML = '<div class="modal fade" id="logoutModal">'+
            '        <div class="modal-dialog modal-sm">'+
            '          <div class="modal-content">'+
            '            <div class="modal-header">'+
            '              <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
            '              <h4 class="modal-title">温馨提示</h4>'+
            '            </div>'+
            '            <div class="modal-body">'+
            '              <p class="text-danger">您确定要退出后台管理系统吗？</p>'+
            '            </div>'+
            '            <div class="modal-footer">'+
            '              <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
            '              <button id="close" type="button" class="btn btn-primary">确定</button>'+
            '            </div>'+
            '          </div>'+
            '        </div>'+
            '    </div>';
$('body').append(modalHTML);
$('.exit').on('click', function () {
    let $logoutModal = $('#logoutModal');
    $logoutModal.modal('show').find('#close').on('click', function () {
        /* 退出业务 */
        $.ajax({
            type: 'get',
            url: '/employee/employeeLogout',
            data: {},
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    /* 退出成功 */
                    /* 关闭模态框 */
                    $logoutModal.modal('hide');
                    /* 跳转到登录页 */
                    location.href = '/myAdmin/login.html';
                }
            }
        });
    });
});