/*
Lensa人像修图解锁

[MITM]
hostname = subscription-service.neuralprisma.com

[Script]
http-response ^https?:\/\/subscription-service\.neuralprisma\.com\/subscription_get requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Xu1o/Surge/master/Script/Lensa.js,script-update-interval=0
*/

var obj = JSON.parse($response.body); 
obj['is_valid'] = true;
obj['is_trial'] = true;
obj['expiration_date'] = '2970-01-01T00:00:00Z';
$done({body: JSON.stringify(obj)});
