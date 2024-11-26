/**
 * import & config validator
 */
// import validator
import * as validator from '@/assets/plugins/validator/validator';
// export tools
export const validation = validator.validation;

/**
 * get tree
 * <p>convert list to tree with id pid</p>
 * @param datas
 * @param pid
 * @param idField
 * @param pidField
 * @param childrenField
 * @param hasChildrenField
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
 * cookie
 */
export const cookie = {
	/**
	 * set
	 * @param key
	 * @param value
	 * @param time
	 */
	set : (key, value, time)=>{
		if(localStorage)
			localStorage.setItem(key, value, time);
	},
	/**
	 * get
	 * @param key
	 */
	get : (key)=>{
		if(localStorage)
			return localStorage.getItem(key);
	},
	/**
	 * delete
	 * @param key
	 */
	del : (key)=>{
		if(localStorage)
			localStorage.removeItem(key);
	}
};


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
 * replace all
 * @param ori
 * @param old
 * @param new
 */
export const replaceAll = (ori, old, _new)=>{
	return ori.replace(new RegExp(old, 'gm'), _new);
};

/**
 * start with
 * @param str
 * @param prefix
 */
export const startsWith = (str, prefix)=>{
	if(prefix==undefined)
		return false;
	if(str.indexOf(prefix)==0)
		return true;
	return false;
};

/**
 * end with
 * @param str
 * @param suffix
 */
export const endsWith = (str, suffix)=>{
	if(suffix==undefined)
		return false;
	if(str.lastIndexOf(suffix)==str.length-suffix.length)
		return true;
	return false;
};

/**
 * equals ignore case with
 * @param str1
 * @param str2
 */
export const equalsIgnoreCase = (str1, str2)=>{
	return (new String(str1.toLowerCase()) == (new String(str2)).toLowerCase());
};

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
