# media.js

对html5媒体捕捉的图片的功能进行了包装，方便手机浏览器客户端调用本地功能完成照片的拍摄和上传

##快速使用
该库不依赖任何库，可直接在使用。
```js
var i；
camera.init({
    targetid: "idcard",//触发浏览器读取图片的input标签id 
	imageid: "imgshowid", //将浏览器选择的图片展示到页面上的img标签上,默认为null，即不展示选择的图片
	canvasid:"canvasid", // 将选择的图片展示到页面的canvas标签上，默认为null，不展示图片。
    onNotSupported：fn(msg){
    	//选择的文件不是有效的img的文件，参数msg为传入文件的文件类型
    }
	posturl: url,  // default null 配置上传文件的url，如果配置，则在用户选择图片后，主动将图片上传到后台
	callfn:fn(obj){
		//上传文件成功后，回调函数，obj为xhr对象。
	}
});
```

