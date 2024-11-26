/*!
 * DLShouWen Validator v1.1.9
 *
 * includes: vue / elementui
 * Copyright 2023, http://os.dlshouwen.com/validator
 */

// import vue
import Vue from 'vue';

// import request
import { request } from '@/assets/utils/request'

/**
 * langs
 */
const langs = {
	'en': {
		unique : {
			validating : 'Checking ${label} is validated...',
			success : '${label} can use',
			failure : '${label} alreay in used',
			error : 'Error occur during check ${label} is in use'
		},
		validate : {
			format : '${label} must be ${format}',
			passwordNotEquals : 'Password do not equals, please input again',
			required : {
				input : '${label} can not be null',
				select : '${label} must select'
			},
			greatLess : {
				number : {
					greatThan : '${label} must great than ${min}',
					greatEqualsThan : '${label} must equals or great than ${min}',
					lessThan : '${label} must less than ${max}',
					lessEqualsThan : '${label} must equals or less than ${max}'
				},
				string : {
					greatThan : '${label} length must great than ${min}',
					greatEqualsThan : '${label} length must equals or great than ${min}',
					lessThan : '${label} length must less than ${max}',
					lessEqualsThan : '${label} length must equals or less than ${max}'
				},
				multiple : {
					greatThan : '${label} must select more than ${min}',
					greatEqualsThan : '${label} must select less than ${min}',
					lessThan : '${label} must select equals or more than ${max}',
					lessEqualsThan : '${label} must select equals or less than ${max}'
				}
			},
			card : {
				wrongLength : '${label} error: card Id is not 15 or 18 length',
				notCard15 : '${label} is not 15 length card Id',
				notCard18 : '${label} is not 18 length card Id',
				wrongCard15 : '${label} is wrong 15 length card Id',
				wrongCard18 : '${label} is wrong 18 length card Id'
			},
			validating : '${label} is validating',
			success : '${label} validate success'
		},
		alert : {
			validating : '${label} is validating, please wait',
			error : 'You inputed contents have some errors, please recheck those.'
		},
		format : {
			email : 'email',
			phone : 'phone',
			english_number : 'english or number',
			mobile : 'mobile',
			url : 'url',
			money : 'money',
			number : 'number',
			zip : 'zip',
			qq : 'qq',
			integer : 'integer',
			double : 'double',
			english : 'english',
			chinese : 'Chinese',
			card : 'card',
			card15 : '15 length card',
			card18 : '18 length card'
		}
	},
	'zh-cn': {
		unique : {
			validating : '正在检查${label}是否可用...',
			success : '${label}可以使用',
			failure : '${label}已经被使用',
			error : '${label}检查使用过程中遇到错误'
		},
		validate : {
			format : '${label}必须为${format}格式',
			passwordNotEquals : '密码录入不一致，请重新录入',
			required : {
				input : '${label}不能为空',
				select : '${label}必须选择'
			},
			greatLess : {
				number : {
					greatThan : '${label}的值必须大于${min}',
					greatEqualsThan : '${label}的值必须大于等于${min}',
					lessThan : '${label}的值必须小于${max}',
					lessEqualsThan : '${label}的值必须小于等于${max}'
				},
				string : {
					greatThan : '${label}的长度必须大于${min}',
					greatEqualsThan : '${label}的长度最少为${min}',
					lessThan : '${label}的长度必须小于${max}',
					lessEqualsThan : '${label}的长度最多为${max}'
				},
				multiple : {
					greatThan : '${label}的数量请大于${min}个',
					greatEqualsThan : '${label}最少选择${min}个',
					lessThan : '${label}选择的数量请小于${max}个',
					lessEqualsThan : '${label}最多选择${max}个'
				}
			},
			card : {
				wrongLength : '${label}验证失败：身份证位数不正确',
				notCard15 : '${label}并非15位身份证',
				notCard18 : '${label}并非18位身份证',
				wrongCard15 : '${label}是错误的15位身份证格式',
				wrongCard18 : '${label}是错误的18位身份证格式'
			},
			validating : '${label}正在验证',
			success : '${label}验证成功'
		},
		alert : {
			validating : '${label}正在验证，请您稍后执行操作',
			error : '您录入的内容存在错误，请您核实。'
		},
		format : {
			email : '邮件',
			phone : '电话',
			english_number : '英文或数字',
			mobile : '手机',
			url : '链接',
			money : '金额',
			number : '数字',
			zip : '邮编',
			qq : 'QQ号',
			integer : '整数',
			double : '小数',
			english : '英文',
			chinese : '中文',
			card : '身份证',
			card15 : '15位身份证',
			card18 : '18位身份证'
		}
	},
	'zh-tw': {
		unique : {
			validating : '正在檢查${label}是否可用...',
			success : '${label}可以使用',
			failure : '${label}已經被使用',
			error : '${label}檢查使用過程中遇到錯誤'
		},
		validate : {
			format : '${label}必須為${format}格式',
			passwordNotEquals : '密碼錄入不一致，請重新錄入',
			required : {
				input : '${label}不能為空',
				select : '${label}必須選擇'
			},
			greatLess : {
				number : {
					greatThan : '${label}的值必須大於${min}',
					greatEqualsThan : '${label}的值必須大於等於${min}',
					lessThan : '${label}的值必須小於${max}',
					lessEqualsThan : '${label}的值必須小於等於${max}'
				},
				string : {
					greatThan : '${label}的長度必須大於${min}',
					greatEqualsThan : '${label}的長度最少為${min}',
					lessThan : '${label}的長度必須小於${max}',
					lessEqualsThan : '${label}的長度最多為${max}'
				},
				multiple : {
					greatThan : '${label}的數量請大於${min}個',
					greatEqualsThan : '${label}最少選擇${min}個',
					lessThan : '${label}選擇的數量請小於${max}個',
					lessEqualsThan : '${label}最多選擇${max}個'
				}
			},
			card : {
				wrongLength : '${label}驗證失敗：身份證位數不正確',
				notCard15 : '${label}並非15位身份證',
				notCard18 : '${label}並非18位身份證',
				wrongCard15 : '${label}是錯誤的15位元身份證格式',
				wrongCard18 : '${label}是錯誤的18位元身份證格式'
			},
			validating : '${label}正在驗證',
			success : '${label}驗證成功'
		},
		alert : {
			validating : '${label}正在驗證，請您稍後執行操作',
			error : '您錄入的內容存在錯誤，請您核實。'
		},
		format : {
			email : '郵件',
			phone : '電話',
			english_number : '英文或數位',
			mobile : '手機',
			url : '連結',
			money : '金額',
			number : '數字',
			zip : '郵編',
			qq : 'QQ號',
			integer : '整數',
			double : '小數',
			english : '英文',
			chinese : '中文',
			card : '身份證',
			card15 : '15位身份證',
			card18 : '18位身份證'
		}
	}
};

/**
 * card validation
 */
const card = {
	// defined wi
	cardWi : [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],
	cardValideCode : [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],
	// card id validate
	cardIdValidate : function(rule, value, callback, item, option, lang){
		if (value.length == 15) {
			card.cardId15Validate(rule, value, callback, item, option, lang);
		}else if (value.length == 18) {
			card.cardId18Validate(rule, value, callback, item, option, lang);
		}else{
			if(option.style=='title') item.title = lang.validate.card.wrongLength;
			if(option.style=='tooltip') item.content = lang.validate.card.wrongLength;
			callback(new Error(lang.validate.card.wrongLength));
		}
	},
	// card id validate 15
	cardId15Validate : function(rule, value, callback, item, option, lang){
		if (value.length != 15) {
			let message = lang.validate.card.notCard15;
			message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
			if(option.style=='title') item.title = message;
			if(option.style=='tooltip') item.content = message;
			callback(new Error(message));
			return;
		}
		if(!card.isValidityBrithBy15IdCard(value)){
			let message = lang.validate.card.wrongCard15;
			message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
			if(option.style=='title') item.title = message;
			if(option.style=='tooltip') item.content = message;
			callback(new Error(message));
			return;
		}
		if(option.style=='title') item.title = '';
		if(option.style=='tooltip') item.content = '';
		callback();
	},
	// card id validate 18
	cardId18Validate : function(rule, value, callback, item, option, lang){
		if (value.length != 18) {
			let message = lang.validate.card.notCard18;
			message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
			if(option.style=='title') item.title = message;
			if(option.style=='tooltip') item.content = message;
			callback(new Error(message));
			return;
		}
		if (!card.isValidityBrithBy18IdCard(value)||!card.isTrueValidateCodeBy18IdCard(value)) {
			let message = lang.validate.card.wrongCard18;
			message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
			if(option.style=='title') item.title = message;
			if(option.style=='tooltip') item.content = message;
			callback(new Error(message));
			return;
		}
		if(option.style=='title') item.title = '';
		if(option.style=='tooltip') item.content = '';
		callback();
	},
	// 15 card id birthday is valid
	isValidityBrithBy15IdCard : function(cardId15){
		var year = cardId15.substring(6, 8);
		var month = cardId15.substring(8, 10);
		var day = cardId15.substring(10, 12);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	},
	// 18 card id birthday is valid
	isValidityBrithBy18IdCard : function(cardId18){
		var year = cardId18.substring(6, 10);
		var month = cardId18.substring(10, 12);
		var day = cardId18.substring(12, 14);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	},
	// 18 card id valid code is valid
	isTrueValidateCodeBy18IdCard : function(cardId){
		var a_cardId = cardId.split('');
		var sum = 0;
		if (a_cardId[17].toLowerCase() == 'x') {
			a_cardId[17] = 10;
		}
		for ( var i = 0; i < 17; i++) {
			sum += card.cardWi[i] * a_cardId[i];
		}
		let valCodePosition = sum % 11;
		if (a_cardId[17] == card.cardValideCode[valCodePosition]) {
			return true;
		} else {
			return false;
		}
	}
};

const isObject = (item)=> {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}
 
const merge = (...objs) => {
    if (objs.length < 2) {
        throw new Error('Need two or more objects to merge')
    }
    const target = objs[0]
    for (let i = 1; i < objs.length; i++) {
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
 * default options
 */
const defaultOption = {
	// default lang
	lang : 'zh-cn',
	// format
	format : {
		email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		phone : /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/,
		english_number : /^\w+$/,
		mobile : /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/,
		url : /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
		money : /^-?((\d{1,3}(,\d{3})*?)|\d+)(\.\d{1,2})?$/,
		number : /^\d+$/,
		zip : /^[1-9]\d{5}$/,
		qq : /^[1-9]\d{4,10}$/,
		integer : /^[-\+]?\d+$/,
		double : /^[-\+]?\d+(\.\d+)?$/,
		english : /^[A-Za-z]+$/,
		chinese : /^[\u0391-\uFFE5]+$/,
		card : card.cardIdValidate,
		card15 : card.cardId15Validate,
		card18 : card.cardId18Validate
	},
	// default style : default / title / tooltip
	style : 'title'
};

/**
 * validation
 * @param rule
 * @param value
 * @param callback
 * @param item
 * @param option
 */
export const validation = (rule, value, callback, item, option) => {
	// clean
	value = value===undefined||value===null?'':value;
	// reset option
	option = option?merge({}, defaultOption, option):defaultOption;
	// get lang
	let lang = langs[option.lang];
	// get expressions
	let expressions = rule.valid.split('|');
	// for each expression
	for(let i=0; i<expressions.length; i++){
		// get expression
		let expression = expressions[i];
		// required
		if(expression=='r'){
			if(value===''){
				let message = rule.type=='select'?lang.validate.required.select:lang.validate.required.input;
				message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback(new Error(message));
				return;
			}
		}
		// empty
		if(value==''){
			if(option.style=='title') item.title = '';
			if(option.style=='tooltip') item.content = '';
			callback();
			return;
		}
		// format
		for(let key in option.format){
			if(expression==key){
				if(typeof(option.format[key]) == 'function'){
					option.format[key](rule, value, callback, item, option, lang);
					return;
				} else {
					if(!new String(value).match(option.format[key])){
						let message = lang.validate.format;
						message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
						message = message.replace(new RegExp('\\${format}', 'gm'), lang.format[key]);
						if(option.style=='title') item.title = message;
						if(option.style=='tooltip') item.content = message;
						callback(new Error(message));
						return;
					}
				}
			}
		}
		// length
		if(expression.match(/^le?[0-9]*\-le?[0-9]*$/)){
			// get length
			let length = value.length;
			// get min max expression
			let expr = { min:expression.split('-')[0], max:expression.split('-')[1] };
			// get range
			let range = { min:expr.min.match(/[0-9]+$/i), max:expr.max.match(/[0-9]+$/i) };
			// great
			if(range.min!=null){
				if(expr.min.indexOf('le')!=-1&&length<range.min){
					let message = rule.type=='select'?lang.validate.greatLess.multiple.greatEqualsThan:lang.validate.greatLess.string.greatEqualsThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${min}', 'gm'), range.min);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
				if(expr.min.indexOf('le')==-1&&length<=range.min){
					let message = rule.type=='select'?lang.validate.greatLess.multiple.greatThan:lang.validate.greatLess.string.greatThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${min}', 'gm'), range.min);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
			}
			// less
			if(range.max!=null){
				if(expr.max.indexOf('le')!=-1&&length>range.max){
					let message = rule.type=='select'?lang.validate.greatLess.multiple.lessEqualsThan:lang.validate.greatLess.string.lessEqualsThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${max}', 'gm'), range.max);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
				if(expr.max.indexOf('le')==-1&&length>=range.max){
					let message = rule.type=='select'?lang.validate.greatLess.multiple.lessThan:lang.validate.greatLess.string.lessThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${max}', 'gm'), range.max);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
			}
		}
		// size
		if(expression.match(/^me?[0-9]*\-me?[0-9]*$/)){
			// get min max expression
			let expr = { min:expression.split('-')[0], max:expression.split('-')[1] };
			// get range
			let range = { min:expr.min.match(/[0-9]+$/i), max:expr.max.match(/[0-9]+$/i) };
			// great
			if(range.min!=null){
				if(expr.min.indexOf('me')!=-1&&value<range.min){
					let message = lang.validate.greatLess.number.greatEqualsThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${min}', 'gm'), range.min);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
				if(expr.min.indexOf('me')==-1&&value<=range.min){
					let message = lang.validate.greatLess.number.greatThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${min}', 'gm'), range.min);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
			}
			// less
			if(range.max!=null){
				if(expr.max.indexOf('me')!=-1&&value>range.max){
					let message = lang.validate.greatLess.number.lessEqualsThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${max}', 'gm'), range.max);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
				if(expr.max.indexOf('me')==-1&&value>=range.max){
					let message = lang.validate.greatLess.number.lessThan;
					message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
					message = message.replace(new RegExp('\\${max}', 'gm'), range.max);
					if(option.style=='title') item.title = message;
					if(option.style=='tooltip') item.content = message;
					callback(new Error(message));
					return;
				}
			}
		}
		// password
		if(rule.password){
			if(rule.password!==value){
				let message = lang.validate.passwordNotEquals;
				message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback(new Error(message));
				return;
			}
		}
	};
	// unique
	if(rule.unique){
		// set data
		let data = {};
		data.code = rule.unique.code;
		data.value = value;
		data.args = rule.unique.args;
		// valid
		request({url:'/core/unique', method:'post', data:data}).then((handler)=>{
			if(handler.data.data.result){
				// success
				let message = lang.unique.success;
				message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback();
				return;
			}else{
				let message = lang.unique.failure;
				message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback(new Error(message));
				return;
			}
		}).catch((error)=>{
			let message = lang.unique.error;
			message = message.replace(new RegExp('\\${label}', 'gm'), rule.label);
			if(option.style=='title') item.title = message;
			if(option.style=='tooltip') item.content = message;
			callback(new Error(message));
			return;
		});
	}else{
		// success
		if(option.style=='title') item.title = '';
		if(option.style=='tooltip') item.content = '';
		callback();
	}
}