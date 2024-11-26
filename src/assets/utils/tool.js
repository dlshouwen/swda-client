/**
 * import & config pinyin methods
 */
// import pinyin
import PinYin from '@/assets/plugins/pinyin/pinyin';
// export tools
export const getFirstSpell = PinYin.getFirstSpell;
export const getFullSpell = PinYin.getFullSpell;
export const getFirstFullSpell = PinYin.getFirstFullSpell;

/**
 * import & config browser methods
 */
// import browser
import * as browser from '@/assets/plugins/browser/browser';
// export tools
export const getBrowserType = browser.getBrowserType;
export const isLowerIE = browser.isLowerIE;

/**
 * import & config validator
 */
// import validator
import * as validator from '@/assets/plugins/validator/validator';
// export tools
export const validation = validator.validation;

/**
 * import & config cookie
 */
// import cookie
import Cookies from 'js-cookie';
// export tools
export const setCookie = Cookies.set;
export const getCookie = Cookies.get;

/**
 * get tree
 * <p>convert list to tree with id pid</p>
 * @param datas
 * @param pid
 * @param idField
 * @param pidField
 * @param childrenField
 * @param hasChildrenField
 * @return tree datas
 */
export const getTree = (datas, pid, idField, pidField, childrenField, hasChildrenField) => {
	let result = []
	let temp;
	for (let i = 0; i < datas.length; i++) {
		var found = false;
		if(pid!==null&&datas[i][pidField]==pid){
			found = true;
		}
		if(pid===null){
			if(datas[i][pidField]===null||datas[i][pidField]===undefined){
				found = true;
			}else{
				found = datas.findIndex(data=>data[idField]==datas[i][pidField])<0;
			}
		}
		if (found) {
			temp = getTree(datas, datas[i][idField], idField, pidField, childrenField, hasChildrenField)
			if (temp.length > 0) {
				datas[i][childrenField] = temp
				datas[i][hasChildrenField] = true
			}else{
				datas[i][hasChildrenField] = false
			}
			result.push(datas[i])
		}
	}
	return result
};

/**
 * guid
 * @return guid
 */
export const guid = ()=>{
	return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
	});
};

/**
 * null to string
 * @param str
 * @return converted string
 */
export const nullToStr = (str)=>{
	return (str==undefined||str==null)?'':str;
}

/**
 * is object
 * @param obj
 * @return obj is object
 */
export const isObject = (obj)=>{
  return (obj&&typeof obj==='object'&&!Array.isArray(obj)&&obj!==null);
}

/**
 * merge
 * @param objs
 * @return merged object
 */
export const merge = (...objs) => {
    if (objs.length<2) {
        throw new Error('Need two or more objects to merge')
    }
    const target = objs[0]
    for (let i=1; i<objs.length; i++) {
        const source = objs[i]
        Object.keys(source).forEach(prop => {
            const value = source[prop]
            if (isObject(value)) {
                if (target.hasOwnProperty(prop) && isObject(target[prop])) {
                    target[prop] = merge(target[prop], value)
                } else {
                    target[prop] = value
                }
            } else if (Array.isArray(value)) {
                if (target.hasOwnProperty(prop) && Array.isArray(target[prop])) {
                    const targetArray = target[prop]
                    value.forEach((sourceItem, itemIndex) => {
                        if (itemIndex < targetArray.length) {
                            const targetItem = targetArray[itemIndex]
                            if (Object.is(targetItem, sourceItem)) {
                                return
                            }
                            if (isObject(targetItem) && isObject(sourceItem)) {
                                targetArray[itemIndex] = merge(targetItem, sourceItem)
                            } else if (Array.isArray(targetItem) && Array.isArray(sourceItem)) {
                                targetArray[itemIndex] = merge(targetItem, sourceItem)
                            } else {
                                targetArray[itemIndex] = sourceItem
                            }
                        } else {
                            targetArray.push(sourceItem)
                        }
                    })
                } else {
                    target[prop] = value
                }
            } else {
                target[prop] = value
            }
        })
    }
    return target
}

/**
 * search cascader id
 * @param datas
 * @param id
 * @param top
 * @return search result array
 */
export const searchCascaderId = (datas, id, top) => {
	var result = [];
	var iterateFunc = function(_datas, _id) {
		for (var i=0; i<_datas.length; i++) {
			var item = _datas[i];
			if (item.id==_id) {
				result.push(item.value);
				if(item.pid!=top){
					iterateFunc(datas, item.pid);
				}
				break;
			}else{
				if(item.children) {
					iterateFunc(item.children, _id)
				}
			}
		}
	}
	iterateFunc(datas, id);
	result.reverse();
	return result;
};

/**
 * search cascader
 * @param datas
 * @param id
 * @return cascader data
 */
export const searchCascader = (datas, id) => {
	for(var i=0; i<datas.length; i++){
		if(datas[i].id==id){
			return datas[i];
		}
		if(datas[i].children){
			let data = searchCascader(datas[i].children, id);
			if(data){
				return data;
			}
		}
	}
};

/**
 * get date diff
 * @param date1
 * @param date2
 * @return days
 */
export const getDateDiff = (date1, date2)=>{
	var re = /^(\d{4})\S(\d{1,2})\S(\d{1,2})$/;
	var dt1 = 0;
	var dt2 = 0;
	if(re.test(date1))
		dt1 = new Date(RegExp.$1,RegExp.$2 - 1,RegExp.$3);
	if(re.test(date2))
		dt2 = new Date(RegExp.$1,RegExp.$2 - 1,RegExp.$3);
	return Math.floor((dt1-dt2)/(1000 * 60 * 60 * 24));
};

/**
 * get month between list
 * @param start
 * @param end
 * @return month list
 */
export const getMonthBetweenList = (start, end)=>{
	var result = [];
	var min = new Date();
	var max = new Date();
	min.setFullYear(start.substr(0, 4), start.substr(4, 2)-1);
	max.setFullYear(end.substr(0, 4), end.substr(4, 2)-1);
	var curr = min;
	while (curr <= max) {
		var month = curr.getMonth()+1;
		result.push(curr.getFullYear() + '' + (month < 10 ? ("0" + month) : month));
		curr.setMonth(month);
	}
	return result;
}

/**
 * format date
 * @param date
 * @param format
 * @return formated data
 */
export const formatDate = (date, format)=>{
	if(date==''){
		return '';
	}
	if(date.time){
		date = new Date(date.time);
	}
	var o = {
		"M+" : date.getMonth()+1, //month
		"d+" : date.getDate(),    //day
		"h+" : date.getHours(),   //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter
		"S" : date.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format))
		format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};

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
			result[compare[k]] = date.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
		}
	}
	return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
}

/**
 * format seconds
 * @param seconds
 * @return 格式化后的字符串
 */
export const formatSeconds = (seconds)=>{
	var theTime = parseInt(seconds);
	var theTime1 = 0;
	var theTime2 = 0;
	var theTime3 = 0;
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
			if (theTime2 > 24) {
				theTime3 = parseInt(theTime2 / 24);
				theTime2 = parseInt(theTime2 % 24);
			}
		}
	}
	var result = '';
	if (theTime > 0) {
		result = "" + parseInt(theTime) + "秒";
	}
	if (theTime1 > 0) {
		result = "" + parseInt(theTime1) + "分" + result;
	}
	if (theTime2 > 0) {
		result = "" + parseInt(theTime2) + "小时" + result;
	}
	if (theTime3 > 0) {
		result = "" + parseInt(theTime3) + "天" + result;
	}
	return result;
}

/**
 * format file size
 * @param size unit:b
 * @return formated file size
 */
export const formatFileSize = (size)=>{
	if (size===null||size===undefined)
		return '';
	if (size===0)
		return '0 B';
	var k = 1000,
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(size) / Math.log(k));
	return (size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
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