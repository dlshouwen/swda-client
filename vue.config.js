/**
 * default confit
 */
const { defineConfig } = require('@vue/cli-service')

/**
 * exports
 */
module.exports = defineConfig({
	// public path
	publicPath: '/',
	// close el lint check
	lintOnSave: false,
	// set default title
	chainWebpack: config => {
		config.plugin('html').tap(args=>{
			args[0].title='swda-client-vue3';
			return args;
		});
    }
})
