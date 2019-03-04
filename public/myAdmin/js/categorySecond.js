$(function () {
    /* 模板请求的内部无法访问外部变量的解决方案 */
    /* 辅助方法，在模板的内部可以使用的方法 */
    /* template.helper('getJquery', function () {
        return jQuery;
    }); */

    /* 1.默认第一页展示 */
    window.page = 1;
    let render = function () {
        getCateSecondData(function (data) {
            /* 模板渲染 */
            $('tbody').html(template('list', data));
            /* 2.分页展示 */ 
            $('.pagination').bootstrapPaginator({
                /* 对应的BootStrap的版本 */
                bootstrapMajorVersion: 3,
                /* 分页按钮的大小 */
                size: 'small',
                /* 当前显示的页码 */
                currentPage: data.page,
                /* 一共多少页 */
                totalPages: Math.ceil(data.total / data.size),
                /* 页码按钮的数量，默认是5 */
                numberOfPages: 3,
                /* 点击按钮渲染功能，监听按钮的点击事件，获取点击的时候的页码 */
                onPageClicked: function (event, originalEvent, type, page) {
                    /* 
                        event:jQuery的事件对象
                        originalEvent:原生DOM的事件对象
                        type:按钮的类型
                        page:按钮对应的页码
                    */
                   /* 重新渲染页面 */
                    window.page = page;
                    render();
                }
            });
        });
    };
    render();
    /* 3.点击添加分类弹窗 */
    getCateFirstData(function (data) {
        $('.dropdown-menu').html(template('dropDown', data)).find('a').on('click', function () {
            let category = $(this).html();
            let categoryId = $(this).attr('data-id');
            /* 显示选中分类的名称 */
            $('#firstCategory').html(category);
            /* 给隐藏的ID表单赋值 */
            $('#categoryId').val(categoryId);
            /* 改校验状态 */
            $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
        });
    });
    /* 4.点击确认按钮  提交(一级分类id，二级分类名称，二级分类的log) */
    initFileUpload();
    $('#form').bootstrapValidator({
        /* 默认校验的表单元素不包含隐藏的----需要手动放开 */
        excluded: [],
        /* 配置校验的不同的状态下现实的图标 */
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /* 需要校验的表单，通过表单的name */
        fields: {
            /* 对应表单元素的name */
            categoryId: {
                /* 校验规则---可以有多个 */
                validators: {
                    /* 非空校验 */
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传logo'
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
            url: '/category/addSecondCategory',
            data: $form.serialize(),
            dataType: 'json',
            success: function (res) {
                if (res.success == true) {
                    window.page = 1;
                    render();
                    $('#insert').modal('hide');
                }
            }
        });
    });
});
/* 获取二级分类数据的方法 */
let getCateSecondData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategoryPaging',
        data: {
            page: window.page || 1,
            pageSize: 2
        },
        dataType: 'json',
        success: function (res) {
            callback && callback(res);
        }
    });
};
/* 获取一级分类的数据 */
let getCateFirstData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategoryPaging',
        data: {
            page: 1,
            pageSize: 100000
        },
        dataType: 'json',
        success: function (res) {
            callback && callback(res);
        }
    });
};
/* 初始化文件上传插件 */
let initFileUpload = function () {
    $('[name="pic1"]').fileupload({
        url: '/category/addSecondCategoryPic',
        dataType:'json',
        done:function (e, data) {
            $('#uploadImg').attr('src', data.result.picAddr);
            $('#brandLogo').val(data.result.picAddr);
            /* 改校验状态 */
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
    });
};