/**
 * Fatcloud Blogger Widget
 *
 * Fatcloud widget converted from WordPress to Blogger
 *
 * @author Harish Dasari
 * @link   http://www.way2blogging.org/
 */

var fatCloud={
	'debug':function(val) {if(console) if(console.debug) console.debug(val)},
	'SWF':'FatCloud.swf',
	'items':{},
	'skinCache':{},
	'saveSkinCacheURL':'',
	'getFlashVersion':function(){
		var flashinstalled = 0;
		var flashversion = 0;
		if (navigator.plugins && navigator.plugins.length) {
			var x = navigator.plugins["Shockwave Flash"];
			if (x) {
				flashinstalled = 2;
				if (x.description) {
					flashversion=x.description.match(/\d+/)[0];
				}
			} else flashinstalled = 1;
			if (navigator.plugins["Shockwave Flash 2.0"]) {
				flashinstalled = 2;
				flashversion = 2;
			}
		} else if (navigator.mimeTypes && navigator.mimeTypes.length) {
			var x = navigator.mimeTypes['application/x-shockwave-flash'];
			if (x && x.enabledPlugin) flashinstalled = 2;
			else flashinstalled = 1;
		} else {
			document.write('<scr'+'ipt language="vbscript" type="text/vbscript"> \n');
			document.write('function getFlashVersion() \n');
			document.write('On Error Resume Next \n');
			for(var i=2;i<=12;i++) document.write(' If IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash.'+i+'")) Then getFlashVersion = '+i+' \n');
			document.write('end function \n');
			document.write('</scr'+'ipt> \n');
			flashversion=getFlashVersion();
		}
		this.flashVersion=parseInt(flashversion);
		this.flashInstalled=flashinstalled;
	},
	'fontList':[],
	'getFontList':function(){return fatCloud.fontList},
	'DOMtoHTML':function(obj) {
		if(obj.nodeType!=1) return obj.nodeValue;
		var ret='<';
		ret+=obj.tagName.toLowerCase();
		for(var i=0;i<obj.attributes.length;i++) if(!obj.attributes[i].value.match(/^(null|false|0|inherit|)$/)) {
			ret+=' ';
			ret+=obj.attributes[i].name;
			ret+='="';
			ret+=obj.attributes[i].value;
			ret+='"';
		}
		if(!obj.childNodes.length) return ret+' />';
		ret+='>';
		for(i=0;i<obj.childNodes.length;i++) ret+=fatCloud.DOMtoHTML(obj.childNodes[i]);
		ret+='</';
		ret+=obj.tagName.toLowerCase();
		ret+='>';
		return ret;
	},
	'onload':function(){
        if(fatCloud.initDone) return;
        fatCloud.initDone=true;
		if(typeof fatCloud.onloadOriginal=='function') fatCloud.onloadOriginal();
		fatCloud.init();
	},
    'initDone':false,
	'init':function(){
		var i, j, item, tag, param, div, top, left, op, opPos;
		var params={
			'allowScriptAccess':'always',
			'menu':'false',
			'movie':fatCloud.SWF
		};
		var attribs={
			'type':'application/x-shockwave-flash',
			'data':fatCloud.SWF
		};
		for(i in this.items) {
			item=this.items[i];
			if(item.flashVersion<=this.flashVersion) {
				item.container=document.getElementById(i);
				item.container.fatCloud=item;
				item.container.style.visibility='hidden'; // so we don't get a brief appearance from the dom. this is undone in getTagsFromDOM() below.
				item.container.style.overflow='hidden'; // clean up any nast blue glows from safari
				item.tags=item.container.getElementsByTagName('a');
				if(!item.tags.length) continue;
				for(j=0;j<item.tags.length;j++) {
					tag=item.tags[j];
					tag.onfocus=this.tagFocus;
					tag.onblur=this.tagBlur;
					tag.fatCloud=item;
				}
				item.swf=document.createElement('object');
				attribs.width=item.container.offsetWidth;
				attribs.height=item.container.offsetHeight;
				attribs.id=item.container.id+'_obj';
				params.FlashVars='id='+escape(item.container.id);
				if(item.skin) params.FlashVars+='&skin='+escape(item.skin);
				if(!item.noXML) params.FlashVars+='&xml='+escape(fatCloud.SWF.replace(/swf$/,'xml'));
				for(j in attribs) item.swf.setAttribute(j, attribs[j]);
				for(j in params) {
					param=document.createElement('param');
					param.name=j;
					param.value=params[j];
					item.swf.appendChild(param);
				}
				op=item.container.parentNode;
				opPos=null;
				if(window.getComputedStyle) opPos=window.getComputedStyle(op, null).position;
				else if(op.currentStyle) opPos=op.currentStyle.position;
				else if(op.style||typeof opPos=='undefined') opPos=op.style.position;
				if(!opPos||opPos=='static') op.style.position='relative';
				else alert(opPos);
				top=item.container.offsetTop;
				left=item.container.offsetLeft;
				div=document.createElement('div');
				div.className='FatCloud';
				div.style.position='absolute';
				div.style.top=top+'px';
				div.style.left=left+'px';
				op.insertBefore(div,item.container);
				if(navigator.userAgent.match(/MSIE/i)) {
					div.innerHTML=fatCloud.DOMtoHTML(item.swf);
					item.swf=div.firstChild;
				} else div.appendChild(item.swf);
			} else document.getElementById(i).style.visibility='';
		}
	},
	'getTagsFromDOM':function(id) {
		fatCloud.items[id].container.style.visibility='';
		var ret=[];
		var tags=fatCloud.items[id].tags;
		for(var i=0;i<tags.length;i++) ret.push({'label':tags[i].innerHTML,'size':parseFloat(tags[i].style.fontSize)});
		return ret;
	},
	'getCloudOptions':function(id) {
		return fatCloud.items[id].options;
	},
	'suspendEvents':false,
	'SWFTagEvent':function(id, tagIndex, eventName) {
		fatCloud.suspendEvents=true;
		var tag=fatCloud.items[id].tags[tagIndex];
		switch(eventName) {
			case 'focus': tag.focus(); break;
			case 'blur': tag.blur(); break;
			case 'select':
				if(typeof tag.onclick=='function') if(tag.onclick()===false) return false;
				document.location.href=tag.href;
			break;
		}
		fatCloud.suspendEvents=false;
	},
	'onloadOriginal':null,
	'tagFocus':function() {
		fatCloud.dispatchDOMTagEvent(this, 'focus');
	},
	'tagBlur':function() {
		fatCloud.dispatchDOMTagEvent(this, 'blur');
	},
	'dispatchDOMTagEvent':function(tag, eventName) {
		if(fatCloud.suspendEvents) return false;
		if(typeof tag.fatCloud.swf.DOMTagEvent!='function') return false;
		var tags=tag.fatCloud.tags;
		for(var i=0;i<tags.length;i++) if(tag==tags[i]) break;
		tag.fatCloud.swf.DOMTagEvent(i, eventName)
	},
	'getSkinCache':function(id) {
		var cloud=fatCloud.items[id];
		var cache=fatCloud.skinCache[id+'_'+cloud.skin];
		if(typeof cache=='undefined') return false;
		if(fatCloud.uToString(id)==cache[0]) {
			var ret=cache[1];
			eval('ret='+ret+';');
			return ret[0];
		} else return false;
	},
	'setSkinCache':function(id, data) {
		var xhr, e;
		try {xhr=new XMLHttpRequest()}
		catch(e) {
			try {xhr=new ActiveXObject('Msxml2.XMLHTTP')}
			catch(e) {
				try {xhr=new ActiveXObject('Microsoft.XMLHTTP')}
				catch(e) {
					return false;
				}
			}
		}
		var cloud=fatCloud.items[id];
		var url=(cloud.saveSkinCacheURL?cloud.saveSkinCacheURL:fatCloud.SWF.replace(/swf$/i,'php'))+'?setSkinCache='+id+'_'+cloud.skin;
		xhr.open('POST',url.replace(/^https?:\/\/[^\/]+/,''),true);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(fatCloud.buildQuery({'tags':fatCloud.uToString(id),'data':fatCloud.jsonEncode([data])}));
	},
	'buildQuery':function(obj) {
		var ret='';
		var n='';
		var p=arguments[1];
		for(var i in obj) {
			n=p?p+'%5B'+i+'%5D':i;
			if(ret.length) ret+='&';
			if(typeof obj[i]=='object') ret+=fatCloud.buildQuery(obj[i],n);
			else ret+=n+'='+encodeURIComponent(obj[i]);
		}
		return ret;
	},
	'uToString':function(id) {
		var tags=fatCloud.getTagsFromDOM(id);
		var options=fatCloud.items[id].options;
		var ret='';
		for(var i=0;i<tags.length;i++) ret+=tags[i].label+tags[i].size;
		for(i in options) ret+=options[i];
		with(fatCloud.items[id].container.style) {
			ret+=width+''+height;
		}
		return ret;
	},
	'jsonEncode':function(value) {
		var charsub={
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};
		var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;
		switch (typeof value) {
		case 'string':
			return r.test(value) ?
				'"' + value.replace(r, function (a) {
					var c = charsub[a];
					if (c) return c;
					c = a.charCodeAt();
					return '\\u00' + Math.floor(c / 16).toString(16) +
											   (c % 16).toString(16);
				}) + '"'
				:
				'"' + value + '"';
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) return 'null';
			if (typeof value.toJSON === 'function') return fatCloud.jsonEncode(value.toJSON());
			a = [];
			if (typeof value.length === 'number' &&	!(value.propertyIsEnumerable('length'))) {
				l = value.length;
				for (i = 0; i < l; i += 1) a.push(fatCloud.jsonEncode(value[i]) || 'null');
				return '[' + a.join(',') + ']';
			}
			for (k in value) if (typeof k === 'string') {
				v = fatCloud.jsonEncode(value[k]);
				if (v) a.push(fatCloud.jsonEncode(k) + ':' + v);
			}
			return '{' + a.join(',') + '}';
		}
	}
};

function FatCloud(id) {
	this.flashVersion=10;
	this.noXML=false;
	this.options={};
	if(arguments.length>1) this.skin=arguments[1];
	fatCloud.items[id]=this;
}

fatCloud.getFlashVersion();
fatCloud.onloadOriginal=window.onload;
window.onload=fatCloud.onload;