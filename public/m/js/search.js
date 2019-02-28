$(function () {
    /* 初始化搜索记录 */
    initSearchHistory();
    /* 搜索按钮的事件 */
    searchBindTap();
    /* 清空历史记录的事件 */
    allRemoveHistory();
    /* 单个历史记录删除事件 */
    oneRemoveHistory();
    /* 搜索历史的点击事件 */
    localhostTap();
});
/* 初始化搜索记录 */
let initSearchHistory = function () {
    let history = window.localStorage.getItem('history');
    if (history) {
        let arr = JSON.parse(history);
        /* 使用模板 */
        let historyTemplate = template('historyTemplate', {list:arr});
        $('.lt_history ul').html(historyTemplate);
        $('.title').html('搜索历史');
        $('.icon_clear').show();
    } else {
        $('.title').html('没有历史搜索记录');
        $('.icon_clear').hide();
        $('.lt_history ul').empty();
    }
};
/* 清空历史记录的事件 */
let allRemoveHistory = function () {
    $('.icon_clear').on('tap', function () {
        /* 删除本地存储 */
        window.localStorage.removeItem('history');
        initSearchHistory();
    });
};
/* 单个历史记录删除事件 */
let oneRemoveHistory = function () {
    $('.lt_history ul').on('tap', '.icon_delete', function () {
        let value = $(this).prev('a').attr('data-key');
        let history = window.localStorage.getItem('history');
        let arr = JSON.parse(history);
        /* 如果只剩下一个记录，点击后清空本地存储 */
        if (arr.length == 1) {
            window.localStorage.removeItem('history');
            initSearchHistory();
            return;
        }
        let index = null;
        arr.forEach(function (item, i) {
            if (item == value) {
                index = i;
            }
        });
        arr.splice(index, 1);
        let str = JSON.stringify(arr);
        window.localStorage.setItem('history', str);
        initSearchHistory();
    });
};
/* 搜索按钮的事件 */
let searchBindTap = function () {
    $('.search').on('tap', function () {
        let value = $.trim($(this).prev('input').val());
        if (value) {
            /* 获取本地缓存 */
            let history = window.localStorage.getItem('history');
            /* 将json字符串转为json对象 */
            let data = [];
            if (history) {
                let arr = JSON.parse(history);
                for (let key in arr) {
                    data.push(arr[key]);
                }
            }
            data.push(value);
            /* 将json对象转为json字符串 */
            let str = JSON.stringify(data);
            /* 存储本地缓存 */
            window.localStorage.setItem('history', str);
            /* 跳转去搜索列表页，并且带上关键列表页 */
            window.location.href = 'searchList.html?key=' + value;
        } else {
            let $hint = $('<div>请输入搜索内容</div>').appendTo('.lt_wrapper').addClass('hint');
            setTimeout(function () {
                $hint.remove();
            }, 3000);
        }
    });   
};
/* 搜索历史的点击事件 */
let localhostTap = function () {
    $('.lt_history ul').on('tap', 'a', function () {
        let value = $(this).attr('data-key');
        window.location.href = 'searchList.html?key=' + value;
    });
};