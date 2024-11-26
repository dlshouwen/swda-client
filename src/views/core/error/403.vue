<template>
	<!-- container -->
	<div class="container">
		<!-- error -->
		<div class="error">
			<!-- english -->
			<h1>403 Forbidden - Refuses to Authorize</h1>
			<p>The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it.</p>
			<p>You can close this tab to visit other page.</p>
			<!-- hr -->
			<hr>
			<!-- chinese -->
			<h1>403 禁止访问 - 需要授权</h1>
			<p>抱歉，服务器理解您的访问请求，但您无权访问此页面。</p>
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
