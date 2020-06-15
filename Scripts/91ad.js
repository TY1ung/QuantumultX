var url = $request.url;
if (url.match("ads")) {
	$done({path: ""})
} else {
	$done({})
}
