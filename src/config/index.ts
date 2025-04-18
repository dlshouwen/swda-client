// export
export default {
	
	key: {
		token: 'swda-token',
		refreshToken: 'swda-refresh-token',
		sidebar: 'swda-sidebar',
		lang: 'swda-lang',
		size: 'swda-size',
		theme: 'swda-theme'
	},
	
	default: {
		
		lang: 'zh-cn',
		
		size: 'default',
		
		theme: {
			
			mode: 'light',	// light / dark

			primary: '#409EFF',

			layout: 'vertical', // vertical / horizontal
			
			system: 'expand', // select / expand
			
			logo: {
			
				enable: true,
				style: 'primary' // primary / light / dark
			
			},
			
			sidebar:{
			
				style: 'dark', // primary / light / dark
				collapse: false,
				unique: true,
			
			},
			
			header:{
			
				style: 'light', // primary / light / dark
				breadcrumb: false,
			
			},
			
			tab: {
				
				enable: true,
				style: 'light', // light / dark
				mode: 'single', // single / series
				cache: true
				
			}

		}
		
	},
	
	app: {
		
		sm2: '0472c35d724b22d089b2f23f3d0861b7d98b0eaf5e5b9fd99c6bc3a466258f13445d0dbb7f9521eb763a74627b73706530e5ce95d0140b4c798e98236ea8709fa9',
		
		attr: { expired: 5*60*1000 },
		
		dict: { expired: 5*60*1000 },
		
	},
	
	url: {
		
		api: import.meta.env.VITE_API_URL,
		
		third: import.meta.env.VITE_API_URL+'/bms/third/render/',
		
		upload: import.meta.env.VITE_API_URL+'/bms/file/upload'
		
	},
	
	env: {
		prod: import.meta.env.PROD,
		dev: import.meta.env.DEV
	}
	
}
