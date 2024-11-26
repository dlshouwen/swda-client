/*!
 * browser
 * @include none
 * @author liujingcheng@live.cn
 * @copyright 2018
 */

/**
 * get broswer type
 * @return browser type
 */
export function getBrowserType() {
	// get user agent
	var userAgent = navigator.userAgent;
	// get webkit
	if(userAgent.indexOf('Opera')>-1) return 'opera';
	if(userAgent.indexOf('Firefox')>-1) return 'firefox';
	if(userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edg")==-1) return 'chrome';
	if(userAgent.indexOf("Chrome")==-1 && userAgent.indexOf('Safari')>-1) return 'safari';
	if(userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edg")>-1) return 'ie_edge_chromium';
	if(userAgent.indexOf("Chrome")==-1 && userAgent.indexOf("Edge")>-1) return 'ie_edge';
	// if ie webkit
	var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && userAgent.indexOf('Opera')==-1;
	if (isIE) {
		// get ie version
		var ieRegex = new RegExp('MSIE (\\d+\\.\\d+);');
		ieRegex.test(userAgent);
		var ieVersion = parseFloat(RegExp.$1);
		if (ieVersion==6) return 'ie6';
		if (ieVersion==7) return 'ie7';
		if (ieVersion==8) return 'ie8';
		if (ieVersion==9) return 'ie9';
		if (ieVersion==10) return 'ie10';
		if (ieVersion==11) return 'ie11';
	}
	// return
	return 'unknow';
}

/**
 * is lower ie
 * @return browser is lower ie
 */
export function isLowerIE() {
	var browserType = getBrowserType();
	if (browserType === 'ie6' || browserType === 'ie7' || browserType === 'ie8') {
		return true;
	}
	return false;
}