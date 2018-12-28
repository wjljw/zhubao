function isHome(){
	var pathname = window.location.pathname;
	if(pathname.indexOf('index.html') == -1 && pathname.indexOf('order.html') == -1 && pathname.indexOf('info.html') == -1){
		return false
	}
	return true;
}

// 打开窗口
function openView(url,data){
	if(url) {
		var ws = plus.webview.getWebviewById(url);
		data = data ? mui.isObject(data) ? JSON.stringify(data) : data : '{}';
		if(ws) {
			plus.nativeUI.showWaiting('',{padlock : true,round : 30,background : 'rgba(0,0,0,0.3)'});
			ws.evalJS("window.param=parseJson("+data+")");
			ws.evalJS("new language(function(){plus.nativeUI.closeWaiting();plus.webview.show(plus.webview.currentWebview(),'pop-in',300,function(){if(isFunc(window.loadComplete)) loadComplete();});}).getLang();");
			//plus.webview.show(ws,'pop-in',300);
		} else {
			plus.nativeUI.showWaiting('',{padlock : true,round : 30,background : 'rgba(0,0,0,0.3)'});
			var ws = plus.webview.create(url,url,{},parseJson(data));
			ws.onloaded = function(){
				ws.evalJS("window.param=parseJson("+data+");");
				ws.evalJS("new language(function(){plus.webview.currentWebview().show('pop-in',300,function(){});if(isFunc(window.loadComplete)) loadComplete();}).getLang();");
			};
		}
	}
}

mui.ready(function(){
	mui.oldback = mui.back;
	if(!mui.os.plus) {
		mui.trigger(document,'plusready');
	}
	
	mui(document).on('tap','.link-btn',function(e){
		e.stopPropagation();
		e.preventDefault();
		var url = (this.getAttribute('href') || '').trim();
		var data = mui(this).attr('data');
		if(isNull(url)) return false;
		if(isUrl(url)) {
			var ws = plus.webview.create(url,url, {
				'titleNView':{
					'backgroundColor':'#eee',
					'titleColor':'#333',
					'autoBackButton':false,
					'progress':{color:'#0000FF'},
					buttons : [{
						float : 'left',
						fontSize : '16px',
						fontSrc : '_www/fonts/iconfont.ttf',
						text : '\ue7ec',
						onclick : function(){
							ws.close();
						}
					}]
				},
				'backButtonAutoControl' : 'close'
			});
			setTimeout(function(){
				ws.appendJsFile('_www/lib/js/mui.min.js');
				ws.appendJsFile('_www/js/external-links.js');
				ws.show('pop-in');
			},0);
		} else if((/^\S+\.html/).test(url)) openView(url,data); // 打开窗口
	});
	
	if(typeof template == 'function') { 
		window.Temp = {}; 
		mui('[type="text/html"]').each(function() {
			var self = this;
			Temp[self.getAttribute('id')] = function(data) {
				var tpl = self.innerHTML;
				return template(tpl, data);
			};
		});
	}
	
});


mui.fn['hasClass'] = function(s){
	var self = this.length >= 1 ? this[0] : this;
	return (new RegExp('(\\s|^)' + s + '(\\s|$)')).test(self.className); 
};

mui.fn['addClass'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		if(!mui(self).hasClass(s)) {
			self.className = (self.className.trim())+' '+s;
		}
	}
	return this;
};

mui.fn['removeClass'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		if(mui(self).hasClass(s)) {
			var reg = new RegExp('(\\s|^)' + s + '(\\s|$)');  
			self.className = self.className.trim().replace(reg,' ');
		}
	}
	return this;
};

mui.fn['remove'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		self = self.remove();
	}
	return this;
};

mui.fn['receive'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		self = self.receive();
	}
	return this;
};


mui.fn['show'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		if(self.style.display === 'none' || self.style.display === '') self.style.display = 'block';
	}
	return this;
};

mui.fn['hide'] = function(s){
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		if(self.style.display !== 'none') self.style.display = 'none';
	}
	return this;
};

mui.fn['text'] = function(s){
	if(s == null || s == undefined) return (this[0].innerText||this[0].innerHTML);
	for(var i = 0; i < this.length; i ++){this[i].innerText=s;} return this;
};

mui.fn['val'] = function(s){
	if(s == null || s == undefined) return this[0].value;
	for(var i = 0; i < this.length; i ++){this[i].value=s;} return this;
};

mui.fn['attr'] = function(name,val){
	name = name || false;
	if(name) {
		if(val == null || val == undefined) return this[0].getAttribute(name);
		for(var i = 0; i < this.length; i ++){
			var self = this[i];
			self.setAttribute(name,val);
		}
	}
	return this;
};

mui.fn['html'] = function(s){
	if(s == null || s == undefined) {
		return this[0].innerHTML;
	}
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		self.innerHTML = s;
	}
	return this;
};

mui.fn['append'] = function(s){
	s = typeof s === 'object' ? s.outerHTML : s; 
	for(var i = 0; i < this.length; i ++){
		var self = this[i];
		var div = document.createElement('div');
			div.innerHTML = s;
		var nodes = div.childNodes;
		for(var j = 0; j < nodes.length; j++) {
			self.appendChild(nodes[j].cloneNode(true));
		}
		div.remove();
	}
	return this;
};

mui.fn['slideBar'] = function(sfn, efn) {
	var $ = mui;
	var opt = {
		start: null,
		move: null,
		end: null
	};

	$(document).on('touchstart', this.selector, function(e) {
		opt.start = e;
		opt.left = e.target.offsetLeft;
		opt.down = true;

	});
	$(document).on('touchmove', 'body', function(e) {
		if(!opt.down) return;
		opt.move = e;
		if(typeof sfn === 'function') sfn.call(this, opt);
		return false;
	});
	$(document).on('touchend', 'body', function(e) {
		if(!opt.down) return;
		opt.end = e;
		opt.down = false;
		if(typeof efn === 'function') efn.call(this, opt);
	});

};

mui.fn['css'] = function(csss){
	if(csss) {
		for(var i = 0; i < this.length; i++){
			var self = this[i];
			for(var key in csss) {
				var cssName = prefix(key);
				if(cssName) self.style[cssName] = csss[key];
			}
		}
	}
	return this;
};

mui.fn['scrollText'] = function(opt){
	for(var i = 0; i < this.length; i++){
		var self = this[i];
		self.opt = {
			height: self.children[0].scrollHeight,
			duration: 300,
			space: 1000
		};
		if(typeof opt === "object") self.opt = mui.extend(self.opt,opt);
		
		self.initHtml = function(){
			var childs = self.children;
			var len = childs.length;
			for(var i = 0; i < len; i++){
				self.appendChild(childs[i].cloneNode(true));
			}
		};
		self.initHtml();
		
		self.interval = setInterval(function(){
			self.show();
		},self.opt.space);
		
		self.show = function(){
			self.opt.lastY = self.opt.lastY == undefined ? 0 : self.opt.lastY;
			var height = self.scrollHeight / 2;
			var duration = self.opt.duration;
			
			self.opt.lastY += self.opt.height;
			
			mui(self).css({
				transition: duration+'ms',
				transform: 'translateY(-'+(self.opt.lastY)+'px)'
			});
			
			if(self.opt.lastY >= height) {
				self.opt.lastY = 0;
				setTimeout(function(){
					mui(self).css({
						transition: '0ms',
						transform: 'translateY(-' + (self.opt.lastY) + 'px)'			
					});
				},duration);
			}
		};
	}
	return this;
};

mui.fn['frameData'] = function(){
	var self = this[0];
	var els = self.querySelectorAll('[name]');
	var data = {};
	for(var i = 0; i < els.length; i++){
		var name = els[i].getAttribute('name');
		if(name) data[name] = els[i].value;
	}
	return data;
};

mui.fn['previewImage'] = function(index){
	var j = 0;
	var imgs = [];
	if(this && this.length) {
		for(var i = 0; i < this.length; i++){
			var src = this[i].getAttribute('src');
			if(this[i] == index) j = i;
			if(src) imgs.push(src);
		}
		if(imgs.length) plus.nativeUI.previewImage(imgs,{
			current : j,
			indicator : 'number'
		});
	}
};

mui.fn['eq'] = function(s){
	var els = [];
	if(this && this.length && !isNaN(s)) {
		els = [this[s]];
	}
	return mui(els);
};

mui.fn['find'] = function(s){
	var els = [];
	if(this && this.length && s && typeof s == 'string') {
		for(var i = 0; i < this.length; i++){
			var el = this[i].querySelectorAll(s) || [];
			for(var i = 0; i < el.length; i++){
				els.push(el[i]);
			}
		}
	}
	return mui(els);
};

mui.fn['parent'] = function(){
	var els = [];
	if(this && this.length) {
		for(var i = 0; i < this.length; i++){
			offRepeat(els,[this[i].parentElement]);
		}
	}
	return mui(els);
};

mui.fn['parents'] = function(s){
	var els = [];
	if(this && this.length && s && typeof s == 'string') {
		for(var i = 0; i < this.length; i++){
			if((/^\.\S+$/).test(s)){
				var classList = this[i].parentElement.classList || [];
				var className = s.replace(/^\./,'');
				for(var j = 0; j < classList.length; j++){
					if(className == classList[j]) {
						els.push(this[i].parentElement);
						break;
					}
				}
			}else if((/^\#\S+$/).test(s)){
				var id = s.replace(/^\#/,'');
				if(this[i].parentElement.id == id) offRepeat(els,[this[i].parentElement]);
			}else{
				if(this[i].parentElement.localName == s)  offRepeat(els,[this[i].parentElement]);
			}
			if(this[i].parentElement.localName != 'html') {
				var arr = mui(this[i].parentElement).parents(s);
				offRepeat(els,arr);
			}
		}
	}
	return mui(els);
};

mui.resetBack = function() {
	mui.back = function(event) {
		if(window.isBack === true) {
			plus.runtime.quit();
		} else {
			window.isBack = true;
			mui.toast(LANGUAGE.exit_application);
		}
		setTimeout(function() {
			window.isBack = false;
		}, 1500);
		return false;
	};
};

function offRepeat(a,b){
	for(var bi in b){
		var c = true;
		if(isNull(b[bi])) continue;
		for(var ai in a){
			if(a[ai] == b[bi] || typeof b[bi] != 'object') c = false;
		}
		if(c) a.push(b[bi]);
	}
	return a;
}

function createMask(fn) {
	this.fn = fn || function() {};
	this.init = function() {
		var div = document.createElement('div');
		div.setAttribute('class', 'you-mask');
		document.body.appendChild(div);
		var self = this;
		div.addEventListener('tap', function() {
			self.close.call(self);
		});
		this.el = div;
	};
	this.show = function() {
		this.el.setAttribute('class', 'you-mask show');
	};
	this.close = function() {
		this.fn();
		this.el.setAttribute('class', 'you-mask');
	};
	this.init(); // 初始化
	return this;
}

function prefix(cssName){
	this.style = document.body.style;
	this.prefixs = ['Webkit','Moz','O','ms','Khtml'];
	if(this.style[cssName] === undefined) {
		cssName = cssName.charAt(0).toUpperCase()+cssName.substring(1);
		for(var i = 0; i < this.prefixs.length; i++){
			var styleName = this.prefixs[i]+cssName;
			if(this.style[styleName] !== undefined) return styleName;
		}
	} else return cssName;
	
	return null;
}

function parseJson(e){ // 字符串转JSON
	if(typeof e === 'object') var d = e;
	else if(typeof e === 'string' && (/^\{\S|\s*\}+$/).test(e)) var d = eval('['+e+']')[0];
	else if(typeof e === 'string' && (/^\[\S|\s*\]+$/).test(e)) var d = eval('['+e+']')[0];
	else return e;
	if(typeof d == 'array') {
		for(var i = 0; i < d.length; i++){
			d[i] = parseJson(d[i]);
		}
	} else if(typeof e === 'object') {
		for(var i in d){
			d[i] = parseJson(d[i]);
		}
	}
	return d;
}

function isNull(s) {
	if(s === 0 || s === '0') return false;
	return s == '' || s == null || s == undefined;
}

function isFunc(test) {
	return typeof test == 'function';
}

function isLength(s, min, max) { //判断长度
	return s.length >= min && s.length <= max;
}

function isEmail(s) { //正确的邮箱格式返回true
	var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	return myreg.test(s);
}

function isPhone(s) { //电话号码正则表达式
	return true;
	//var a = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$)/;
	var a = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
	return a.test(s);
}

function isUrl(s){
	//var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
	var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
	if(s && reg.test(s)) return true;
	else return false;
}

function getUrlParam(name) { // 获取指定的URL参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return decodeURI(r[2]);
	return null; //返回参数值
}


function parseUrl() { // 获取指定的URL参数 对象形式返回
	var s = window.location.search.substr(1);
	if(isNull(s)) return null;

	var obj = {};
	var arr1 = s.replace(/&/g, ',').split(',');
	for(i in arr1) {
		var arr2 = arr1[i].replace('=', ',').split(',');
		obj['' + arr2[0] + ''] = decodeURI(arr2[1]);
	}

	return obj;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function $ajax(url,opt,sfn,efn){
	/*var JSSESSIONID = plus.navigator.getCookie(config.localhost);
		JSSESSIONID = JSSESSIONID + '; expires=' + new Date() + '; path=/';*/
	var options = {
		/*headers : {
			'Set-Cookie' : JSSESSIONID
		},*/
		data:mui.extend({sid : plus.storage.getItem(config.sidkey)},config.data),
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:30000,//超时时间设置；
		loading:true,
		success:function(data){
			if(options.loading) plus.nativeUI.closeWaiting();
			data = parseJson(data);
			//console.log(JSON.stringify(data))
			if(data.status === 'SUCCESS') {
				if(isFunc(sfn)) sfn(data);
			} else if (data.status === 'ERROR') {
				if(isFunc(sfn)) sfn(data);
				mui.toast(data.msg);
			} else if (data.status === 'LOGIN') {
				mui.toast(data.msg);
				openView('login.html');
			}
		},
		error:function(xhr,type,errorThrown){
			if(options.loading) plus.nativeUI.closeWaiting();
			mui.toast(type);
			if(isFunc(efn)) {
				efn(xhr,type,errorThrown);
			}
		}
	};
	//plus.navigator.setCookie(config.localhost,JSSESSIONID);
	if(opt) options = mui.extend(true,options,opt);
	if(options.loading) plus.nativeUI.showWaiting('',{padlock : true,round : 30,background : 'rgba(0,0,0,0.3)'});
	new mui.ajax(url,options);
}



//:::::::::: 动态加密解密（DED: dynamic encript deciphering） :::::::::::

var DEDCK=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
		"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
		"0","1","2","3","4","5","6","7","8","9",
		"`","~","!","@","#","$","%","^","&","*",
		"(",")","-","_","=","+","[","]","{","}",
		";",":","'","\"","\\","|",",",".","<",
		"<",">","/","?"," "];//chart key array

function DED$E(key,pwd){//DED 加密 [返回null则为加密失败]
	if(isNull(key) || isNull(pwd)) return null;
	var keyarr=key.split(",");
	if(keyarr.length!=DEDCK.length) return null;
	var npwd="";
	for(var i=0;i<pwd.length;i++){
		var x=DED$AtCK(pwd[i]);
		if(x==-1) return null;
		npwd+=keyarr[x];
	}
	return npwd;
}

function DED$AtCK(c){//检索密码符在CK中的位置
	for(var i=0;i<DEDCK.length;i++){
		if(c===DEDCK[i]) return i;
	}
	return -1;
}

function uiencryptAction(callBack){// 获取加密key
	$ajax(config.path.uiencryptAction,{},function(r){
		r = parseJson(r);
		if(r.status === 'SUCCESS') if(isFunc(callBack)) callBack(r);
	});
}

//:::::::::::::::::::::::::::END DED::::::::::::::::::::::::::::::::


function copyToClip(s) { // 复制内容到粘贴板
	s = s ? s.toString() : '';
	if(mui.os.ios) {
		var UIPasteboard  = plus.ios.importClass("UIPasteboard");
		var generalPasteboard = UIPasteboard.generalPasteboard();
		generalPasteboard.setValueforPasteboardType(s, "public.utf8-plain-text");
	} else if(mui.os.android) {
		var Context = plus.android.importClass("android.content.Context");
	    var main = plus.android.runtimeMainActivity();
	    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
	    plus.android.invoke(clip,"setText",s);
	}
}






