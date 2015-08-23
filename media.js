/*
	media.js v1.0
	https://github.com/kangjy/mediajs
	Author: kangjy (https://github.com/kangjy/mediajs)
	License: MIT
*/
var media = (function() {
	var options,inputmedia;
	/*
		判断浏览器是否为手机终端，方便做手机适配
	*/
	function _isMobile() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod","Mobile"];
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > -1) {
	            return true;
	        }
	    }
	    return false;
	}
	/*
	   增加手机端适配
	*/
	function _adapteMobile(){
		var meta1 = document.createElement("meta");
		meta1.setAttribute("content", "yes");
		meta1.setAttribute("name", "apple-mobile-web-app-capable");
		var meta2 = document.createElement("meta");
		meta2.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
		meta2.setAttribute("name", "viewport");
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(meta1);
		head.appendChild(meta2);
	}
	/*
		将上传的图片用img展示
	*/
	function _displayAsImage(file) {
		window.URL = window.URL || window.webkitURL;
		var img=document.getElementById(options.imageid);
		if (window.URL){
			var imgURL = URL.createObjectURL(file);
			img.onload = function() {
		      URL.revokeObjectURL(imgURL);
		    };
		    img.src = imgURL;
		}else if(window.FileReader){
			var reader = new FileReader();
			reader.onload = function (e) {
				img.src=e.target.result;
			}
			reader.readAsDataURL(file);
		}
	}
	/*
		将上传的图片用canvas展示
	*/
	function _drawOnCanvas(file) {
	  var reader = new FileReader();
	  reader.onload = function (e) {
	    var dataURL = e.target.result,
	        c = document.getElementById(options.canvasid), // see Example 4
	        ctx = c.getContext('2d'),
	        img = new Image();

	    img.onload = function() {
	      c.width = img.width;
	      c.height = img.height;
	      ctx.drawImage(img, 0, 0);
	    };

	    img.src = dataURL;
	  };
	  reader.readAsDataURL(file);
	}
	/*
		初始化media的input标签
	*/
	function _initInput(id,mediatype){
		var minput=document.getElementById(options.id);
		minput.setAttribute('capture', "camera");
		minput.setAttribute('accept', "image/*");
		return minput;
	}
	/*
		初始化标签
	*/
	function initMediaInput() {
		if(_isMobile){
			_adapteMobile();
		}
		inputmedia = _initInput(options.id,"image");
		inputmedia.onchange = function () {
		  var ifile=inputmedia.files[0];
		  if(options.onchange){
		  	var result=options.onchange.call(this);
		  	if(result){
		  		return;
		  	}
		  }
		  if((ifile.type).indexOf("image")>-1){
		  	if(options.imageid){
			  	_displayAsImage(ifile);
			}
			if(options.canvasid){
			  _drawOnCanvas(ifile);
			}
			if(options.posturl){
			  	_uploadimage([inputmedia],options.posturl,options.callfn)
			}
		  }else{
		  	options.onNotSupported.call(this,ifile.type)
		  }
		};
		return inputmedia;
	}
	/*
		上传图片到服务器
	*/
	function _uploadimage(files,url,fn) {
	  var form = new FormData(),
	      xhr = new XMLHttpRequest();
	  for(var i=0;i<files.length;i++){
	  	form.append(files[i].name,files[i].files[0])
	  }
	  xhr.open('post',url, true);
	  xhr.send(form);
	  xhr.onreadystatechange=function(){
	  	if("4"==this.readyState&&fn){
	  		fn.call(this);
	  	}
	  }
	}
	return {
		init: function(captureOptions) {
			var doNothing = function() {};
			options = captureOptions || {};
			var file=initMediaInput();
			return file;
		},
		uploadimage:_uploadimage
	};
})();