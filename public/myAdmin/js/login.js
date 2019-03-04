$(function () {
    /* 初始化校验插件 */
    /* 1.是form表单结构，并且有一个提交按钮 */
    /* 2.这插件就是jQuery插件，样式和BootStrap风格一致 */
    $('#login').bootstrapValidator({
        /* 配置校验的不同的状态下现实的图标 */
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /* 需要校验的表单，通过表单的name */
        fields: {
            /* 对应表单元素的name */
            username: {
                /* 校验规则---可以有多个 */
                validators: {
                    /* 非空校验 */
                    notEmpty: {
                        message: '请输入用户名'
                    },
                    /* 配置一个后台校验失败的校验规则 */
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '请输入密码'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '密码必须是6到18个字符'
                    },
                    callback: {
                        message: '用户名与密码不匹配'
                    }
                }
            }
        }

    }).on('success.form.bv', function(e) {
        /* 阻止默认事件---阻止表单的默认提交，因为我们要使用ajax提交 */
        e.preventDefault();
        /* 后台校验用户名和密码 */
        let $form = $(e.target);
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $form.serialize(),
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    /* 业务成功 */
                    /* 跳转到后台首页 */
                    location.href = '/myAdmin/index.html';
                } else {
                    /* 业务失败 */
                    if (res.error == 1000) {
                        /* 用户名错误 */
                        /* 设置用户名这个表单元素的校验状态为失败 */
                        /* NOT_VALIDATED--还没校验, VALIDATING--校验中, INVALID--校验失败 or VALID--校验成功 */
                        /* 1.获取校验组件 */
                        /* 2.调用更改状态的函数---三个参数
                            1.校验的表单，
                            2.改成什么状态 
                            3.是用哪个校验规则
                        */
                        $form.data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
                    } else if (res.error == 1001) {
                        /* 密码错误 */
                        $form.data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
                    }
                }
            }
        });
    });
});