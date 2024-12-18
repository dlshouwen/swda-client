export default {
	
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
