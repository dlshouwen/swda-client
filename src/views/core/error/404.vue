<template>
	<!-- container -->
	<div class="container">
		<!-- error -->
		<div class="error">
			<!-- english -->
			<h1>404 Error - Page not Found</h1>
			<p>We're sorry, but the page you are looking for doesn't exist.</p>
			<p>You can close this tab to visit other page.</p>
			<!-- hr -->
			<hr>
			<!-- chinese -->
			<h1>404 错误 - 页面未找到</h1>
			<p>抱歉，您访问的页面不存在。您可以关闭此页签来访问其他功能。</p>
		</div>
	</div>
</template>

<style scoped>
/** container */
.container{position:relative;background:#f0f0f0;}

/** error */
.error{position:absolute;top:40%;margin-top:-260px;width:100%;text-align:center;}

/** type */
h1{font-size:48px;font-weight:bold;color:#666;line-height:120px;}
p{font-size:12px;color:#888;line-height:32px;}
hr{border:0;border-top:1px solid #ddd;margin:32px;}
</style>
