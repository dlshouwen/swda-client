/*!
 * DLShouWen Validator v1.1.9
 *
 * includes: vue / elementui
 * Copyright 2023, http://os.dlshouwen.com/validator
 */

// import request
import request from '@/utils/request'

/**
 * card validation
 */
const card = {
	// defined wi
	cardWi : [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],
	cardValideCode : [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ],
	// card id validate
	cardIdValidate : function(rule, value, callback){
		if (value.length == 15) {
			card.cardId15Validate(rule, value, callback)
		}else if (value.length == 18) {
			card.cardId18Validate(rule, value, callback)
		}else{
			callback(new Error(rule.lang('validator.validate.card.wrongLength')))
		}
	},
	// card id validate 15
	cardId15Validate : function(rule, value, callback){
		if (value.length != 15) {
			let message = rule.lang('validator.validate.card.notCard15', rule.label)
			callback(new Error(message))
			return
		}
		if(!card.isValidityBrithBy15IdCard(value)){
			let message = rule.lang('validator.validate.card.wrongCard15', rule.label)
			callback(new Error(message))
			return
		}
		callback()
	},
	// card id validate 18
	cardId18Validate : function(rule, value, callback){
		if (value.length != 18) {
			let message = rule.lang('validator.validate.card.notCard18', rule.label)
			callback(new Error(message))
			return
		}
		if (!card.isValidityBrithBy18IdCard(value)||!card.isTrueValidateCodeBy18IdCard(value)) {
			let message = rule.lang('validator.validate.card.wrongCard18', rule.label)
			callback(new Error(message))
			return
		}
		callback()
	},
	// 15 card id birthday is valid
	isValidityBrithBy15IdCard : function(cardId15){
		var year = cardId15.substring(6, 8)
		var month = cardId15.substring(8, 10)
		var day = cardId15.substring(10, 12)
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
		if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false
		} else {
			return true
		}
	},
	// 18 card id birthday is valid
	isValidityBrithBy18IdCard : function(cardId18){
		var year = cardId18.substring(6, 10)
		var month = cardId18.substring(10, 12)
		var day = cardId18.substring(12, 14)
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false
		} else {
			return true
		}
	},
	// 18 card id valid code is valid
	isTrueValidateCodeBy18IdCard : function(cardId){
		var a_cardId = cardId.split('')
		var sum = 0
		if (a_cardId[17].toLowerCase() == 'x') {
			a_cardId[17] = 10
		}
		for ( var i = 0; i < 17; i++) {
			sum += card.cardWi[i] * a_cardId[i]
		}
		let valCodePosition = sum % 11
		if (a_cardId[17] == card.cardValideCode[valCodePosition]) {
			return true
		} else {
			return false
		}
	}
}

/**
 * default options
 */
const option = {
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
	}
}

/**
 * validation
 * @param rule
 * @param value
 * @param callback
 * @param item
 * @param option
 */
export const validator = (rule, value, callback) => {
	// clean
	value = value===undefined||value===null?'':value
	// get expressions
	let expressions = rule.valid.split('|')
	// for each expression
	for(let i=0; i<expressions.length; i++){
		// get expression
		let expression = expressions[i]
		// required
		if(expression=='r'){
			if(value===''||value.length===0){
				let message = rule.type=='select'?rule.lang('validator.validate.required.select', {label:rule.label}):rule.lang('validator.validate.required.input', {label:rule.label})
				callback(new Error(message))
				return
			}
		}
		// empty
		if(value==''){
			callback()
			return
		}
		// format
		for(let key in option.format){
			if(expression==key){
				if(typeof(option.format[key]) == 'function'){
					option.format[key](rule, value, callback)
					return
				} else {
					if(!new String(value).match(option.format[key])){
						let message = rule.lang('validator.validate.format', {label:rule.label, format:rule.lang('validator.format.'+key)})
						callback(new Error(message))
						return
					}
				}
			}
		}
		// length
		if(expression.match(/^le?[0-9]*\-le?[0-9]*$/)){
			// get length
			let length = value.length
			// get min max expression
			let expr = { min:expression.split('-')[0], max:expression.split('-')[1] }
			// get range
			let range = { min:expr.min.match(/[0-9]+$/i), max:expr.max.match(/[0-9]+$/i) }
			range.min = range.min?range.min[0]:null
			range.max = range.max?range.max[0]:null
			// great
			if(range.min!=null){
				if(expr.min.indexOf('le')!=-1&&length<range.min){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.type=='select'?rule.lang('validator.validate.greatLess.multiple.greatEqualsThan', info):rule.lang('validator.validate.greatLess.string.greatEqualsThan', info)
					callback(new Error(message))
					return
				}
				if(expr.min.indexOf('le')==-1&&length<=range.min){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.type=='select'?rule.lang('validator.validate.greatLess.multiple.greatThan', info):rule.lang('validator.validate.greatLess.string.greatThan', info)
					callback(new Error(message))
					return
				}
			}
			// less
			if(range.max!=null){
				if(expr.max.indexOf('le')!=-1&&length>range.max){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.type=='select'?rule.lang('validator.validate.greatLess.multiple.lessEqualsThan', info):rule.lang('validator.validate.greatLess.string.lessEqualsThan', info)
					callback(new Error(message))
					return
				}
				if(expr.max.indexOf('le')==-1&&length>=range.max){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.type=='select'?rule.lang('validator.validate.greatLess.multiple.lessThan', info):rule.lang('validator.validate.greatLess.string.lessThan', info)
					callback(new Error(message))
					return
				}
			}
		}
		// size
		if(expression.match(/^me?[0-9]*\-me?[0-9]*$/)){
			// get min max expression
			let expr = { min:expression.split('-')[0], max:expression.split('-')[1] }
			// get range
			let range = { min:expr.min.match(/[0-9]+$/i), max:expr.max.match(/[0-9]+$/i) }
			range.min = range.min?range.min[0]:null
			range.max = range.max?range.max[0]:null
			// great
			if(range.min!=null){
				if(expr.min.indexOf('me')!=-1&&value<range.min){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.lang('validator.validate.greatLess.number.greatEqualsThan', info)
					callback(new Error(message))
					return
				}
				if(expr.min.indexOf('me')==-1&&value<=range.min){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.lang('validator.validate.greatLess.number.greatThan', info)
					callback(new Error(message))
					return
				}
			}
			// less
			if(range.max!=null){
				if(expr.max.indexOf('me')!=-1&&value>range.max){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.lang('validator.validate.greatLess.number.lessEqualsThan', info)
					callback(new Error(message))
					return
				}
				if(expr.max.indexOf('me')==-1&&value>=range.max){
					let info = {label: rule.label, min:range.min, max:range.max}
					let message = rule.lang('validator.validate.greatLess.number.lessThan', info)
					callback(new Error(message))
					return
				}
			}
		}
		// password
		if(rule.password){
			if(rule.password!==value){
				let message = rule.lang('validator.validate.passwordNotEquals', {label:rule.label})
				callback(new Error(message))
				return
			}
		}
	}
	// unique
	if(rule.unique){
		// set data
		let data = {}
		data.code = rule.unique.code
		data.value = value
		data.args = rule.unique.args
		// valid
		request.post('/unique', data).then((handler)=>{
			if(handler.data){
				callback()
				return
			}else{
				let message = rule.lang('validator.unique.failure', {label:rule.label})
				callback(new Error(message))
				return
			}
		}).catch(()=>{
			let message = rule.lang('validator.unique.error', {label:rule.label})
			callback(new Error(message))
			return
		})
	}else{
		// success
		callback()
	}
}