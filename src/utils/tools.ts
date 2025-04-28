// import sm2
import { sm2 } from 'sm-crypto'

// import config
import config from '@/config';

/**
 * path to camel
 * @param path
 * @returns camel path
 */
export const path2Camel = (path:string): string => {
	return path.replace(/\/(\w)/g, (all, letter)=>letter.toUpperCase())
}

/**
 * is external link
 * @param url
 * @returns link is external
 */
export const isExternalLink = (url:string): boolean => {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

/**
 * parse url
 * @param user
 * @returns parsed url
 */
export const parseUrl = (url: string): string => {
	return url.replace('{{url.api}}', config.url.api)
}

/**
 * uuid
 * @param split
 * @returns uuid
 */
export const uuid = (split: string = '-'):string => {
	let uuid = ''
	for (let i = 0; i < 32; i++) {
		let random = (Math.random() * 16) | 0
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += split
		}
		uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
	}
	return uuid
}

/**
 * sm2 encrypt
 * @param data
 * @return encrypt data
 */
export const sm2Encrypt = (data: string): string => {
	return '04' + sm2.doEncrypt(data, config.app.sm2, 1)
}

/**
 * search cascader id
 * @param datas
 * @param id
 * @param top
 * @return search result array
 */
export const searchCascaderId = (datas:any[], id:any, top:any, idProperty='id', pidProperty='pid', valueProperty='value', childrenProperty='children') => {
	const result:any[] = []
	const iterateFunc = function(_datas:any[], _id:any) {
		for (let i=0; i<_datas.length; i++) {
			const item = _datas[i]
			if (item[idProperty]==_id) {
				result.push(item[valueProperty])
				if(item[pidProperty]!=top){
					iterateFunc(datas, item[pidProperty])
				}
				break
			}else{
				if(item[childrenProperty]) {
					iterateFunc(item[childrenProperty], _id)
				}
			}
		}
	}
	iterateFunc(datas, id)
	result.reverse()
	return result
}


/**
 * format date
 * @param date
 * @param format
 * @return formated data
 */
export const formatDate = (date, format)=>{
	if(date==''){
		return ''
	}
	if(date.time){
		date = new Date(date.time)
	}
	var o = {
		"M+" : date.getMonth()+1, //month
		"d+" : date.getDate(),    //day
		"h+" : date.getHours(),   //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"S" : date.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format))
		format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length))
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length))
	return format
}

/**
 * parse date
 * @param date
 * @param pattern y-year / M-month / d-day / h-hours / m-minute / s-seconds / S-millisecond
 * @return date
 */
export const parseDate = (date, pattern)=>{
	if (!pattern||pattern == null)
		pattern = 'yyyy-MM-dd hh:mm:ss';
	var compare = {
		'y+' : 'y',
		'M+' : 'M',
		'd+' : 'd',
		'h+' : 'h',
		'm+' : 'm',
		's+' : 's'
	};
	var result = {
		'y' : '',
		'M' : '',
		'd' : '',
		'h' : '00',
		'm' : '00',
		's' : '00'
	};
	var tmp = pattern;
	for ( var k in compare) {
		if (new RegExp('(' + k + ')').test(pattern)) {
			result[compare[k]] = date.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length)
		}
	}
	return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s'])
}

/**
 * format seconds
 * @param seconds
 * @return 格式化后的字符串
 */
export const formatSeconds = (seconds)=>{
	var theTime = parseInt(seconds)
	var theTime1 = 0
	var theTime2 = 0
	var theTime3 = 0
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60)
		theTime = parseInt(theTime % 60)
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60)
			theTime1 = parseInt(theTime1 % 60)
			if (theTime2 > 24) {
				theTime3 = parseInt(theTime2 / 24)
				theTime2 = parseInt(theTime2 % 24)
			}
		}
	}
	var result = ''
	if (theTime > 0) {
		result = "" + parseInt(theTime) + "秒"
	}
	if (theTime1 > 0) {
		result = "" + parseInt(theTime1) + "分" + result
	}
	if (theTime2 > 0) {
		result = "" + parseInt(theTime2) + "小时" + result
	}
	if (theTime3 > 0) {
		result = "" + parseInt(theTime3) + "天" + result
	}
	return result
}

/**
 * format file size
 * @param size
 * @param precision
 * @returns formated file size
 */
export const formatFileSize = (size: number, precision: number = 2): string => {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	let index = Math.floor(Math.log(size)/Math.log(1024))
	return (size/Math.pow(1024, index)).toFixed(precision) + '' + units[index]
}

/**
 * format number
 * @param number
 * @param pattern
 * @return formated number
 */
export const formatNumber = (number, pattern)=>{
	var negFlag = "false";
	var str = Number(number).toString();
	if (str.indexOf("-")==0){
		negFlag = "true";
		str = str.replace("-","");
		number = -number;
	}
	var strInt;
	var strFloat;
	var formatInt;
	var formatFloat;
	if(str=="")
		return "";
	if(/\./g.test(pattern)){
		formatInt = pattern.split('.')[0];
		formatFloat = pattern.split('.')[1];
	}else{
		formatInt = pattern;
		formatFloat = null;
	}
	if(/\./g.test(str)){
		if(formatFloat!=null){
			var tempFloat = Math.round(parseFloat('0.'+str.split('.')[1])*Math.pow(10,formatFloat.length))/Math.pow(10,formatFloat.length);
			strInt = (Math.floor(number)+Math.floor(tempFloat)).toString();
			strFloat = /\./g.test(tempFloat.toString())?tempFloat.toString().split('.')[1]:'0';
		}else{
			strInt = Math.round(number).toString();
			strFloat = '0';
		}
	}else{
		strInt = str;
		strFloat = '0';
	}
	if(formatInt!=null){
		var outputInt = '';
		var zero = formatInt.match(/0*$/)[0].length;
		var comma = null;
		if(/,/g.test(formatInt)){
			comma = formatInt.match(/,[^,]*/)[0].length-1;
		}
		var newReg = new RegExp('(\\d{'+comma+'})','g');
		if(strInt.length<zero){
			outputInt = new Array(zero+1).join('0')+strInt;
			outputInt = outputInt.substr(outputInt.length-zero,zero);
		}else{
			outputInt = strInt;
		}
		outputInt = outputInt.substr(0,outputInt.length%comma)+outputInt.substring(outputInt.length%comma).replace(newReg,(comma!=null?',':'')+'$1');
		outputInt = outputInt.replace(/^,/,'');
		strInt = outputInt;
	}
	if(formatFloat!=null){
		var outputFloat = '';
		var zero = formatFloat.match(/^0*/)[0].length;
		if(strFloat.length<zero){
			outputFloat = strFloat+new Array(zero+1).join('0');
			var outputFloat1 = outputFloat.substring(0,zero);
			var outputFloat2 = outputFloat.substring(zero,formatFloat.length);
			outputFloat = outputFloat1+outputFloat2.replace(/0*$/,'');
		}else{
			if(strFloat==0&&zero==0)
				outputFloat = '';
			else
			outputFloat = strFloat.substring(0,formatFloat.length);
		}
		strFloat = outputFloat;
	}else{
		if(pattern!='' || (pattern=='' && strFloat=='0'))
			strFloat = '';
	}
	if(negFlag == "true")
		return "-" + strInt+(strFloat==''?'':'.'+strFloat);
	else
		return strInt+(strFloat==''?'':'.'+strFloat);
};

/**
 * html encode
 * @param str
 */
export const htmlEncode = (str)=>{
	var s = '';
	if (!str||str.length == 0) return '';
	s = str.replace(/&/g, '&amp;');
	s = s.replace(/</g, '&lt;');
	s = s.replace(/>/g, '&gt;');
	s = s.replace(/ /g, '&nbsp;');
	s = s.replace(/\'/g, '&#39;');
	s = s.replace(/\'/g, '&quot;');
	s = s.replace(/\n/g, '<br>');
	return s;
};

/**
 * html decode
 * @param str
 */
export const htmlDecode = (str)=>{
	var s = '';
	if (!str||str.length == 0) return '';
	s = str.replace(/&amp;/g, '&');
	s = s.replace(/&lt;/g, '<');
	s = s.replace(/&gt;/g, '>');
	s = s.replace(/&nbsp;/g, ' ');
	s = s.replace(/&#39;/g, '\'');
	s = s.replace(/&quot;/g, '\'');
	s = s.replace(/<br>/g, '\n');
	return s;
};
