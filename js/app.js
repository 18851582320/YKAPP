//MES服务器地址
//var mesUrl="http://223.68.194.83:8060/IWFM_HBMES/app/";
var mesUrl="http://192.168.5.200:8080/BTMES/app/";
//var mesUrl="http://192.168.1.62:8019/BTMES/app/";
//appid:io.hibao.HBMESApp

/**
 * 
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.loginname = loginInfo.loginname || '';
		loginInfo.password = loginInfo.password || '';		
		if (loginInfo.loginname.length < 1) {
			return callback('账号不能为空！');
		}
		if (loginInfo.password.length < 1) {
			return callback('密码不能为空！');
		}
		
		var mesUrl=owner.getUrl();
		if(owner.checkEmpty(mesUrl)){
			return callback('服务器地址未获取到，请点击右上角按钮进行配置！');
		}
		
		var loginUrl=mesUrl+"loginForApp.do?";
		$.ajax(loginUrl,{
			data:loginInfo,
			//dataType:'json',
			type:'post',
			success:function(data){
				var data=eval("("+data+")");
				if(data.result=="success"){
					return owner.createState(data.userName,data.STAFF_ID,callback);
				}else{
					callback("用户名或密码错误!");
				}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				plus.nativeUI.alert(errorThrown);
			}
		});
		
	};

	owner.createState = function(name,STAFF_ID, callback) {
		var state = owner.getState();
		state.loginname = name;
		state.isLogin = "true";
		state.STAFF_ID = STAFF_ID;
		owner.setState(state);
		return callback();
	};


	
	/**
	 * 获取服务器地址getUrl
	 */
	owner.getUrl=function(){
		 var severName="192.168.5.200";
		 //var severName="192.168.1.62";
		 var severPort="8080";
		// var severPort="8019";
		 if(!owner.checkEmpty(severName) && !owner.checkEmpty(severPort) ){
		 	return "http://"+severName+":"+severPort+"/BTMES/app/";
		 }else{
		 	return "";
		 }
	}
	
	owner.checkEmpty = function(data){
		if(data==null){
			return true;
		}else if(data==undefined){
			return true;
		}else if(data==""){
			if(data.length==0){
				return true;
			}else{
				return false;
			}
		}else if(data=="null"){
			return true;
		}else if(data.length==0	){
			return true;
		}else{
			return false;
		}
	}
	
	
	owner.checkIsNum = function(data){
		if(!isNaN(data)){
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};


	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	
	
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));