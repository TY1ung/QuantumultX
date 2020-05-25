/*
微博国际版去除开屏广告及时间线广告

[Rule]
URL-REGEX,^https://weibointl.api.weibo.cn/portal.php\?a=get_coopen_ads,REJECT-TINYGIF

[MITM]
hostname = weibointl.api.weibo.cn, api.weibo.cn

[Script]
http-response ^https?://api\.weibo\.cn/2/(statuses|groups)/(unread_hot_|friends_)?timeline requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/wubulaba/surgescript/master/Script/WeiboInt.js,script-update-interval=0
*/

let body = JSON.parse($response.body);

if (body["ad"]) body["ad"] = [];
if (body["advertises"]) body["advertises"] = [];
if (body["statuses"] && body["statuses"].length > 0) {
  let i = body["statuses"].length;
  while (i--) {
    if (body["statuses"][i]["ad_state"]) {
      delete body["statuses"][i];
    }
  }
}

$done({ body: JSON.stringify(body) });
