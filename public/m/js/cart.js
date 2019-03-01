$(function () {
    /* 区域滚动 */
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //是否显示滚动条
    }); 
    /* 1.初始化页面  自动下拉刷新 */
    /* 初始化下拉刷新---因为购物车的数据是一次性加载完成的所以不需要上拉加载 */
    mui.init({
        pullRefresh : {
            /* 上拉与下拉容器 */
            container:"#refreshContainer",
            /* 5.用户下拉的时候，根据当前条件刷新，上拉加载重置，排序功能也重置 */
            down : {
                /* 自动加载 */
                auto: true,
                callback:function () {
                    let that = this;
                    /* 拿到组件对象，挂靠到window对象下面，用于下面自已触发下拉刷新 */
                    // window.down = this;
                    setTimeout(() => {
                        /* 获取数据 */
                        getCartData(function (data) {
                            /* 渲染页面 */
                            let cartTemplate = template('cartTemplate', {list:data.data});
                            $('#cartProductList').html(cartTemplate);
                            /* 注意：停止下拉刷新状态 */
                            that.endPulldownToRefresh();
                        });
                    }, 1000);
                } 
            }
        }
    });
    
    $('#cartProductList').on('tap', '.mui-icon-compose', function () {
        /* 2.侧滑的时候 点击编辑 弹出对话框(尺码，数量) */
        let id = $(this).parent().attr('data-id');
        let item = lt.getItemById(window.cartData, id);
        let edit = template('edit', {list:item});
        /* 传递HTML格式的字符串 
            confirm()---默认会将会将/n准换位<br> /t转换为空格
            所以需要自己处理<br>
        */
		mui.confirm(edit.replace(/\n/g, ''), '商品编辑', ['确认', '取消'], function(e) {
			if (e.index == 0) {
                /* 发送请求 */
                let size = $('.btn_size.now').text();
                let num = $('.p_number input').val();
                lt.loginAjax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.success == true) {
                            /* 列表更新 */
                            /* 更改数据 */
                            item.size = size;
                            item.num = num;
                            /* 浅拷贝---指向相同---缓存的数据也已经更改 */
                            let cartTemplate = template('cartTemplate', {list:window.cartData});
                            $('#cartProductList').html(cartTemplate);
                        } else {
                            mui.toast(res.message);
                            return;
                        }
                    }
                });
			} else {
				/* 取消修改，保持原样 */
            }
		})
    }).on('tap', '.mui-icon-trash', function () {
        /* 3.侧滑的时候 点击删除 弹出对话框  确认框 */
        let id = $(this).parent().attr('data-id');
        let $this = $(this);
        mui.confirm('你要删除这件商品吗？', '温馨提示', ['确认', '取消'], function(e) {
			if (e.index == 0) {
                /* 发送请求 */
                let size = $('.btn_size.now').text();
                let num = $('.p_number input').val();
                lt.loginAjax({
                    type: 'get',
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.success == true) {
                            /* 删除成功在页面上清除这条商品信息 */
                            $this.parent().parent().remove();
                            /* 重新计算总金额 */
                            setAmount();
                        } else {
                           
                        }
                    }
                });
			} else {
				/* 取消删除，保持原样 */
            }
		})
    });
    $('body').on('tap', '.btn_size', function () {
        $(this).addClass('now').siblings('span').removeClass('now');
    });
    $('body').on('tap', '.p_number span', function () {
        let $input = $(this).siblings('input');
        let currentNum = $input.val();
        if ($(this).hasClass('jian')) {
            if (currentNum <= 0) {
                mui.toast('至少一件商品');
                return;
            }
            currentNum--;
        } else if ($(this).hasClass('jia')) {
            if (currentNum >= parseInt($input.attr('data-max'))) {
                /* 消息框点击的时候会消失  正好和+号重叠在一起(击穿--点击穿透 tap特有的)  使用延时处理 */
                setTimeout(() => {
                    mui.toast('库存不足');
                }, 100);
                return;
            }
            currentNum++;
        }
        $input.val(currentNum);
    });
    /* 4.点击刷新按钮 刷新 */
    $('.fa-refresh').on('tap', function () {
        /* 刷新---主动触发下拉刷新 */
        // window.down.pulldownLoading();
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });
    /* 5.点击复选框 计算总金额 */
    $('body').on('change', '[type=checkbox]', function () {
        /* 总金额 = 每个商品数量 * 单价 * 数量 */
        setAmount();
    });
});
/* 获取购物车数据 */
let getCartData = function (callback) {
    lt.loginAjax({
        type: 'get',
        url: '/cart/queryCartPaging',
        data: {
            page: 1,
            /* 不产生分页 */
            pageSize: 100
        },
        dataType: 'json',
        success: function (res) {
            /* 缓存数据 */
            window.cartData = res.data;
            callback && callback(res);
        }
    });
};
/* 计算总金额 */
let setAmount = function () {
    /* 拿到所有被选中的复选框 */
    let $checkedBox = $('[type=checkbox]:checked');
    /* 获取选中商品的ID */
    let totalMoney = 0;
    $checkedBox.each(function (i, item) {
        let id = $(item).attr('data-id');
        let obj = lt.getItemById(window.cartData, id);
        let num = obj.num;
        let price = obj.price;
        totalMoney += price * num;
    });
    /* 取小数点后两位数 */
    if (Math.floor(totalMoney * 100) % 10) {
        totalMoney = Math.floor(totalMoney * 100) / 100;
    } else {
        totalMoney = Math.floor(totalMoney * 100) / 100;
        totalMoney = String(totalMoney) + '0';
    }
    $('#cartAmount').text(totalMoney);
};