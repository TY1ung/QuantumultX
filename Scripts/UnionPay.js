//兼容loon和qx
//获取cookie重写配置:
//Qx:https://youhui.95516.com/newsign/public/app/index.html url script-request-header https://gitee.com/passerby-b/javascript/raw/master/unipay.js
//Loon:http-request https://youhui.95516.com/newsign/public/app/index.html script-path=https://gitee.com/passerby-b/javascript/raw/master/unipay.js, requires-body=true, timeout=10, tag=云闪付签到
//打开重写后进入云闪付签到页面,提示获得Cookie即可,一定要等签到页面加载完成,获取cookie成功后立刻划掉云闪付后台
//添加MITM hostname:youhui.95516.com

var $tool = tool();
try {
    console.log("云闪付签到脚本开始!");
    var img = "https://is5-ssl.mzstatic.com/image/thumb/Purple114/v4/53/bc/b5/53bcb52a-6c33-67cc-0c70-faf4ffbdb71e/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-85-220.png/230x0w.png";
    if (typeof $request != "undefined") {
        if ($request.url.indexOf("youhui.95516.com/newsign/public/app/index.html") > -1) {
            var Cookie = $request.headers["Cookie"];
            if (!!Cookie) {
                $tool.setkeyval(Cookie, "UniCookie");
                $tool.notify("云闪付签到!", "获得Cookie", Cookie, { img: img });
            }
        }
    }
    else {
        var url = 'https://youhui.95516.com/newsign/api/daily_sign_in';
        var method = 'POST';
        var headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Origin': 'https://youhui.95516.com',
            'Cookie': $tool.getkeyval("UniCookie"),
            'Connection': 'keep-alive',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148/sa-sdk-ios  (com.unionpay.chsp) (cordova 4.5.4) (updebug 0) (version 807) (UnionPay/1.0 CloudPay) (clientVersion 137) (language zh_CN)',
            'Referer': 'https://youhui.95516.com/newsign/public/app/index.html',
            'Accept-Language': 'zh-cn'
        };
        var body = '';

        var myRequest = {
            url: url,
            method: method,
            headers: headers,
            body: body
        };

        $tool.post(myRequest, function (e, r, d) {
            console.log(d);
            var obj = JSON.parse(d);
            if (!!obj.signedIn) {
                if (obj.signedIn == true) {
                    var days = 0;
                    for (var item in obj.days) {
                        if (obj.days[item] == 1) {
                            days++;
                        }
                    }
                    $tool.notify("云闪付签到成功!", "首次签到时间:" + obj.startedAt, "已签到:" + days + "天!", { img: img });
                }
                else {
                    $tool.notify("云闪付签到失败!", d, d, { img: img });
                }
            }
            else {
                $tool.notify("云闪付签到失败!", d, d, { img: img });
            }
        })
        
    }

} catch (e) {
    console.log(e);
    $tool.notify("云闪付签到错误!", e, e, { img: img });
}
$done({});

//loon/quanx通用方法
function tool() {
    var isLoon = typeof $httpClient != "undefined";
    var isQuanX = typeof $task != "undefined";

    var obj = {
        //通知
        notify: function (title, subtitle, message, option) {
            var option_obj = {};
            if (isQuanX) {
                if (!!option) {
                    if (typeof option == "string") option_obj["open-url"] = option;
                    if (!!option.url) option_obj["open-url"] = option.url;
                    if (!!option.img) option_obj["media-url"] = option.img;
                    $notify(title, subtitle, message, option_obj);
                }
                else {
                    $notify(title, subtitle, message);
                }
            }
            if (isLoon) {
                if (!!option) {
                    if (typeof option == "string") option_obj["openUrl"] = option;
                    if (!!option.url) option_obj["openUrl"] = option.url;
                    if (!!option.img) option_obj["mediaUrl"] = option.img;
                    $notification.post(title, subtitle, message, option_obj);
                }
                else {
                    $notification.post(title, subtitle, message);
                }
            }
        },
        //get请求
        get: function (options, callback) {
            if (isQuanX) {
                if (typeof options == "string") options = { url: options }
                options["method"] = "GET"
                $task.fetch(options).then(function (response) {
                    callback(null, adapterStatus(response), response.body);
                }, function (reason) {
                    callback(reason.error, null, null);
                });
            }
            if (isLoon) {
                $httpClient.get(options, function (error, response, body) {
                    callback(error, adapterStatus(response), body);
                })
            }
        },
        //post请求
        post: function (options, callback) {
            if (isQuanX) {
                if (typeof options == "string") options = { url: options }
                options["method"] = "POST"
                $task.fetch(options).then(function (response) {
                    callback(null, adapterStatus(response), response.body);
                }, function (reason) {
                    callback(reason.error, null, null);
                });
            }
            if (isLoon) {
                $httpClient.post(options, function (error, response, body) {
                    callback(error, adapterStatus(response), body);
                })
            }
        },
        //Unicode解码
        unicode: function (str) {
            return unescape(str.replace(/\\u/gi, '%u'));
        },
        //url解码
        decodeurl: function (str) {
            return decodeURIComponent(str);
        },
        //对象转字符串
        json2str: function (obj) {
            return JSON.stringify(obj);
        },
        //字符串转对象
        str2json: function (str) {
            return JSON.parse(str);
        },
        //数据持久化写入
        setkeyval: function (value, key) {
            if (isQuanX) {
                $prefs.setValueForKey(value, key);
            }
            if (isLoon) {
                $persistentStore.write(value, key);
            }
        },
        //数据持久化读取
        getkeyval: function (key) {
            if (isQuanX) {
                return $prefs.valueForKey(key);
            }
            if (isLoon) {
                return $persistentStore.read(key);
            }
        }

    };

    function adapterStatus(response) {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status;
            } else if (response.statusCode) {
                response["status"] = response.statusCode;
            }
        }
        return response;
    }

    return obj;

};
