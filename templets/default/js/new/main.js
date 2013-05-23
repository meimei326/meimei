// [8,342,47] published at 2012-08-21 14:18:31

//滚动图片构造函数
//UI&UE Dept. mengjia
//version 1.45
function ScrollPic(id, btnPrev, btnNext, dotId, listType) {
    this.id = id;
    this.btnPrev = btnPrev;
    this.btnNext = btnNext;
    this.dotId = dotId;
    this.listType = listType;
    this.dotClass = "dotItem";
    this.dotClassOn = "dotItemOn";
    this.dotObjArr = [];
    this.dotEvent = "click";
    this.circularly = true;
    this.pageWidth = 0;
    this.frameWidth = 0;
    this.speed = 10;
    this.space = 10;
    this.upright = false;
    this.pageIndex = 0;
    this.autoPlay = true;
    this.autoPlayTime = 5;
    this._autoTimeObj;
    this._scrollTimeObj;
    this._state = "ready";
    this.stripDiv = document.createElement("DIV");
    this.lDiv01 = document.createElement("DIV");
    this.lDiv02 = document.createElement("DIV")
};
ScrollPic.prototype = {
    version: "1.45",
    author: "mengjia",
    pageLength: 0,
    touch: true,
    scrollLeft: 0,
    eof: false,
    bof: true,
    init: function () {
        var thisTemp = this;
        if (!this.id) {
            throw new Error("必须指定id.");
            return
        };
        this.scDiv = this.$(this.id);
        if (!this.scDiv) {
            throw new Error("id不是正确的对象.(id = \"" + this.id + "\")");
            return
        };
		this.pageWidth = this.frameWidth = (this.upright ? this.scDiv.offsetHeight : this.scDiv.offsetWidth);
        this.scDiv.style[this.upright ? 'height' : 'width'] = this.frameWidth + "px";
        this.scDiv.style.overflow = "hidden";
        this.lDiv01.innerHTML = this.scDiv.innerHTML;
        this.scDiv.innerHTML = "";
        this.scDiv.appendChild(this.stripDiv);
        this.stripDiv.appendChild(this.lDiv01);
        if (this.circularly) {
            this.stripDiv.appendChild(this.lDiv02);
            this.lDiv02.innerHTML = this.lDiv01.innerHTML;
            this.bof = false;
            this.eof = false
        };
        this.stripDiv.style.overflow = "hidden";
        this.stripDiv.style.zoom = "1";
        this.stripDiv.style[this.upright ? 'height' : 'width'] = "32766px";
        this.lDiv01.style.overflow = "hidden";
        this.lDiv01.style.zoom = "1";
        this.lDiv02.style.overflow = "hidden";
        this.lDiv02.style.zoom = "1";
        if (!this.upright) {
            this.lDiv01.style.cssFloat = "left";
            this.lDiv01.style.styleFloat = "left";
        };
        this.lDiv01.style.zoom = "1";
        if (this.circularly && !this.upright) {
            this.lDiv02.style.cssFloat = "left";
            this.lDiv02.style.styleFloat = "left";
        };
        this.lDiv02.style.zoom = "1";
        this.addEvent(this.scDiv, "mouseover", function () {
            thisTemp.stop()
        });
        this.addEvent(this.scDiv, "mouseout", function () {
            thisTemp.play()
        });
        if (this.btnPrev) {
            this.alObj = this.$(this.btnPrev);
            if (this.alObj) {
                this.addEvent(this.alObj, "mousedown", function (e) {
                    thisTemp.rightMouseDown();
                    e = e || event;
                    thisTemp.preventDefault(e)
                });
                this.addEvent(this.alObj, "mouseup", function () {
                    thisTemp.rightEnd()
                });
                this.addEvent(this.alObj, "mouseout", function () {
                    thisTemp.rightEnd()
                })
            }
        };
        if (this.btnNext) {
            this.arObj = this.$(this.btnNext);
            if (this.arObj) {
                this.addEvent(this.arObj, "mousedown", function (e) {
                    thisTemp.leftMouseDown();
                    e = e || event;
                    thisTemp.preventDefault(e)
                });
                this.addEvent(this.arObj, "mouseup", function () {
                    thisTemp.leftEnd()
                });
                this.addEvent(this.arObj, "mouseout", function () {
                    thisTemp.leftEnd()
                })
            }
        };
        var pages = Math.ceil(this.lDiv01[this.upright ? 'offsetHeight' : 'offsetWidth'] / this.frameWidth),
            i, tempObj;
        this.pageLength = pages;
        if (this.dotId) {
            this.dotListObj = this.$(this.dotId);
            this.dotListObj.innerHTML = "";
            if (this.dotListObj) {
                for (i = 0; i < pages; i++) {
                    tempObj = document.createElement("span");
                    this.dotListObj.appendChild(tempObj);
                    this.dotObjArr.push(tempObj);
                    if (i == this.pageIndex) {
                        tempObj.className = this.dotClassOn
                    } else {
                        tempObj.className = this.dotClass
                    };
                    if (this.listType == 'number') {
                        tempObj.innerHTML = i + 1
                    } else if (typeof (this.listType) == 'string') {
                        tempObj.innerHTML = this.listType
                    } else {
                        tempObj.innerHTML = ''
                    };
                    tempObj.title = "第" + (i + 1) + "页";
                    tempObj.num = i;
                    tempObj["on" + this.dotEvent] = function () {
                        thisTemp.pageTo(this.num)
                    }
                }
            }
        };
        this.scDiv[this.upright ? 'scrollTop' : 'scrollLeft'] = 0;
        if (this.autoPlay) {
            this.play()
        };
        this._scroll = this.upright ? 'scrollTop' : 'scrollLeft';
        this._sWidth = this.upright ? 'scrollHeight' : 'scrollWidth';
        if (typeof (this.onpagechange) === 'function') {
            this.onpagechange()
        };
        this.iPad()
    },
    leftMouseDown: function () {
        if (this._state != "ready") {
            return
        };
        var thisTemp = this;
        this._state = "floating";
        clearInterval(this._scrollTimeObj);
        this._scrollTimeObj = setInterval(function () {
            thisTemp.moveLeft()
        }, this.speed);
        this.moveLeft()
    },
    rightMouseDown: function () {
        if (this._state != "ready") {
            return
        };
        var thisTemp = this;
        this._state = "floating";
        clearInterval(this._scrollTimeObj);
        this._scrollTimeObj = setInterval(function () {
            thisTemp.moveRight()
        }, this.speed);
        this.moveRight()
    },
    moveLeft: function () {
        if (this._state != "floating") {
            return
        };
        if (this.circularly) {
            if (this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth]) {
                this.scDiv[this._scroll] = this.scDiv[this._scroll] + this.space - this.lDiv01[this._sWidth]
            } else {
                this.scDiv[this._scroll] += this.space
            }
        } else {
            if (this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth] - this.frameWidth) {
                this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
                this.leftEnd()
            } else {
                this.scDiv[this._scroll] += this.space
            }
        };
        this.accountPageIndex()
    },
    moveRight: function () {
        if (this._state != "floating") {
            return
        };
        if (this.circularly) {
            if (this.scDiv[this._scroll] - this.space <= 0) {
                this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] - this.space
            } else {
                this.scDiv[this._scroll] -= this.space
            }
        } else {
            if (this.scDiv[this._scroll] - this.space <= 0) {
                this.scDiv[this._scroll] = 0;
                this.rightEnd()
            } else {
                this.scDiv[this._scroll] -= this.space
            }
        };
        this.accountPageIndex()
    },
    leftEnd: function () {
        if (this._state != "floating" && this._state != 'touch') {
            return
        };
        this._state = "stoping";
        clearInterval(this._scrollTimeObj);
        var fill = this.pageWidth - this.scDiv[this._scroll] % this.pageWidth;
        this.move(fill)
    },
    rightEnd: function () {
        if (this._state != "floating" && this._state != 'touch') {
            return
        };
        this._state = "stoping";
        clearInterval(this._scrollTimeObj);
        var fill = -this.scDiv[this._scroll] % this.pageWidth;
        this.move(fill)
    },
    move: function (num, quick) {
        var thisTemp = this;
        var thisMove = num / 5;
        var theEnd = false;
        if (!quick) {
            if (thisMove > this.space) {
                thisMove = this.space
            };
            if (thisMove < -this.space) {
                thisMove = -this.space
            }
        };
        if (Math.abs(thisMove) < 1 && thisMove != 0) {
            thisMove = thisMove >= 0 ? 1 : -1
        } else {
            thisMove = Math.round(thisMove)
        };
        var temp = this.scDiv[this._scroll] + thisMove;
        if (thisMove > 0) {
            if (this.circularly) {
                if (this.scDiv[this._scroll] + thisMove >= this.lDiv01[this._sWidth]) {
                    this.scDiv[this._scroll] = this.scDiv[this._scroll] + thisMove - this.lDiv01[this._sWidth]
                } else {
                    this.scDiv[this._scroll] += thisMove
                }
            } else {
                if (this.scDiv[this._scroll] + thisMove >= this.lDiv01[this._sWidth] - this.frameWidth) {
                    this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
                    this._state = "ready";
                    theEnd = true
                } else {
                    this.scDiv[this._scroll] += thisMove
                }
            }
        } else {
            if (this.circularly) {
                if (this.scDiv[this._scroll] + thisMove < 0) {
                    this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] + thisMove
                } else {
                    this.scDiv[this._scroll] += thisMove
                }
            } else {
                if (this.scDiv[this._scroll] + thisMove <= 0) {
                    this.scDiv[this._scroll] = 0;
                    this._state = "ready";
                    theEnd = true
                } else {
                    this.scDiv[this._scroll] += thisMove
                }
            }
        };
        this.accountPageIndex();
        if (theEnd) {
            this.accountPageIndex('end');
            return
        };
        num -= thisMove;
        if (Math.abs(num) == 0) {
            this._state = "ready";
            if (this.autoPlay) {
                this.play()
            };
            this.accountPageIndex();
            return
        } else {
            clearTimeout(this._scrollTimeObj);
            this._scrollTimeObj = setTimeout(function () {
                thisTemp.move(num, quick)
            }, this.speed)
        }
    },
    pre: function () {
        if (this._state != "ready") {
            return
        };
        this._state = "stoping";
        this.move(-this.pageWidth)
    },
    next: function (reStar) {
        if (this._state != "ready") {
            return
        };
        this._state = "stoping";
        if (this.circularly) {
            this.move(this.pageWidth)
        } else {
            if (this.scDiv[this._scroll] >= this.lDiv01[this._sWidth] - this.frameWidth) {
                this._state = "ready";
                if (reStar) {
                    this.pageTo(0)
                }
            } else {
                this.move(this.pageWidth)
            }
        }
    },
    play: function () {
        var thisTemp = this;
        if (!this.autoPlay) {
            return
        };
        clearInterval(this._autoTimeObj);
        this._autoTimeObj = setInterval(function () {
            thisTemp.next(true)
        }, this.autoPlayTime * 1000)
    },
    stop: function () {
        clearInterval(this._autoTimeObj)
    },
    pageTo: function (num) {
        if (this.pageIndex == num) {
            return
        };
        if (num < 0) {
            num = this.pageLength - 1
        };
        clearTimeout(this._scrollTimeObj);
        clearInterval(this._scrollTimeObj);
        this._state = "stoping";
        var fill = num * this.frameWidth - this.scDiv[this._scroll];
        this.move(fill, true)
    },
    accountPageIndex: function (type) {
        var pageIndex = Math.round(this.scDiv[this._scroll] / this.frameWidth);
        if (pageIndex >= this.pageLength) {
            pageIndex = 0
        };
        this.scrollLeft = this.scDiv[this._scroll];
        var scrollMax = this.lDiv01[this._sWidth] - this.frameWidth;
        if (!this.circularly) {
            this.eof = this.scrollLeft >= scrollMax;
            this.bof = this.scrollLeft <= 0
        };
        if (type == 'end' && typeof (this.onmove) === 'function') {
            this.onmove()
        };
        if (pageIndex == this.pageIndex) {
            return
        };
        this.pageIndex = pageIndex;
        if (this.pageIndex > Math.floor(this.lDiv01[this.upright ? 'offsetHeight' : 'offsetWidth'] / this.frameWidth)) {
            this.pageIndex = 0
        };
        var i;
        for (i = 0; i < this.dotObjArr.length; i++) {
            if (i == this.pageIndex) {
                this.dotObjArr[i].className = this.dotClassOn
            } else {
                this.dotObjArr[i].className = this.dotClass
            }
        };
        if (typeof (this.onpagechange) === 'function') {
            this.onpagechange()
        }
    },
    iPadX: 0,
    iPadLastX: 0,
    iPadStatus: 'ok',
    iPad: function () {
        if (typeof (window.ontouchstart) === 'undefined') {
            return
        };
        if (!this.touch) {
            return
        };
        var tempThis = this;
        this.addEvent(this.scDiv, 'touchstart', function (e) {
            tempThis._touchstart(e)
        });
        this.addEvent(this.scDiv, 'touchmove', function (e) {
            tempThis._touchmove(e)
        });
        this.addEvent(this.scDiv, 'touchend', function (e) {
            tempThis._touchend(e)
        })
    },
    _touchstart: function (e) {
        this.stop();
        this.iPadX = e.touches[0].pageX;
        this.iPadScrollX = window.pageXOffset;
        this.iPadScrollY = window.pageYOffset;
        this.scDivScrollLeft = this.scDiv[this._scroll]
    },
    _touchmove: function (e) {
        if (e.touches.length > 1) {
            this._touchend()
        };
        this.iPadLastX = e.touches[0].pageX;
        var cX = this.iPadX - this.iPadLastX;
        if (this.iPadStatus == 'ok') {
            if (this.iPadScrollY == window.pageYOffset && this.iPadScrollX == window.pageXOffset && Math.abs(cX) > 20) {
                this.iPadStatus = 'touch'
            } else {
                return
            }
        };
        this._state = 'touch';
        var scrollNum = this.scDivScrollLeft + cX;
        if (scrollNum >= this.lDiv01[this._sWidth]) {
            if (this.circularly) {
                scrollNum = scrollNum - this.lDiv01[this._sWidth]
            } else {
                return
            }
        };
        if (scrollNum < 0) {
            if (this.circularly) {
                scrollNum = scrollNum + this.lDiv01[this._sWidth]
            } else {
                return
            }
        };
        this.scDiv[this._scroll] = scrollNum;
        e.preventDefault()
    },
    _touchend: function (e) {
        if (this.iPadStatus != 'touch') {
            return
        };
        this.iPadStatus = 'ok';
        var cX = this.iPadX - this.iPadLastX;
        if (cX < 0) {
            this.rightEnd()
        } else {
            this.leftEnd()
        };
        this.play()
    },
    _overTouch: function () {
        this.iPadStatus = 'ok'
    },
    $: function (objName) {
        if (document.getElementById) {
            return eval('document.getElementById("' + objName + '")')
        } else {
            return eval('document.all.' + objName)
        }
    },
    isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true : false,
    addEvent: function (obj, eventType, func) {
        if (obj.attachEvent) {
            obj.attachEvent("on" + eventType, func)
        } else {
            obj.addEventListener(eventType, func, false)
        }
    },
    delEvent: function (obj, eventType, func) {
        if (obj.detachEvent) {
            obj.detachEvent("on" + eventType, func)
        } else {
            obj.removeEventListener(eventType, func, false)
        }
    },
    preventDefault: function (e) {
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false
        }
    }
};

/*模拟select*/
~function(){if(!sina)var sina={};sina.addEvent=function(o,type,fn){o.attachEvent?o.attachEvent('on'+type,fn):o.addEventListener(type,fn,false)};sina.delEvent=function(o,type,fn){o.detachEvent?o.detachEvent('on'+type,fn):o.removeEventListener(type,fn,false)};sina.$=function(o){return document.getElementById(o)};function sim_select(o){o=document.getElementById(o);o.style.display='none';var opts=o.options,parent=o.parentNode,self=this;this.isShow=false;this.div=document.createElement('div');this.ul=document.createElement('ul');this.h3=document.createElement('h3');this.div.className='sim_select';parent.replaceChild(this.div,o);this.div.appendChild(o);this.ul.style.display='none';this.ul.style.top=this.h3.offsetHeight;this.h3.innerHTML=opts[o.selectedIndex].innerHTML;for(var i=0,l=o.length;i<l;i++){var li=document.createElement('li');li.innerHTML=opts[i].innerHTML;this.ul.appendChild(li);li.onmouseover=function(){this.className+=' over'};li.onmouseout=function(){this.className=this.className.replace(/over/gi,'')};li.onclick=(function(i){return function(){self.hide();self.h3.innerHTML=this.innerHTML;o.selectedIndex=i;if(o.onchange){o.onchange()}}})(i)};this.div.appendChild(this.h3);this.div.appendChild(this.ul);this.ul.style.top=this.h3.offsetHeight+'px';this.ul.style.width=this.h3.offsetWidth-2+'px';this.init()};sim_select.prototype={init:function(){var self=this;sina.addEvent(document.documentElement,'click',function(e){self.close(e)});this.h3.onclick=function(){self.toggles()}},show:function(){this.ul.style.display='block';this.isShow=true},hide:function(){this.ul.style.display='none';this.isShow=false},close:function(e){var t=window.event?window.event.srcElement:e.target;do{if(t==this.div){return}else if(t==document.documentElement){this.hide();return}else{t=t.parentNode}}while(t.parentNode)},toggles:function(){this.isShow?this.hide():this.show()}};window.sim_select=sim_select}();

/**
 * sina flash class
 * @version 1.1.4.2
 * @author [sina ui]zhangping1@
 * @update 2008-7-7 
 */ 
if(typeof(sina)!="object"){var sina={}}
sina.$=function(i){if(!i){return null}
return document.getElementById(i)};var sinaFlash=function(V,x,X,Z,v,z,i,c,I,l,o){var w=this;if(!document.createElement||!document.getElementById){return}
w.id=x?x:'';var O=function(I,i){for(var l=0;l<I.length;l++){if(I[l]==i){return l}}
return-1},C='8.0.42.0';if(O(['eladies.sina.com.cn','ent.sina.com.cn'],document.domain)>-1){w.ver=C}else{w.ver=v?v:C}
w.ver=w.ver.replace(/\./g,',');w.__classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";w.__codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version="+w.ver;w.width=X;w.height=Z;w.movie=V;w.src=w.movie;w.bgcolor=z?z:'';w.quality=c?c:"high";w.__pluginspage="http://www.macromedia.com/go/getflashplayer";w.__type="application/x-shockwave-flash";w.useExpressInstall=(typeof(i)=="boolean")?i:false;w.xir=I?I:window.location;w.redirectUrl=l?l:window.location;w.detectKey=(typeof(o)=="boolean")?o:true;w.escapeIs=false;w.__objAttrs={};w.__params={};w.__embedAttrs={};w.__flashVars=[];w.__flashVarsStr="";w.__forSetAttribute("id",w.id);w.__objAttrs["classid"]=w.__classid;w.__forSetAttribute("codebase",w.__codebase);w.__forSetAttribute("width",w.width);w.__forSetAttribute("height",w.height);w.__forSetAttribute("movie",w.movie);w.__forSetAttribute("quality",w.quality);w.__forSetAttribute("pluginspage",w.__pluginspage);w.__forSetAttribute("type",w.__type);w.__forSetAttribute("bgcolor",w.bgcolor)}
sinaFlash.prototype={getFlashHtml:function(){var I=this;
if(/\((iPhone|iPad|iPod)/i.test(navigator.userAgent) && I.width>=930 && I.height<100 && /^http\:\/\/d\d\./i.test(I.movie)){return '';}//iOS不投放通栏flash广告
var i='<object ';for(var l in I.__objAttrs){i+=l+'="'+I.__objAttrs[l]+'"'+' '}
i+='>\n';for(var l in I.__params){i+='	<param name="'+l+'" value="'+I.__params[l]+'" \/>\n'}
if(I.__flashVarsStr!=""){i+='	<param name="flashvars" value="'+I.__flashVarsStr+'" \/>\n'}
i+='	<embed ';for(var l in I.__embedAttrs){i+=l+'="'+I.__embedAttrs[l]+'"'+' '}
i+='><\/embed>\n<\/object>';return i},__forSetAttribute:function(I,i){var l=this;if(typeof(I)=="undefined"||I==''||typeof(i)=="undefined"||i==''){return}
I=I.toLowerCase();switch(I){case "classid":break;case "pluginspage":l.__embedAttrs[I]=i;break;case "onafterupdate":case "onbeforeupdate":case "onblur":case "oncellchange":case "onclick":case "ondblClick":case "ondrag":case "ondragend":case "ondragenter":case "ondragleave":case "ondragover":case "ondrop":case "onfinish":case "onfocus":case "onhelp":case "onmousedown":case "onmouseup":case "onmouseover":case "onmousemove":case "onmouseout":case "onkeypress":case "onkeydown":case "onkeyup":case "onload":case "onlosecapture":case "onpropertychange":case "onreadystatechange":case "onrowsdelete":case "onrowenter":case "onrowexit":case "onrowsinserted":case "onstart":case "onscroll":case "onbeforeeditfocus":case "onactivate":case "onbeforedeactivate":case "ondeactivate":case "codebase":l.__objAttrs[I]=i;break;case "src":case "movie":l.__embedAttrs["src"]=i;l.__params["movie"]=i;break;case "width":case "height":case "align":case "vspace":case "hspace":case "title":case "class":case "name":case "id":case "accesskey":case "tabindex":case "type":l.__objAttrs[I]=l.__embedAttrs[I]=i;break;default:l.__params[I]=l.__embedAttrs[I]=i}},__forGetAttribute:function(i){var I=this;i=i.toLowerCase();if(typeof I.__objAttrs[i]!="undefined"){return I.__objAttrs[i]}else if(typeof I.__params[i]!="undefined"){return I.__params[i]}else if(typeof I.__embedAttrs[i]!="undefined"){return I.__embedAttrs[i]}else{return null}},setAttribute:function(I,i){this.__forSetAttribute(I,i)},getAttribute:function(i){return this.__forGetAttribute(i)},addVariable:function(I,i){var l=this;if(l.escapeIs){I=escape(I);i=escape(i)}
if(l.__flashVarsStr==""){l.__flashVarsStr=I+"="+i}else{l.__flashVarsStr+="&"+I+"="+i}
l.__embedAttrs["FlashVars"]=l.__flashVarsStr},getVariable:function(I){var o=this,i=o.__flashVarsStr;if(o.escapeIs){I=escape(I)}
var l=new RegExp(I+"=([^\\&]*)(\\&?)","i").exec(i);if(o.escapeIs){return unescape(RegExp.$1)}
return RegExp.$1},addParam:function(I,i){this.__forSetAttribute(I,i)},getParam:function(i){return this.__forGetAttribute(i)},write:function(i){var I=this;if(typeof i=="string"){document.getElementById(i).innerHTML=I.getFlashHtml()}else if(typeof i=="object"){i.innerHTML=I.getFlashHtml()}}};

/* sinalib */
(function(a,b){var c=a.SINA,d;a.SINA=d={VERSION:"0.1"},d.extend=function(a,b,c){if(!b||!a||a===b)return a||null;var d;if(c)for(d in b)a[d]=b[d];else for(d in b)a.hasOwnProperty(d)||(a[d]=b[d]);return a}})(window),function(a){var b="array",c="boolean",d="date",e="error",f="function",g="number",h="null",i="object",j="regexp",k="string",l="undefined",m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=String.prototype.trim,p=String.prototype.trimLeft,q=String.prototype.trimRight,r=/^\s+|\s+$/g,s=/^\s+/g,t=/\s+$/g,u="",v=!1,w=[],x={"undefined":l,number:g,"boolean":c,string:k,"[object Function]":f,"[object RegExp]":j,"[object Array]":b,"[object Date]":d,"[object Error]":e},y=Array.prototype.slice,z=function(a){return y.call(a,0)};try{y.call(document.documentElement.childNodes,0)}catch(A){z=function(a){var b=[],c=a.length,d=0;for(;d<c;d++)b[d]=a[d];return b}}a.extend(a,{isArray:Array.isArray||function(c){return a.type(c)===b},isBoolean:function(a){return typeof a===c},isFunction:function(b){return a.type(b)===f},isDate:function(b){return a.type(b)===d&&b.toString()!=="Invalid Date"&&!isNaN(b)},isNull:function(a){return a===null},isNumber:function(a){return typeof a===g&&isFinite(a)},isObject:function(b){var c=typeof b;return b&&(c===i||c===f||a.isFunction(b))||!1},isPlainObject:function(b){if(!b||a.type(b)!==i||b.nodeType||a.isWindow(b))return!1;if(b.constructor&&!n.call(b,"constructor")&&!n.call(b.constructor.prototype,"isPrototypeOf"))return!1;var c;for(c in b);return c===undefined||n.call(b,c)},isEmptyObject:function(b){if(!a.isObject(b))return!1;for(var c in b)return!1;return!0},isString:function(a){return typeof a===k},isUndefined:function(a){return typeof a===l},type:function(a){return x[typeof a]||x[m.call(a)]||(a?i:h)},isElement:function(a){return!!a&&a.nodeType===1},isDocument:function(a){return!!a&&a.nodeType===9},isWindow:function(a){return!!(a&&a.alert&&a.document)},each:function(b,c,d){if(!b||!c)return;var e,f,g,h=b.length,i=h===undefined||a.isFunction(b);content=d||window;if(i)for(e in b)c.call(d,b[e],e,b);else for(g=0;g<h;g++)c.call(d,b[g],g,b)},trim:o?function(a){return a?o.call(a):""}:function(a){return a?a.toString().replace(r,u):""},trimLeft:p?function(a){return a?p.call(a):""}:function(a){return a?a.toString().replace(s,u):""},trimRight:q?function(a){return a?q.call(a):""}:function(a){return a?a.toString().replace(t,u):""},later:function(b){var c,d,e,f,g,h,i,j,k={fn:function(){},delay:0,isPeriodic:!1,context:null,params:[]};return!a.isFunction(b)&&a.isObject(b)?(a.extend(b,k,!1),f=b.fn,g=b.delay||0,h=!!b.isPeriodic,i=b.params,j=b.context):(f=arguments[0],g=arguments[1]||0,h=!!arguments[2],j=arguments[3]||null,i=arguments[4]||[]),d=f,j&&typeof f=="string"&&(d=j[f]),d?(e=i&&i.length?function(){d.apply(j,i)}:function(){d.call(j)},c=h?setInterval(e,g):setTimeout(e,g),{id:c,periodic:h,cancel:function(){this.periodic?clearInterval(this.id):clearTimeout(this.id)}}):null},arrayify:function(b){return b===undefined?[]:a.isArray(b)?b:b===null||typeof b.length!="number"||a.isString(b)||a.isFunction(b)?[b]:z(b)},now:Date.now||function(){return(new Date).getTime()},isReady:!1,ready:function(b){v||a._bindReady(),a.isReady?b.call(window,a):w.push(b)},_bindReady:function(){var a=this,b=document.documentElement.doScroll,c=b?"onreadystatechange":"DOMContentLoaded",d=function(){a._fireReady()};v=!0;if(document.readyState==="complete")return d();if(document.addEventListener){function e(){document.removeEventListener(c,e,!1),d()}document.addEventListener(c,e,!1),window.addEventListener("load",d,!1)}else{function f(){document.readyState==="complete"&&(document.detachEvent(c,f),d())}document.attachEvent(c,f),window.attachEvent("onload",d);if(window==window.top){function g(){try{b("left"),d()}catch(a){setTimeout(g,1)}}g()}}},_fireReady:function(){if(a.isReady)return;a.isReady=!0;if(w){var b,c=0;while(b=w[c++])b.call(window,a);w=null}},camelCase:function(a){return a.replace(/-([a-z])/ig,function(a,b){return b.toUpperCase()})},toInt:function(a,b){return b=b||10,b=parseInt(""+a,b),isNaN(b)?0:b},toFloat:function(a){return a=parseFloat(""+a),isNaN(a)?0:a}})}(SINA),function(a){a.Array||(a.Array={});var b=Array.prototype.forEach,c=Array.prototype.map,d=Array.prototype.indexOf,e=Array.prototype.lastIndexOf,f=Array.prototype.every,g=Array.prototype.some,h=Array.prototype.filter,i=Array.prototype.slice;a.extend(a.Array,{forEach:b?function(a,c,d){b.call(a,c,d)}:function(a,b,c){var d=0,e=a.length;for(;d<e;d++)b.call(c,a[d],d,a)},map:c?function(a,b,d){return c.call(a,b,d)}:function(b,c,d){var e,f=0,g=b.length;if(a.type(c)==="function"){e=[];for(;f<g;f++)e[f]=c.call(d,b[f],f,b);return e}return i.call(b,0)},indexOf:d?function(a,b,c){return d.call(a,b,c)}:function(a,b,c){var d=-1,e=a.length;typeof c!="number"?c=0:c<0&&(c=e+c,c<0&&(c=0));while(c<e){if(a[c]===b){d=c;break}c++}return d},lastIndexOf:e?function(a,b,c){return e.call(a,b,c)}:function(a,b,c){var d=-1,e=a.length;typeof c!="number"||c>=e?c=e-1:c<0&&(c=e+c);while(c>=0){if(a[c]===b){d=c;break}c--}return d},every:f?function(a,b,c){return f.call(a,b,c)}:function(a,b,c){var d=!0,e=0,f=a.length;for(;e<f;e++)if(!b.call(c,a[e],e,a)){d=!1;break}return d},some:g?function(a,b,c){return g.call(a,b,c)}:function(a,b,c){var d=!1,e=0,f=a.length;for(;e<f;e++)if(b.call(c,a[e],e,a)){d=!0;break}return d},filter:h?function(a,b,c){return h.call(a,b,c)}:function(a,b,c){var d=[],e=0,f=a.length;for(;e<f;e++)b.call(c,a[e],e,a)&&d.push(a[e]);return d},remove:function(b,c,d){var e=b.length-1,f=a.type(c);if(f=="number")c>=0&&c<=e&&b.splice(c,1);else if(f=="function")while(e>=0)c.call(d,b[e],e,b)&&b.splice(e,1),e--;return b}})}(SINA),function(a){var b=navigator&&navigator.userAgent||"",c=location&&location.href||"",d=/windows|win32/i,e=/macintosh/i,f=/AppleWebKit\/([^\s]*)/,g=/Presto\/([^\s]*)/,h=/Gecko\/([^\s]*)/,i=/rv:([^\s\)]*)/,j=/Trident\/([^\s]*)/,k=/MSIE\s([^;]*)/,l=/Firefox\/([^\s]*)/,m=/Chrome\/([^\s]*)/,n=/\/([^\s]*) Safari/,o=/Opera[\s\/]([^\s]*)/,p=/Opera Mini[^;]*/,q=/AdobeAIR\/([^\s]*)/,r=/ Mobile\//,s=/OS ([^\s]*)/,t=/iPad|iPod|iPhone/,u=/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/,v=/Android ([^\s]*);/,w=/webOS\/([^\s]*);/,x=/NokiaN[^\/]*/,y=/KHTML/,z,A=function(a){var b=0;return parseFloat(a.replace(/\./g,function(){return b++,b===1?".":""}))},B={trident:0,gecko:0,webkit:0,presto:0,ie:0,firefox:0,chrome:0,safari:0,opera:0,mobile:null,https:!1,os:null};B.https=c.toLowerCase().indexOf("https")===0,b&&(d.test(b)?B.os="windows":e.test(b)?B.os="mac":B.os="other",z=b.match(k),z&&z[1]?(B.trident=1,B.ie=A(z[1]),z=b.match(j),z&&z[1]&&(B.trident=A(z[1]))):(z=b.match(h),z?(B.gecko=1,z=b.match(i),z&&z[1]&&(B.gecko=A(z[1])),z=b.match(l),z&&z[1]&&(B.firefox=A(z[1]))):(z=b.match(f),z&&z[1]?(B.webkit=A(z[1]),z=b.match(m),z&&z[1]?B.chrome=A(z[1]):(z=b.match(n),z&&z[1]&&(B.safari=A(z[1]))),r.test(b)?(z=b.match(t),z&&z[0]&&(B.mobile=z[0].toLowerCase())):(z=b.match(u),z&&z[0]&&(B.mobile=z[0].toLowerCase()))):(z=b.match(g),z&&z[1]&&(B.presto=A(z[1]),z=b.match(o),z&&z[1]&&(B.opera=A(z[1]),z=b.match(p),z&&(B.mobile=z[0]))))))),a.UA=B}(SINA),function(a){function t(a,b){for(var c in a)if(s[a[c]]!==undefined&&(!b||b(a[c],r)))return!0}function u(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=[a,"Webkit"+c,"Moz"+c,"O"+c,"ms"+c,"Khtml"+c];return!!t(d,b)}function v(a){s.cssText=a}function w(a,b){return v(p.join(a+";")+(b||""))}if(a.support)return;var b,c=document,d=c.documentElement,e=c.documentElement,f=c.createElement("script"),g=c.createElement("div"),h="script"+ +(new Date),i=function(a,b){for(var c in a)b(a[c],c,a)};g.style.display="none",g.innerHTML="   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";var j=g.getElementsByTagName("*"),k=g.getElementsByTagName("a")[0],l=c.createElement("select"),m=l.appendChild(c.createElement("option"));if(!j||!j.length||!k)return;b={byClassName:!!c.getElementsByClassName,leadingWhitespace:g.firstChild.nodeType===3,tbody:!g.getElementsByTagName("tbody").length,htmlSerialize:!!g.getElementsByTagName("link").length,style:/red/.test(k.getAttribute("style")),hrefNormalized:k.getAttribute("href")==="/a",opacity:/^0.55$/.test(k.style.opacity),cssFloat:!!k.style.cssFloat,checkOn:g.getElementsByTagName("input")[0].value==="on",optSelected:m.selected,optDisabled:!1,checkClone:!1,scriptEval:!1,noCloneEvent:!0},l.disabled=!0,b.optDisabled=!m.disabled,f.type="text/javascript";try{f.appendChild(c.createTextNode("window."+h+"=1;"))}catch(n){}e.insertBefore(f,e.firstChild),window[h]&&(b.scriptEval=!0,delete window[h]),e.removeChild(f),g.attachEvent&&g.fireEvent&&(g.attachEvent("onclick",function x(){b.noCloneEvent=!1,g.detachEvent("onclick",x)}),g.cloneNode(!0).fireEvent("onclick")),g=c.createElement("div"),g.innerHTML="<input type='radio' name='radiotest' checked='checked'/>";var o=c.createDocumentFragment();o.appendChild(g.firstChild),b.checkClone=o.cloneNode(!0).cloneNode(!0).lastChild.checked,e=f=g=j=k=null,b.video=function(){var a=c.createElement("video"),b=!!a.canPlayType;return b&&(b=new Boolean(b),b.ogg=a.canPlayType('video/ogg; codecs="theora"'),b.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"'),b.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"')),!!b}(),b.audio=function(){var a=c.createElement("audio"),b=!!a.canPlayType;return b&&(b=new Boolean(b),b.ogg=a.canPlayType('audio/ogg; codecs="vorbis"'),b.mp3=a.canPlayType("audio/mpeg;"),b.wav=a.canPlayType('audio/wav; codecs="1"'),b.m4a=a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")),!!b}(),b.canvas=!!c.createElement("canvas").getContext,b.canvasText=!!b.canvas&&typeof c.createElement("canvas").getContext("2d").fillText=="function",b.postMessage=!!window.postMessage,b.localStorage=function(){try{return"localStorage"in window&&window.localStorage!==null}catch(a){return!1}}(),b.sessionStorage=function(){try{return"sessionStorage"in window&&window.sessionStorage!==null}catch(a){return!1}}(),b.WebSocket="WebSocket"in window;var p=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),q="modernizr",r=c.createElement(q),s=r.style;i({cssAnimation:"animationName",cssTransition:"transitionProperty",cssBackgroundSize:"backgroundSize",cssBoxShadow:"boxShadow",cssBorderImage:"borderImage",cssColumnCount:"columnCount",cssBoxReflect:"boxReflect"},function(a,c){b[c]=u(a)}),b.cssBorderRadius=u("borderRadius","",function(a){return(""+a).indexOf("orderRadius")>-1}),b.cssMultipleBackground=function(){return v("background:url(//:),url(//:),red url(//:)"),(new RegExp("(url\\s*\\(.*?){3}")).test(s.background)}(),b.cssRGBA=function(){return v("background-color:rgba(150,255,150,.5)"),(""+s.backgroundColor).indexOf("rgba")>-1}(),b.cssTransform=function(){return!!t(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"])}(),b.cssTransform3d=function(){var a=!!t(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]);if(a){var b=document.createElement("style"),e=c.createElement("div");b.textContent="@media ("+p.join("transform-3d),(")+"modernizr){#modernizr{height:3px}}",c.getElementsByTagName("head")[0].appendChild(b),e.id="modernizr",d.appendChild(e),a=e.offsetHeight===3,b.parentNode.removeChild(b),e.parentNode.removeChild(e)}return a}(),s=r=null,a.support=b}(SINA),function(a){function b(a,b,c){b=b||1;var d=0;for(;a;a=a[c])if(a.nodeType===1&&++d===b)break;return a}function c(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}a.DOM||(a.DOM={}),a.extend(a.DOM,{byId:function(a){return typeof a=="string"?document.getElementById(a):a},next:function(c){return a.isElement(c)?b(c,2,"nextSibling"):null},previous:function(c){return a.isElement(c)?b(c,2,"previousSibling"):null},parent:function(b){return a.isElement(b)&&(b=b.parentNode)&&b.nodeType!==11?b:null},children:function(b){return a.isElement(b)?c(b.firstChild):[]},siblings:function(b){return a.isElement(b)?c(b.parentNode.firstChild,b):[]},contains:document.documentElement.contains?function(b,c){return(a.isElement(b)||a.isDocument(b))&&a.isElement(c)&&b!==c&&(b.contains?b.contains(c):!0)}:function(b,c){return(a.isElement(b)||a.isDocument(b))&&a.isElement(c)&&!!(b.compareDocumentPosition(c)&16)}})}(SINA),function(a){function G(a,b){return a[b]}function H(a,b,c,d){c++;if(c>=d)return a;var e=b[c];return H(e.get(a,O(e.chkAttr)),b,c,d)}function I(a,b,c){var d=b[c],e=d.rel,f=[],g=0,h,i,j,k;h=a.length;if(c<1)return a;for(;g<h;g++){i=c,k=j=a[g];while(k&&i>0)d=b[--i],d.chkAll&&(k=J[e](k,d.chkAll)),e=d.rel;k&&f.push(j)}return f}function N(a){return M.hasOwnProperty(a)?M[a]:M(a)}function O(){var a=[],b=0,c=arguments.length,d,e,f;for(;b<c;b++){f=arguments[b],d=0,e=f.length;for(;d<e;d++)a.push(f[d])}return c=a.length,c<1?null:c==1?a[0]:function(b){var d=0;for(;d<c;d++)if(!a[d](b))return!1;return!0}}function P(a,b){return function(c){return b===c[a]}}function R(a,b,c){var d=a.rel,e=a.id,f=a.tagName=="*"?"":a.tagName,g=a.className,h=a.chkLeft,i=a.chkAttr,j=a.getBy,k,l;if(d==" "||a.isStartLevel&&b==c){a.get=j=="*"?K[j]:K[j](a[j]);switch(j){case"id":b<c&&h.push(P("id",e)),f&&i.push(P("tagName",f)),g&&i.push(E("class",g,"~="));break;case"tagName":b<c&&h.push(P("tagName",f)),g&&i.push(E("class",g,"~="));break;case"className":b<c&&h.push(E("class",g,"~="));break;default:i.unshift(P("nodeType",1)),g&&i.push(E("class",g,"~="))}}else a.get=K[d],e&&i.unshift(P("id",e)),f&&i.push(P("tagName",f)),g&&i.push(E("class",g,"~="));return a.chkAll=O(h,i),a}function S(a){var b=[],c="",d="",e="",f=0,g=a.length,h=0,i=0,j=0,k=" ",l=null,m=null;while(f<g){c=a.charAt(f);if(c=="["){e=a.slice(f),i=U(e,m);if(!i)return[];f+=i}else if(!/\s/.test(c)){"+>~".indexOf(c)>-1?f++:c=" ",m={isStartLevel:!1,rel:c,id:"",tagName:"*",className:"",chkLeft:[],chkAttr:[]},i=T(a.slice(f),m);if(!i)return[];m.id?b=[m]:b.push(m),l=m,f+=i}else f++}return b}function T(a,b){var c,d=0,f="",g,l;c=a.match(e);if(c){d=c[0].length,c=c[1];if(k.test(c)){if(!D.hasOwnProperty(RegExp.$1))return 0;b.chkAttr.push(D[RegExp.$1])}l=b.rel,h.test(c)&&(b.id=RegExp.$1),i.test(c)&&(b.tagName=RegExp.$1.toUpperCase()),j.test(c)&&(b.className=RegExp.$1)}return d}function U(a,b){var c;return(c=a.match(g))?(b.chkAttr.push(E(c[1],c[4],c[2])),c[0].length):(c=a.match(f))?(b.chkAttr.push(E(c[1])),c[0].length):0}function V(a,b){var c,d,e=0,f,g,h=0,i=0,j=0,k,f,m,n,o,p=g=b.getElementsByTagName("*").length;d=S(a),e=d.length;if(e<1)return[];k=e-1;for(h=e-1;h>=0;h--){f=d[h],f.id?(j=document.getElementById(f.id)?1:0,f.getBy="id"):f.tagName!="*"?(j=b.getElementsByTagName(f.tagName).length,f.getBy="tagName",f.className&&l&&(n=b.getElementsByClassName(f.className).length,n<j&&(j=n,f.getBy="className"))):f.className&&l?(j=b.getElementsByClassName(f.className).length,f.getBy="className"):(j=p,f.getBy="*");if(j<1)return[];j=j*(f.chkAttr.length+1),g>j*1.5&&(g=j,k=h)}o=d[k],o.isStartLevel=!0;for(h=0;h<e;h++)R(d[h],h,k);return m=o.get([b],O(o.chkAttr)),m=I(m,d,k),m=H(m,d,k,d.length),m}var b=/^#([\w\$\-]+)$/,c=/^[\w]+$/,d=/^([\w\$\-\*]*)\.(\w+)$/,e=/^\s*([\w\.\#\:\$\-]+)/,f=/^\[([\w]+)]/,g=/^\[([\w]+)([\~\^\$\*\|\!]?\=)([\'\"]?)(.*?)\3\]/,h=/\#([\w\$\-]+)/,i=/^(\w+)/,j=/\.([\w\$\-]+)/,k=/\:([\w\$\-]+)/,l=a.support.byClassName,m=Object.prototype.hasOwnProperty,n=Array.prototype.slice,o=Array.prototype.push,p=a.trim,q=function(a,b){var c=[],d=0,e=a.length;for(;d<e;d++)b(a[d])&&c.push(a[d]);return c},r=a.Array.every,s=a.DOM,t=s.hasClass,u=s.getAttr,v=function(a,b,c,d){var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===d)break;return b(a)?a:null},w=a.DOM.next,x=function(a,b,c){var d=a.childNodes,e,f=0,g=x.length;for(;e<g;e++)a=d[e],a.nodeType===1&&b(a)&&c.push(a);return c},y=s.contains,z=function(a){return a.nodeType==1},A=a.Array.forEach,B=function(a){var b=[],c=0,d=a.length;for(;c<d;c++)b[c]=a[c];return b},C=Array.lastIndexOf||function(a,b){var c=a.length-1;for(;c>=0;c--)if(b===a[c])return c;return-1},D,E,F;D={enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){return a.parentNode.selectedIndex,a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){return"text"===a.type},radio:function(a){return"radio"===a.type},checkbox:function(a){return"checkbox"===a.type},file:function(a){return"file"===a.type},password:function(a){return"password"===a.type},submit:function(a){return"submit"===a.type},image:function(a){return"image"===a.type},reset:function(a){return"reset"===a.type},button:function(a){return"button"===a.type||a.nodeName.toLowerCase()==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)}},G["class"]=function(a){return a.className},G["for"]=function(a){return a.htmlFor},a.support.hrefNormalized||(G.href=function(a,b){return a.getAttribute("href",2)});var J={};J[" "]=function(a,b){var c=null,d=a;while(d=d.parentNode)if(b(d))return d;return null},J[">"]=function(a,b){return(a=a.parentNode)&&b(a)?a:null},J["+"]=function(a,b){return(a=v(a,b,"previousSibling",2))?a:null},J["~"]=function(a,b){while(a=a.previousSibling)if(1===node.nodeType&&b(a))return a;return null};var K={};K[">"]=function(a,b){var c,d,e,f=[];for(c=0,d=a.length;c<d;c++){e=a[c].firstChild;while(e)1===e.nodeType&&b(e)&&f.push(e),e=e.nextSibling}return f},K["+"]=function(a,b){var c,d,e,f,g=[];if(!b)for(c=0,d=a.length;c<d;c++)(f=w(a[c]))&&g.push(f);else for(c=0,d=a.length;c<d;c++)(f=w(a[c]))&&b(f)&&g.push(f);return g},K["~"]=function(a,b){a=F["~"](a);var c,d,e,f=[];if(!b)for(c=0,d=a.length;c<d;c++){e=a[c];while(e=e.nextSibling)1===e.nodeType&&f.push(e)}else for(c=0,d=a.length;c<d;c++){e=a[c];while(e=e.nextSibling)1===e.nodeType&&b(e)&&f.push(e)}return f},K["*"]=function(a,b){a=F[" "](a);var c,d,e,f,g,h,i=[];f=a.length;if(f<1)return i;if(!b)for(c=0;c<f;c++){g=a[c].getElementsByTagName("*");for(d=0,e=g.length;d<e;d++)1==g[d].nodeType&&i.push(g[d])}else for(c=0;c<f;c++){g=a[c].getElementsByTagName("*");for(d=0,e=g.length;d<e;d++)h=g[d],1==h.nodeType&&b(h)&&i.push(h)}return i},K.id=function(a){return function(b,c){return b=document.getElementById(a),c?b&&c(b)?[b]:[]:b?[b]:[]}},K.tagName=function(a){return function(b,c){b=F[" "](b);var d,e,f,g=b.length,h,i,j=[];if(g<1)return j;if(!c)for(d=0;d<g;d++){h=b[d].getElementsByTagName(a);for(e=0,f=h.length;e<f;e++)j.push(h[e])}else for(d=0;d<g;d++){h=b[d].getElementsByTagName(a);for(e=0,f=h.length;e<f;e++)i=h[e],c(i)&&j.push(i)}return j}},!l||(K.className=function(a){return function(b,c){b=F[" "](b);var d,e,f,g=b.length,h,i,j=[];if(g<1)return j;if(!c)for(d=0;d<g;d++){h=b[d].getElementsByClassName(a);for(e=0,f=h.length;e<f;e++)j.push(h[e])}else for(d=0;d<g;d++){h=b[d].getElementsByClassName(a);for(e=0,f=h.length;e<f;e++)i=h[e],c(i)&&j.push(i)}return j}});var L=document.documentElement,M;L&&(L.hasAttribute?M=function(a){return function(b){return b.hasAttribute(a)}}:(M=function(a){return function(b){return b.getAttribute(a)!==""}},M["class"]=function(a){return a.getAttribute("className")!==""})),M||(M=function(a,b){return function(a){return a.hasOwnProperty(b)}}),E=function(a,b,c){if(arguments.length==1)return N(a);var d=G.hasOwnProperty(a)?G[a]:G,e=E[c](b);return function(b){return e(d(b,a))}},E.tagName=function(a){return function(b){return a==b.tagName}},E["class"]=E.className=function(a){return a=" "+p(a)+" ",function(b){return(" "+b.className+" ").indexOf(a)>-1}},a.extend(E,{"=":function(a){return function(b){return b==a}},"!=":function(a){return function(b){return b!=a}},"~=":function(a){return a=" "+p(a)+" ",function(b){return(" "+b+" ").indexOf(a)>-1}},"|=":function(a){var b=a+"-",c=b.length;return function(d){return d==a||d.slice(0,c)==b}},"^=":function(a){var b=a.length;return function(c){return c.slice(0,b)==a}},"$=":function(a){var b=-a.length;return function(c){return c.slice(b)==a}},"*=":function(a){return function(b){return b.indexOf(a)>-1}}});var Q={"=":1,"!=":1,"~=":4,"|=":2,"^=":2,"$=":2,"*=":2};F={},F[" "]=function(a){var b,c=a.length,d,e;if(c<2)return a;b=1,d=a[0],e=[d];for(;b<c;b++)y(d,a[b])||(d=a[b],e.push(d));return e},F[">"]=function(a){return a},F["+"]=function(a){return a},F["~"]=function(a){var b=-1,c=0,d=a.length,e,f=[],g=[];for(;c<d;c++)(e=a[c].parentNode)&&C(f,e)<0&&(f.push(e),g.push(a[c]));return g},a.extend(a,{query:function(a,b){return arguments.length<1?[document]:(b=b||document.body,V(a,b))}})}(SINA),function(a){var b=a.DOM,c=/[\n\t]/g,d=/\s+/,e=/\r/g,f=/^(?:href|src|style)$/,g=/^(?:button|input)$/i,h=/^(?:button|input|object|select|textarea)$/i,i=/^a(?:rea)?$/i,j=/^(?:radio|checkbox)$/i,k=a.UA.ie?"innerText":"textContent",l={"for":"htmlFor","class":"className",readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing",rowspan:"rowSpan",colspan:"colSpan",tabindex:"tabIndex",usemap:"useMap",frameborder:"frameBorder",innerText:k,textContent:k},m={},n,o,p;a.support.style||(m.style={get:function(a){return a.style.cssText},set:function(a,b){a.style.cssText=""+b}}),m[k]={get:function(a){return a[k]},set:function(a,b){a[k]=""+b}},m.className={get:function(a){return a.className},set:function(a,b){a.className=""+b}},m.innerHTML={get:function(a){return a.innerHTML},set:function(a,c){b.html(a,c)}},n=function(b,c){c=l[c]||c;var d=m[c],e;return d&&"get"in d?d.get(b):!b.attributes[c]&&b.hasAttribute&&!b.hasAttribute(c)?undefined:!a.support.hrefNormalized&&f.test(c)?b.getAttribute(c,2):b.getAttributeNode(c)?b.getAttributeNode(c).nodeValue:b.getAttribute(c)},o=function(a,b,c){b=l[b]||b;var d=m[b];if(d&&"set"in d){d.set(a,c);return}if((b in a||a[b]!==undefined)&&!f.test(b)){if(b==="type"&&g.test(a.nodeName)&&a.parentNode)return;c===null?a.nodeType===1&&a.removeAttribute(b):a.getAttributeNode(b)?a.getAttributeNode(b).nodeValue=c:a[b]=c}else a.setAttribute(b,""+c)},p=function(b,c,d){if(!b||b.nodeType===3||b.nodeType===8)return undefined;var e=a.isPlainObject(c)?2:d!==undefined?1:0,f;if(!e)return n(b,c);if(e==1)o(b,c,d);else for(f in c)o(b,f,c[f])},a.extend(a.DOM,{attr:p,removeAttr:function(b,c){a.DOM.attr(b,c,null)},getAttr:n,setAttr:o})}(SINA),function(a){function w(b,c,d){if(!b||b.nodeType===3||b.nodeType===8||!b.style)return;if(typeof c=="string")if(arguments.length>2)t(b,c,d);else return s(b,c);else if(a.isPlainObject(c))for(var e in c)t(b,e,c[e])}var b=a.each,c=a.DOM.contains,d=a.camelCase,e=function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]},f=/alpha\([^)]*\)/i,g=/opacity=([^)]*)/,h=/-([a-z])/ig,i=/([A-Z])/g,j=/^-?\d+(?:px)?$/i,k=/^-?\d/,l={"float":a.support.cssFloat?"styleFloat":"cssFloat"},m={},n={position:"absolute",visibility:"hidden",display:"block"},o=["Left","Right"],p=["Top","Bottom"],q={zIndex:!0,fontWeight:!0,opacity:!0,zoom:!0,lineHeight:!0},r,s,t,u,v;a.support.opacity||(m.opacity={get:function(a,b){return g.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style;c.zoom=1;var d=isNaN(b)?"":"alpha(opacity="+b*100+")",e=c.filter||"";c.filter=f.test(e)?e.replace(f,d):c.filter+" "+d}}),b(["height","width"],function(a){m[a]={get:function(b,c,d){var f;if(c)return b.offsetWidth!==0?f=v(b,a,d):e(b,n,function(){f=v(b,a,d)}),f+"px"},set:function(a,b){if(!j.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),r=function(a,b,c){var e,f=d(b),g=a.style,h=m[f];return b=l[f]||f,h&&"get"in h&&(e=h.get(a,!1,c))!==undefined?e:g[b]},v=function(a,c,d){var e=c==="width"?o:p,f=c==="width"?a.offsetWidth:a.offsetHeight;return d==="border"?f:(b(e,function(b){d||(f-=parseFloat(s(a,"padding"+b))||0),d==="margin"?f+=parseFloat(s(a,"margin"+b))||0:f-=parseFloat(s(a,"border"+b+"Width"))||0}),f)},document.defaultView&&document.defaultView.getComputedStyle?u=function(a,b){var d,e,f;b=b.replace(i,"-$1").toLowerCase();if(!(e=a.ownerDocument.defaultView))return undefined;if(f=e.getComputedStyle(a,null))d=f.getPropertyValue(b),d===""&&!c(a.ownerDocument.documentElement,a)&&(d=r(a,b));return d}:document.documentElement.currentStyle&&(u=function(a,b){var c,d,e=a.currentStyle&&a.currentStyle[b],f=a.style;return!j.test(e)&&k.test(e)&&(c=f.left,d=a.runtimeStyle.left,a.runtimeStyle.left=a.currentStyle.left,f.left=b==="fontSize"?"1em":e||0,e=f.pixelLeft+"px",f.left=c,a.runtimeStyle.left=d),e}),s=function(a,b,c){var e,f=d(b),g=m[f];return b=l[f]||f,g&&"get"in g&&(e=g.get(a,!0,c))!==undefined?e:u?u(a,b,f):a.style[b]},t=function(a,b,c){if(typeof c=="number"&&isNaN(c)||c==null)return;b=d(b),typeof c=="number"&&!q[b]&&(c+="px");var e=m[b];if(!e||!("set"in e)||(c=e.set(a,c))!==undefined)try{a.style[b]=c}catch(f){}},a.extend(a.DOM,{style:w,getStyle:s,setStyle:t,width:function(a,b){if(arguments.length<2)return v(a,"width");t(a,"width",b)},height:function(a,b){if(arguments.length<2)return v(a,"height");t(a,"height",b)},size:function(b,c){if(arguments.length<2)return{width:v(b,"width"),height:v(b,"height")};a.isObject(c)&&(c.hasOwnProperty("width")&&t(b,"width",c.width),c.hasOwnProperty("height")&&t(b,"height",c.width))}})}(SINA),function(a){function b(a){return a&&typeof a=="string"&&/^[a-zA-Z\$][\w\d\-\$]*$/.test(a)}a.extend(a.DOM,{hasClass:function(a,c){return!!a.className&&b(c)&&(" "+a.className+" ").indexOf(" "+c+" ")>-1},addClass:function(c,d){if(!a.isElement(c)||!b(d))return;c.className?a.DOM.hasClass(c,d)||(c.className+=" "+d):c.className=d},removeClass:function(c,d){a.isElement(c)&&b(d)&&a.DOM.hasClass(c,d)&&(c.className=a.Array.remove(c.className.split(/\s+/),function(a){return a==d}).join(" "))}})}(SINA),function(a){function d(b,c,d){var e=b.childNodes,f=document.createElement("div"),g,h;for(g=e.length-1;g>=0;g--)e[g].parentNode.removeChild(e[g]);f.innerHTML="<table><"+d+">"+c+"</"+d+"></table>",e=a.arrayify(f.getElementsByTagName(d)[0].childNodes);for(g=0,h=e.length;g<h;g++)b.appendChild(e[g]);e=f=null}function e(a,b){var c,d,f,g;c=a.nodeName;if(e.hasOwnProperty(c))e[c](a,b);else{c=document.createElement("div"),c.innerHTML=b,d=c.childNodes,a.innerHTML="";for(f=0,g=d.length;f<g;f++)a.appendChild(d[f]);c=null}}var b=a.UA.ie?"innerText":"textContent",c=a.UA;e.TABLE=function(a,b){var c=document.createElement("div"),e,f=a.getElementsByTagName("tbody");f.length>0?f=f[0]:f=a.appendChild(document.createElement("tbody")),b=b.replace(/^\s*<tbody[^>]*>((?:.|\n)*?)<\/tbody>\s*$/ig,"$1"),d(f,b,"TBODY");return},e.THEAD=function(a,b){d(a,b,"THEAD")},e.TFOOT=function(a,b){d(a,b,"TFOOT")},e.TR=function(a,b){d(a,b,"TR")},e.STYLE=function(a,b){return},e.SCRIPT=function(a,b){a.text=b},a.extend(a.DOM,{text:function(d,e){var f="SCRIPT"==d.nodeName,g=f&&c.ie?"text":b;if(!(arguments.length>1))return a.isElement(d)&&d[g]?d[g]:"";if(typeof e!="string"||!a.isElement(d))return;d[g]=e},html:function(b,c){if(!(arguments.length>1))return a.isElement(b)&&b.innerHTML?b.innerHTML:"";if(typeof c!="string"||!a.isElement(b))return;var d,f,g=a.DOM.remove;d=b.getElementsByTagName("*");for(f=d.length-1;f>=0;f--)try{g(d[f])}catch(h){}d=null;try{b.innerHTML=c}catch(h){e(b,c)}},value:function(b,c){if(!(arguments.length>1))return a.isElement(b)&&b.value?b.value:"";if(typeof c!="string"||!a.isElement(b))return;b.value=c}})}(SINA),function(a){a.extend(a.DOM,{create:function(b,c){if(c&&!a.isElement(c)||typeof b!="string")return;c||(c=document.body);var d=document.createElement(b);c.appendChild(d);try{return d}finally{d=null}},remove:function(b){if(!a.isElement(b)||!a.isElement(b.parentNode))return;try{a.Event.removeListener(b),a.DOM.removeCache(b)}catch(c){}b.parentNode.removeChild(b)},insertBefore:function(b,c){a.isElement(b)&&a.isElement(c)&&c.parentNode.insertBefore(b,c)},insertAfter:function(b,c){a.isElement(b)&&a.isElement(c)&&(c.nextSibling?c.parentNode.insertBefore(b,c.nextSibling):c.parentNode.appendChild(b))}})}(SINA),function(a){var b=a.DOM,c="__Sina"+a.now(),d=1,e={},f={embed:1,object:1,applet:1};a.extend(b,{_guid:function(a){var b=d.toString();return d++,a?a+b:b},_expando:c,_noData:f,_cache:{},cache:function(d,g,h){if(!d||d.nodeName&&f[d.nodeName.toLowerCase()])return;d==window&&(d=e);var i=!!d.nodeType,j=i?d[c]:null,k=i?b._cache:d,l,m=typeof g=="string",n=typeof g=="object";if(i){j||(d[c]=j=b._guid()),k[j]||(k[j]={}),l=k[j];if(n){a.extend(l,g,!0);return}}else k||(k={}),l=k,n&&a.extend(l,g,!0);if(m&&h!==undefined)l[g]=h;else return m?l[g]:l},removeCache:function(a,d){if(!a||a.nodeName&&f[a.nodeName.toLowerCase()])return;a==window&&(a=e);var g=!!a.nodeType,h=g?a[c]:null,i=g?b._cache:a,j,k;if(g&&!h)return;j=g?i[h]:i;if(d)j&&delete j[d];else if(j)for(k in j)delete j[k]}})}(SINA),function(a){var b=a.DOM,c=a.isElement,d=a.isPlainObject,e=a.isNumber,f=a.isWindow,g=a.DOM.style,h=a.UA.ie?!0:!1,i=function(a){return parseInt(g(a,"left"))||0},j=function(a){return parseInt(g(a,"top"))||0},k=function(a){var b=0;while(a)b+=a.offsetTop,a=a.offsetParent;return b},l=function(a){var b=0;while(a)b+=a.offsetLeft,a=a.offsetParent;return b};a.extend(b,{offset:function(a,b){if(a&&c(a)){if(!(b&&e(b.left)&&e(b.top)))return{top:l(a),left:k(a)};var d=l(a),f=k(a),h=b.left-d,m=b.top-f,n=i(a),o=j(a);g(a,"position")==="static"&&g(a,"position","relative"),g(a,"top",o+m+"px"),g(a,"left",n+h+"px")}},position:function(a,b){if(a&&c(a))if(b&&e(b.left)&&e(b.top))g(a,"position")==="static"&&g(a,"position","relative"),g(a,"top",b.top+"px"),g(a,"left",b.left+"px");else return{left:i(a),top:j(a)}},scrollLeft:function(a,d){if(a)if(c(a))if(d&&e(d))a.scrollLeft=d;else return a.scrollLeft;else if(f(a))if(d&&e(d))window.scrollTo(d,b.scrollTop(a));else return window.pageXOffset||(h?document.documentElement.scrollLeft:document.body.scrollLeft)},scrollTop:function(a,d){if(a)if(c(a))if(d&&e(d))a.scrollTop=d;else return a.scrollTop;else if(f(a))if(d&&e)window.scrollTo(b.scrollLeft(a),d);else return window.pageYOffset||(h?document.documentElement.scrollTop:document.body.scrollTop)},offsetParent:function(a){return a&&c(a)?a.offsetParent||document.body:null}})}(window.SINA),function(a){var b=a.DOM,c=a.isElement,d=a.isBoolean,e=a.isNumber,f=b.style,g=a.UA.ie?!0:!1;a.extend(b,{width:function(a,b){if(a&&c(a)){if(b&&e(b)){f(a,"width",b+"px");return}return parseInt(a,"width")||0}return null},height:function(a,b){if(a&&c(a)){if(b&&e(b)){f(a,"height",b+"px");return}return parseInt(f(a,"height"))||0}return null},size:function(a,c){if(c)b.width(a,c.width),b.height(a,c.height);else{var d=b.width(a),f=b.height(a);return e(d)&&e(f)?{width:d,height:f}:null}},innerWidth:function(a){return a&&c(a)?(b.width(a)||0)+(parseInt(f(a,"paddingLeft"))||0)+(parseInt(f(a,"paddingRight"))||0):null},innerHeight:function(a){return a&&c(a)?(b.height(a)||0)+(parseInt(f(a,"paddingTop"))||0)+(parseInt(f(a,"paddingBottom"))||0):null},innerSize:function(a){var c=b.innerWidth(a),d=b.innerHeight(a);return e(c)&&e(d)?{width:c,height:d}:null},outerWidth:function(a,d){return a&&c(a)?b.innerWidth(a)+(parseInt(f(a,"borderLeftWidth"))||0)+(parseInt(f(a,"borderRightWidth"))||0)+(d===!0)?(parseInt(f(a,"marginLeft"))||0)+(parseInt(f(a,"marginRight"))||0):0:null},outerHeight:function(a,d){return a&&c(a)?b.innerHeight(a)+(parseInt(f(a,"borderTopWidth"))||0)+(parseInt(f(a,"borderBottomWidth"))||0)+(d===!0)?(parseInt(f(a,"marginTop"))||0)+parseInt(f(a,"marginBottom")):0:null},outerSize:function(a,c){var d=b.outerWidth(a,c),f=b.outerHeight(a,c);return e(d)&&e(f)?{width:d,height:f}:null},documentWidth:function(){return g?document.documentElement.scrolllWidth:document.body.scrollWidth},documentHeight:function(){return g?document.documentElement.scrollHeight:document.body.scrollHeight},viewportWidth:function(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth},viewportHeight:function(){return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}})}(window.SINA),function(a){var b=a.DOM,c=document.addEventListener?function(a,b,c,d){a&&a.addEventListener&&a.addEventListener(b,c,!!d)}:function(a,b,c){a&&a.attachEvent&&a.attachEvent("on"+b,c)},d=document.removeEventListener?function(a,b,c,d){a&&a.removeEventListener&&a.removeEventListener(b,c,!!d)}:function(a,b,c){a&&a.detachEvent&&a.detachEvent("on"+b,c)},e=1,f=function(a){var b=document.createElement("div"),c;return a="on"+a,c=a in b,c||(b.setAttribute(a,"return;"),c=typeof b[a]=="function"),b=null,c},g={special:{},addListener:function(d,e,f){if(!d||d.nodeType===3||d.nodeType===8)return;a.isWindow(d)&&d!==window&&!d.frameElement&&(d=window);if(!a.isFunction(f))return;var h,i,j,k=!1,l,m,n;h=b.cache(d);if(!h)return;h.__events||(h.__events={}),i=h.__events,k=!d._customEventTarget,k&&!h.__target&&(h.__target=d),i[e]||(l=k&&g.special[e]||{},j=function(b,c){if(!b||!b.fixed)b=new a.EventObject(d,b,e);return a.isObject(c)&&a.extend(b,c),l.setup&&l.setup(b),(l.handle||g._handle)(d,b,i[e].listeners)},i[e]={handle:j,listeners
:[]},m=l.fix||e,n=l.capture,k&&c(d,m,j,n)),i[e].listeners.push(f)},removeListener:function(c,e,f){if(!c||c.nodeType===3||c.nodeType===8)return;var h,i,j,k,l,m=!1,n,o,p,q;h=b.cache(c);if(!h)return;i=h.__events;if(!i)return;j=i[e];if(j){k=j.listeners,o=k.length;if(a.isFunction(f)&&o){l=[],p=0;for(n=0;n<o;n++)f!==k[n]&&(l[p++]=k[n]);j.listeners=l,o=l.length}if(f===undefined||o===0)m=!c._customEventTarget,q=m&&g.special[e]||{},m&&d(c,q.fix||e,j.handle),j=null,delete i[e]}if(e===undefined||a.isEmptyObject(i)){for(e in i)g.remove(c,e);i=null,"__target"in h&&(h.__target=null),delete h.__events}},_handle:function(a,b,c){var d,e,f,g;c=c.slice(0);for(e=0,f=c.length;e<f;++e)g=c[e],d=g.call(a,b),d===!1&&(b.preventDefault(),b.stopPropagation());return d},support:f};a.Event=g,a.addListener=g.addListener,a.removeListener=g.removeListener,window.attachEvent&&!window.addEventListener&&g.addListener(window,"unload",function(){var a,c=b._cache;for(a in c)if(c[a].__target)try{g.removeListener(c[a].__target)}catch(d){}})}(SINA),function(a){var b=a.DOM,c="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),d=function(a,b,c){var d=this;d.currentTarget=a,d.originalEvent=b||{},b?(d.type=b.type,d._fix()):(d.type=c,d.target=a),d.currentTarget=a,d.fixed=!0};a.extend(d.prototype,{_fix:function(){var a=this,b=a.originalEvent,d=c.length,e,f=a.currentTarget,g=f.nodeType===9?f:f.ownerDocument||document;while(d)e=c[--d],a[e]=b[e];a.target||(a.target=a.srcElement||document),a.target.nodeType===3&&(a.target=a.target.parentNode),!a.relatedTarget&&a.fromElement&&(a.relatedTarget=a.fromElement===a.target?a.toElement:a.fromElement);if(a.pageX===undefined&&a.clientX!==undefined){var h=g.documentElement,i=g.body;a.pageX=a.clientX+(h&&h.scrollLeft||i&&i.scrollLeft||0)-(h&&h.clientLeft||i&&i.clientLeft||0),a.pageY=a.clientY+(h&&h.scrollTop||i&&i.scrollTop||0)-(h&&h.clientTop||i&&i.clientTop||0)}a.which===undefined&&(a.which=a.charCode!==undefined?a.charCode:a.keyCode),a.metaKey===undefined&&(a.metaKey=a.ctrlKey),!a.which&&a.button!==undefined&&(a.which=a.button&1?1:a.button&2?3:a.button&4?2:0)},preventDefault:function(){var a=this.originalEvent;a.preventDefault?a.preventDefault():a.returnValue=!1,this.isDefaultPrevented=!0},stopPropagation:function(){var a=this.originalEvent;a.stopPropagation?a.stopPropagation():a.cancelBubble=!0,this.isPropagationStopped=!0},fixed:!1,isDefaultPrevented:!1,isPropagationStopped:!1}),a.EventObject=d}(SINA),function(a){var b=document,c=a.Event,d=c.special,e=c.support,f=function(a,b,d){var e=b.relatedTarget;try{while(e&&e!==a)e=e.parentNode;e!==a&&c._handle(a,b,d)}catch(f){}};b.addEventListener&&(d.mouseenter={fix:"mouseover",setup:function(a){a.type="mouseenter"},handle:f},d.mouseleave={fix:"mouseout",setup:function(a){a.type="mouseleave"},handle:f},d.focusin={fix:"focus",capture:!0,setup:function(a){a.type="focusin"}},d.focusout={fix:"blur",capture:!0,setup:function(a){a.type="focusout"}})}(SINA),function(a){var b=a.Event,c=a.DOM,d=a.isFunction,e=a.extend,f=function(a){};e(f.prototype,{_customEventTarget:!0,trigger:function(a,b){var e,f,g,h;return e=c.cache(this),e?(f=e.__events,f?(g=f[a],g?(h=g.handle,d(h)&&h(null,b),this):this):this):this},addListener:function(a,c){return b.addListener(this,a,c),this},removeListener:function(a,c){return b.removeListener(this,a,c),this}}),a.EventTarget=f,a.makeTarget=function(a,b){e(a.prototype,f.prototype,!0)}}(SINA),function(a){var b=a.Event,c=a.DOM,d=a.extend,e=function(d,f,g,h){if(!d||d.nodeType===3||d.nodeType===8)return;if(g===!1||g===!0)h=g,g=null;var i,j,k,l,m=f.type||f,n,o,p,q,r;h||(f=new a.EventObject(d,null,m)),i=c.cache(d),i&&(j=i.__events,k=j&&j[m],l=k&&k.handle,a.isFunction(l)&&l(f,g)),f.currentTarget=d;try{i&&d["on"+m]&&d["on"+m].apply(d,g)===!1&&f.preventDefault()}catch(s){}n=d.parentNode||d.ownerDocument;if(!f.isPropagationStopped&&n)e(n,f,g,!0);else if(!f.isDefaultPrevented){o=f.target,p=o.nodeName.toLowerCase()==="a"&&m==="click",q=b.special[m]||{};if((!q._default||q._default.call(d,f)===!1)&&!p&&c.cache(o)){try{o[m]&&(r=o["on"+m],r&&(o["on"+m]=null),o[m]())}catch(t){}r&&(o["on"+m]=r)}}};d(b,{trigger:e}),a.trigger=e}(SINA),function(a){var b=a.Event,c=a.DOM,d=a.extend,e=a.isString,f=a.isFunction,g=a.isEmptyObject,h=a.isWindow,i=a.query,j={focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"},k=function(a,b,c){if(a===c)return!1;var d=i(b,c),e=d.length,f;for(f=0;f<e;f++)if(a===d[f])return!0;return!1};d(b,{delegate:function(a,d,g,i){if(!a||a.nodeType===3||a.nodeType===8)return;if(!e(g)||!e(d)||!f(i))return;h(a)&&(a=document);var l,m,n,o,p,q;l=c.cache(a);if(!l)return;m=l.__delegate,m||(m=l.__delegate={}),m[d]||(p=function(b){var c=b.target,e=m[d].delegates,f=!1,g,h,i,j;while(c!==a&&!f){for(i in e)if(k(c,i,a)){j=e[i],h=j.length;for(g=0;g<h;g++)j[g].call(c,b)===!1?(b.preventDefault(),b.stopPropagation(),f=!0):b.isPropagationStopped&&(f=!0)}if(f)break;c=c.parentNode}},m[d]={handle:p,delegates:{}},b.addListener(a,j[d]||d,p)),n=m[d],o=n.delegates[g],o||(o=n.delegates[g]=[]),o.push(i)},detach:function(a,d,e,i){if(!a||a.nodeType===3||a.nodeType===8)return;h(a)&&(a=document);var k,l,m,n,o,p,q,r,s,t;k=c.cache(a);if(!k)return;l=k.__delegate;if(!l)return;m=l[d];if(m){n=m.delegates,o=n[e];if(o){q=o.length;if(q&&f(i)){r=[],s=0;for(p=0;p<q;p++)t=o[p],i!==t&&(r[s++]=t);n[e]=r,q=r.length}if(i===undefined||q===0)o=null,delete n[e]}if(e===undefined||g(n))b.removeListener(a,j[d]||d,m.handle),n=null,m=null,delete l[d]}if(d===undefined||g(l)){for(d in l)b.removeListener(a,j[d]||d,l[d].handle),delete l[d];l=null,delete k.__delegate}}}),b.undelegate=b.detach}(SINA),function(a){var b=a.DOM,c=a.query,d=a.Array.forEach,e=a.Array.indexOf,f=a.Array.every,g=a.Array.some,h=Array.prototype,i=h.push,j=h.slice,k=function(a){var b=a.nodeType;return!!(b&&(b===1||b===9)||a.document&&a.setInterval)},l=function(a){if(!(this instanceof l))return new l(a);var b,d,e;if(typeof a=="string")this._selector=a,i.apply(this,c(a));else if(a&&k(a))this[0]=a,this.length=1;else if(a instanceof l)i.apply(this,a.toDOMNodes());else if(a&&(d=a.length))for(b=0;b<d;b++)e=a[b],e&&k(e)&&i.call(this,e)};a.extend(l.prototype,{length:0,item:function(a){return new l(this[a])},toDOMNodes:function(){return j.call(this,0)},each:function(a,b){d(this,a,b)},find:function(a){var b=[],d=0,f=this.length,g,h,i,j;for(;d<f;d++){g=this[d],g==window&&(g=document),h=c(a,g),i=h.length;for(j=0;j<i;j++)e(b,h[j])===-1&&b.push(h[j])}return new l(b)},_selector:""}),a.find=function(a,b){return new l(c(a,b))},a.NodeList=l}(SINA),function(a){var b=a.DOM,c=a.Event,d=a.NodeList,e=a.Array.forEach,f=a.Array.indexOf,g=a.Array.every,h=a.Array.some,i=Array.prototype,j=i.push,k=i.slice,l=1,m=2,n=3;d.$importMethod=function(b,c,g){if(typeof c=="string"&&c){var h=b[c];if(h&&typeof h=="function"){g=g||0;switch(g){case 1:d.prototype[c]=function(){var b=k.call(arguments,0),c=0,e=this.length,g,i,j,l,m=[];b.unshift(null);for(;c<e;c++){b[0]=this[c],g=h.apply(window,b);if(g)if(a.isArray(g))for(j=0,i=g.length;j<i;j++)l=g[j],f(m,l)===-1&&m.push(l);else f(m,g)===-1&&m.push(g)}return new d(m)};break;case 2:d.prototype[c]=function(){var a=k.call(arguments,0),b=arguments.length===2||typeof arguments[0]=="object",c=0,d=this.length;a.unshift(null);if(b)for(;c<d;c++)a[0]=this[c],h.apply(window,a);else if(d)return a[0]=this[0],h.apply(window,a)};break;case 3:d.prototype[c]=function(){var a=k.call(arguments,0),b=arguments.length===1,c=0,d=this.length;a.unshift(null);if(b)for(;c<d;c++)a[0]=this[c],h.apply(window,a);else if(d)return a[0]=this[0],h.apply(window,a)};break;default:d.prototype[c]=function(){var a=k.call(arguments,0),b=0,c=this.length,d;a.unshift(null);for(;b<c;b++){node=this[b],a[0]=this[b],d=h.apply(window,a);if(d===!0)return!0}if(d===!1)return!1}}}}else a.isArray(c)&&e(c,function(a){d.$importMethod(b,a,g)})},d.$importMethod(b,["next","previous","parent","children","siblings"],l),d.$importMethod(b,["attr","style","cache"],m),d.$importMethod(b,["html","text","value"],n),d.$importMethod(b,["hasClass","addClass","removeClass","removeAttr","removeCache"]),d.$importMethod(c,["addListener","removeListener","trigger","delegate","detach","undelegate"])}(SINA),function(a){var b=a.DOM,c=a.UA,d=a.NodeList,e=a.query,f=a.trim,g=a.arrayify,h=a.Array.forEach,i=Array.prototype.slice,j=c.ie,k=c.gecko,l=/<(\w+)/i,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/<script([^>]*)>([\s\S]*?)<\/script>/ig,o=/\ssrc=(['"])(.*?)\1/i,p=/\scharset=(['"])(.*?)\1/i,q=1,r=2,s=3,t=4,u=function(a){var b=a&&a.nodeType;return!(!b||b!==1&&b!==3)},v=function(a){var b=a.cloneNode(!0);return c.ie<8&&(b.innerHTML=a.innerHTML),b},w=function(a,b,c){b=b instanceof d?b:new d(b);var e=null,f=0,g=b.length,h;if(!g)return;e=x(a);switch(c){case q:for(;f<g-1;f++)if(h=b[f])h.firstChild?h.insertBefore(v(e),h.firstChild):h.appendChild(v(e));if(h=b[f])h.firstChild?h.insertBefore(e,h.firstChild):h.appendChild(e);break;case r:for(;f<g-1;f++)(h=b[f])&&h.appendChild(v(e));(h=b[f])&&h.appendChild(e);break;case s:for(;f<g-1;f++)(h=b[f])&&h.parentNode&&h.parentNode.insertBefore(v(e),h);(h=b[f])&&h.parentNode&&h.parentNode.insertBefore(e,h);break;case t:for(;f<g-1;f++)(h=b[f])&&h.parentNode&&(h.nextSibling?h.parentNode.insertBefore(v(e),h.nextSibling):h.parentNode.appendChild(v(e)));(h=b[f])&&h.parentNode&&(h.nextSibling?h.parentNode.insertBefore(e,h.nextSibling):h.parentNode.appendChild(e));break;default:}},x=function(a){var b=null;return u(a)?b=a:typeof a=="string"?b=z(a):a&&a.length&&(b=y(a)),b},y=function(a,b){if(a&&a.length){var c=null,d=0,e=a.length;b=b||a[0].ownerDocument,c=b.createDocumentFragment(),a.item&&(a=g(a));for(d=0,len=a.length;d<len;d++)c.appendChild(a[d]);return c}return null},z=function(b,c){if(typeof b=="string"&&(b=f(b))){var d=null,e,g,h,i=A;return c=c||document,e=m.exec(b),e&&e[1]?d=c.createElement(e[1]):(e=l.exec(b),e&&e[1]&&(g=e[1].toLowerCase(),B[g]&&a.isFunction(B[g])&&(i=B[g])),h=i(b,c).childNodes,h.length===1?d=h[0].parentNode.removeChild(h[0]):d=y(h,c)),d}return null},A=function(a,b){var c=b.createElement("div");return c.innerHTML=a,c},B={};if(k||j){var C="<table>",D="</table>",E=/(?:\/(?:thead|tfoot|caption|col|colgroup)>)+\s*<tbody/;a.extend(B,{td:function(a,b){return z("<tr>"+a+"</tr>",b)},tr:function(a,b){return z("<tbody>"+a+"</tbody>",b)},tbody:function(a,b){return z("<table>"+a+"</table>",b)},option:function(a,b){return z("<select>"+a+"</select>",b)},col:function(a,b){return z("<colgroup>"+a+"</colgroup>",b)},legend:function(a,b){return z("<fieldset>"+a+"</fieldset>",b)}}),j&&(B.script=function(a,b){var c=b.createElement("div");return c.innerHTML="-"+a,c.removeChild(c.firstChild),c},j<8&&(B.tbody=function(a,b){var c=z(C+a+D,b),d=c.children.tags("tbody")[0];return c.children.length>1&&d&&!E.test(a)&&tbody.parentNode.removeChild(d),c})),a.extend(B,{th:B.td,thead:B.tbody,tfoot:B.tbody,caption:B.tbody,colgroup:B.tbody,optgroup:B.option})}a.extend(d.prototype,{append:function(a){w(a,this,r)},appendTo:function(a){w(this,a,r)},addBefore:function(a){w(this,a,s)},addAfter:function(a){w(this,a,t)},remove:function(b){h(this.find(b),function(b){a.isElement(b)&&b.parentNode&&b.parentNode.removeChild(b)})}})}(SINA),function(a,b){var c=a.isFunction,d=a.isObject,e=a.isArray,f=Object.prototype.toString,g=b.JSON,h=f.call(g)==="[object JSON]"&&g,i=!!h,j=i,k="undefined",l="object",m="null",n="string",o="number",p="boolean",q="date",r={"undefined":k,string:n,"[object String]":n,number:o,"[object Number]":o,"boolean":p,"[object Boolean]":p,"[object Date]":q,"[object RegExp]":l},s="",t="{",u="}",v="[",w="]",x=",",y=",\n",z="\n",A=":",B=": ",C='"',D=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,E={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},F=function(a){var b=typeof a;return r[b]||r[f.call(a)]||(b===l?a?l:m:k)},G=function(a){return E[a]||(E[a]="\\u"+("0000"+(+a.charCodeAt(0)).toString(16)).slice(-4)),E[a]},H=function(a){return C+a.replace(D,G)+C},I=function(a,b){return a.replace(/^/gm,b)},J=function(b,g,h){function G(a,b){var f=a[b],j=F(f),C=[],D=h?B:A,E,J,K,L,M;d(f)&&c(f.toJSON)?f=f.toJSON(b):j===q&&(f=k(f)),c(i)&&(f=i.call(a,b,f)),f!==a[b]&&(j=F(f));switch(j){case q:case l:break;case n:return H(f);case o:return isFinite(f)?f+s:m;case p:return f+s;case m:return m;default:return undefined}for(J=r.length-1;J>=0;--J)if(r[J]===f)throw new Error("JSON.stringify. Cyclical reference");E=e(f),r.push(f);if(E)for(J=f.length-1;J>=0;--J)C[J]=G(f,J)||m;else{K=g||f,J=0;for(L in K)K.hasOwnProperty(L)&&(M=G(f,L),M&&(C[J++]=H(L)+D+M))}return r.pop(),h&&C.length?E?v+z+I(C.join(y),h)+z+w:t+z+I(C.join(y),h)+z+u:E?v+C.join(x)+w:t+C.join(x)+u}if(b===undefined)return undefined;var i=c(g)?g:null,j=f.call(h).match(/String|Number/)||[],k=a.JSON.dateToString,r=[],C,D,E;if(i||!e(g))g=undefined;if(g){C={};for(D=0,E=g.length;D<E;++D)C[g[D]]=!0;g=C}return h=j[0]==="Number"?(new Array(Math.min(Math.max(0,h),10)+1)).join(" "):(h||s).slice(0,10),G({"":b},"")},K=b.eval,L=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,M=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,N=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,O=/(?:^|:|,)(?:\s*\[)+/g,P=/[^\],:{}\s]/,Q=function(a){return"\\u"+("0000"+(+a.charCodeAt(0)).toString(16)).slice(-4)},R=function(a,b){var c=function(a,d){var e,f,g=a[d];if(g&&typeof g=="object")for(e in g)g.hasOwnProperty(e)&&(f=c(g,e),f===undefined?delete g[e]:g[e]=f);return b.call(a,d,g)};return typeof b=="function"?c({"":a},""):a},S=function(a,b){a=a.replace(L,Q);if(!P.test(a.replace(M,"@").replace(N,"]").replace(O,"")))return R(K("("+a+")"),b);throw new SyntaxError("JSON.parse")},T;if(h){try{i="0"===h.stringify(0)}catch(U){i=!1}try{j=h.parse('{"ok":false}',function(a,b){return a==="ok"?!0:b}).ok}catch(U){j=!1}}T=j?h.parse:S,a.JSON={stringify:i?h.stringify:J,parse:function(a,b){typeof a!="string"&&(a+="");try{return T(a,b)}catch(c){}},_stringify:J,_parse:S,useNativeParse:j,useNativeStringify:i}}(SINA,window),function(a){var b=a.isNull,c=a.isUndefined,d=a.isFunction,e=a.isBoolean,f=a.isNumber,g=a.isString,h=a.isArray,i=a.isObject,j=Object.prototype.toString,k=a.Array.map,l=[],m=function(b){var c=a.QueryString.unescape;return function d(e,f){var g,h,i,j,k;return arguments.length!==2?(e=e.split(b),d(c(e.shift()),c(e.join(b)))):(e=e.replace(/^\s+|\s+$/g,""),a.isString(f)&&(f=f.replace(/^\s+|\s+$/g,""),isNaN(f)||(h=+f,f===h.toString(10)&&(f=h))),g=/(.*)\[([^\]]*)\]$/.exec(e),g?(j=g[2],i=g[1],j?(k={},k[j]=f,d(i,k)):d(i,[f])):(k={},e&&(k[e]=f),k))}},n=function(a,b){return a?h(a)?a.concat(b):!i(a)||!i(b)?[a].concat(b):o(a,b):b},o=function(a,b){for(var c in b)c&&b.hasOwnProperty(c)&&(a[c]=n(a[c],b[c]));return a},p=function(a){var b=a.split("&"),c=k(b,m("=")),d={},e=0,f=c.length;for(;e<f;e++)d=n(d,c[e]);return d},q=function(i,k,m){var n,o,p,r,s,t,u="&",v="=",w=a.QueryString.escape;k=!!k;if(b(i)||c(i)||d(i))return m?w(m)+v:"";if(e(i)||j.call(i)==="[object Boolean]")i=+i;if(f(i)||g(i))return w(m)+v+w(i);if(h(i)){t=[],m=k?m+"[]":m,r=i.length;for(p=0;p<r;p++)t.push(q(i[p],k,m));return t.join(u)}for(p=l.length-1;p>=0;--p)if(l[p]===i)return"";l.push(i),t=[],n=m?m+"[":"",o=m?"]":"";for(p in i)i.hasOwnProperty(p)&&(s=n+p+o,t.push(q(i[p],k,s)));return l.pop(),t=t.join(u),!t&&m?m+"=":t};a.QueryString={escape:encodeURIComponent,unescape:function(a){return decodeURIComponent(a.replace(/\+/g," "))},stringify:q,parse:p}}(SINA),function(a,b,c){b.IO={E_START:"io-start",E_COMPLETE:"io-complete",E_SUCCESS:"io-success",E_FAILURE:"io-failure",E_CANCEL:"io-cancel",_splitUrl:function(a){var b,c,d,e,f,g;return c=0,e=a.indexOf("#",c),g=e>-1?a.substr(e+1):"",d=a.indexOf("?",c),d>-1?(f=e>-1?a.substr(d+1,e-d-1):a.substr(d+1),b=a.substr(0,d)):(f="",b=e>-1?a.substr(0,e):a),[b,f,g]}}}(window,SINA),function(a,b,c){var d=b.extend,e=b.isString,f=b.isObject,g=b.isPlainObject,h=b.isFunction,i=b.IO,j=b.Event,k=b.JSON,l=k&&k.parse,m=function(){},n=i.E_START,o=i.E_COMPLETE,p=i.E_SUCCESS,q=i.E_FAILURE,r=i.E_CANCEL,s=i._splitUrl,t=1,u=function(a,b){var d,f,g=a;b=b.toLowerCase();if(!e(a)){d=a.getResponseHeader("Content-Type")||"",f=b==="xml"||!b&&d.indexOf("xml")>-1,g=f?a.responseXML:a.responseText;if(f&&(g===null||g.documentElement.nodeName==="parsererror"))throw new Error("parsererror")}if(e(g)&&(b==="json"||!b&&d.indexOf("json")>-1)&&l){g=l(g);if(g===c)throw new Error("parsererror")}return g},v=a.location.protocol,w=a.XMLHttpRequest,x=a.ActiveXObject,y=x?function(){if(w&&v!=="file:")try{return new w}catch(a){}try{return new x("Microsoft.XMLHTTP")}catch(a){}}:function(){return new w},z={method:"GET",data:"",dataType:"text",async:!0,timeout:0,cache:!1,headers:{},onstart:null,oncomplete:null,onsuccess:null,onfailure:null},A=function(a,b){if(!(this instanceof A))return new A(a,b);if(!e(a)||a.length===0)return;this.url=a,this.id=t++,d(b,z),this._config=b,b.onstart&&this.addListener(n,function(a){b.onstart(a.xhr)}),b.oncomplete&&this.addListener(o,function(a){b.oncomplete(a.data,a.status,a.xhr)}),b.onsuccess&&this.addListener(p,function(a){b.onsuccess(a.data,a.status,a.xhr)}),b.onfailure&&this.addListener(q,function(a){b.onfailure(a.data,a.status,a.xhr)})};d(A.prototype,{_xhr:null,_timer:null,id:0,running:!1,url:"",send:function(a){if(this.running)return;this.running=!0;var c=this,e=c.url,f,g,h,i,j=c.running,k,l=c._config,r=l.cache,t=a||l.data,v=l.method&&l.method.toUpperCase()||"GET",w=l.dataType&&l.dataType.toLowerCase()||"text",x=l.async,z=l.headers,A;f=s(e),g=f[0],h=f[1],i=f[2],l.cache||(h+=h.length?"&sul_ts="+b.now():"sul_ts="+b.now()),t&&v==="GET"&&(h+=h.length?"&"+t:t,t=null),t&&v==="POST"&&d(z,{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}),e=g,h&&(e+="?"+h),i&&(e+="#"+i),c._xhr=k=y(),k.open(v,e,x);for(A in z)z.hasOwnProperty(A)&&k.setRequestHeader(A,z[A]);k.onreadystatechange=function(){if(c.running&&k&&k.readyState===4){var a,b=p,d="";c.running=!1,k.onreadystatechange=m,c.timer&&c.timer.cancel();try{a=k.status,a>=200&&a<300||a===304||a===1223?(b=p,d="success"):(b=q,d="failure"),t=u(k,w)}catch(e){d=e.message,d!=="parsererror"&&(b=q)}c.trigger(b,{data:t,status:d,xhr:k}),c.trigger(o,{data:t,status:d,xhr:k})}else if(!k||k.readyState===0)c.running&&(c.trigger(o,{status:"aborted",xhr:k}),c.running=!1),k&&(k.onreadystatechange=m)},c.trigger(n,{xhr:k});try{k.send(v==="POST"?t:null)}catch(B){c.trigger(q,{status:"failure",xhr:k}),c.trigger(o,{status:"failure",xhr:k})}l.timeout&&(c.timer=b.later(function(){c.cancel(),k.abort(),k.onreadystatechange=m,c.trigger(q,{status:"timeout",xhr:k})},l.timeout)),x||c.trigger(o,{status:"success",xhr:k})},cancel:function(){if(this.running){this.running=!1;var a=this._xhr;a.abort(),a.onreadystatechange=m,this.timer&&(this.timer.cancel(),this.timer=null),this.trigger(o,{status:"aborted",xhr:a})}}}),b.makeTarget(A),d(i,{Request:A})}(window,SINA),function(a,b,c){var d=b.extend,e=b.isString,f=b.isObject,g=b.isPlainObject,h=b.isFunction,i=b.IO,j=b.Event,k=b.JSON,l=b.QueryString,m=function(){},n=i.E_START,o=i.E_COMPLETE,p=i.E_SUCCESS,q=i.E_FAILURE,r=i.E_CANCEL,s=i._splitUrl,t=/\.css(?:\?|$)/i,u=a.document,v=u.getElementsByTagName("head")[0]||u.documentElement,w=u.createElement("script").readyState?function(a,b){var c=a.onreadystatechange;a.onreadystatechange=function(){var d=a.readyState;if(d==="loaded"||d==="complete")a.onreadystatechange=null,c&&c(),b.call(this)}}:function(a,b){a.addEventListener("load",b,!1)},x=function(a,b){var c=t.test(a),d=u.createElement(c?"link":"script");return c?(d.href=a,d.rel="stylesheet"):(d.src=a,d.async=!0),c?h(b)&&b.call(d,""):w(d,function(){h(b)&&b.call(d,""),v&&d.parentNode&&v.removeChild(d)}),v.insertBefore(d,v.firstChild),d},y=function(d,f,g,i,j,k){var l=s(d),m=l[0],n=l[1],o=l[2],p,q,r=null;return e(f)&&(n+=n.length?"&"+f:f),i?(k=k||"callback",j=j||"jsonp"+b.now()+Math.floor(Math.random()*1e5),p=k+"="+j,n+=n.length?"&"+p:p,q=a[j],a[j]=function(b){if(h(q))q(b);else{a[j]=c;try{delete a[j]}catch(d){}}h(g)&&g(b)}):r=g,d=m,n&&(d+="?"+n),o&&(d+="#"+o),x(d,r)};d(i,{loadScript:function(a,b,c){return h(b)&&(c=b,b=null),y(a,b,c)},getJSONP:function(a,b,c){var d=arguments[3],e=arguments[4];return h(b)&&(e=d,d=c,c=b,b=null),y(a,b,c,!0,d,e)}})}(window,SINA),function(a,b,c){var d=b.extend,e=b.IO,f=b.isFunction;d(e,{ajax:function(a,b){var c=b&&b.dataType&&b.dataType.toLowerCase(),d=b&&b.onsuccess,g=f(d)?function(a){b.onsuccess({data:a,status:"success",xhr:null})}:null;switch(c){case"script":return e.loadScript(a,b.data,g);case"jsonp":return e.getJSONP(a,b.data,g,b.jsonpCallback,b.jsonp);default:var h=new e.Request(a,b);return h.send(),h}},get:function(a,b,c,d){return f(b)&&(d=c,c=b,b=null),e.ajax(a,{method:"GET",data:b,onsuccess:c,dataType:d})},post:function(a,b,c,d){return f(b)&&(d=c,c=b,b=null),e.ajax(a,{method:"POST",data:b,onsuccess:c,dataType:d})}})}(window,SINA)

/* location ads begin */
/* 2010-08-02 18:39:38 */

// libweb_getCookie
eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8 9(a){2 b=3.4.e(";",a);5(b==-1){b=3.4.6}7 g(3.4.f(a,b))}8 h(a){2 b=a+"=";2 c=b.6;2 d=3.4.6;2 i=0;k(i<d){2 j=i+c;5(3.4.f(i,j)==b){7 9(j)}i=3.4.e(" ",i)+1;5(i==0)l}7\'\'}',22,22,'||var|document|cookie|if|length|return|function|libweb_getCookieVal|||||indexOf|substring|unescape|libweb_getCookie|||while|break'.split('|'),0,{}));

var local_index = unescape(libweb_getCookie('dummy_ip_local_index'));
var location1 = unescape(libweb_getCookie('dummy_ip_location1'));
var location2 = unescape(libweb_getCookie('dummy_ip_location2'));

if (local_index == '') {
    // location info
    var dictLoc = {"安徽":0,"北京":1,"重庆":2,"福建":3,"甘肃":4,"广东":5,"广西":6,"贵州" :7,"海南":8,"河北":9,"黑龙江":10,"河南":11,"湖北":12,"湖南":13,"内蒙古":14,"江苏":15,"江西":16,"吉林":17,"辽宁":18,"宁夏":19,"青海":20,"山西":21,"陕西":22,"山东":23,"上海":24,"四川":25,"天津":26,"西藏":27,"新疆":28,"云南":29,"浙江":30,"香港":31,"澳门":32,"台湾":33};
    if(typeof remote_ip_info == "object" && remote_ip_info.ret == 1) {
    	local_index = dictLoc[remote_ip_info.province];

	if(typeof local_index == "undefined") {
		local_index = 1;
		location1 = "其它";
		location2 = "其它";
    	}else if(remote_ip_info.province == "北京" || remote_ip_info.province == "天津" || remote_ip_info.province == "上海" || remote_ip_info.province == "重庆") {
    		location1 = remote_ip_info.province + '市';
    		location2 = remote_ip_info.province;
    	}else if(remote_ip_info.province != "香港" && remote_ip_info.province != "澳门" && remote_ip_info.province != "广西" && remote_ip_info.province != "宁夏" && remote_ip_info.province != "内蒙古" && remote_ip_info.province != "西藏" && remote_ip_info.province != "新疆" && remote_ip_info.province != ""){
    		location1 = remote_ip_info.province + '省';
    		location2 = remote_ip_info.city;
    	}else{
    		location1 = remote_ip_info.province;
    		location2 = remote_ip_info.city;
    	}

	// 临时
	/*if(remote_ip_info.start == "180.95.128.0" || remote_ip_info.start == "180.95.224.0") {
		local_index = 4;
		location1 = "甘肃省";
		location2 = "兰州";
	}*/

    }else{
	// no result
    	local_index = 1;
	try{
		var ip = remote_ip_info.ip.split(".");
	}catch(e){

	}

	if(typeof ip != "undefined" && (ip[0] == "10" || (ip[0] == "172" && parseInt(ip[1]) >= 16 && parseInt(ip[1]) <= 31) || (ip[0] == "192" && ip[1] == "168"))) {
    		location1 = "北京市";
		location2 = "北京";
	}else{
		location1 = "其它";
    		location2 = "其它";
	}
    }
}

// webShow 1.2.8 for zhitou and pinpai, WSCSubstr 1.0.0
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('1j 1x(){P.1k="1.2.8";P.X=1j(a,b,c){P.1k="1.0.0";4 d=(1l[3]==Q?Q:11);5(R a=="Y"||a=="")12 11;4 e=a.1y(\'\');4 f=0;4 g=e.6;9(4 i=0;i<g;i++){5(f>=c){1z}5(e[i].1A(0)<=1B){f++}M{f+=2}}5(f>c&&d!=Q){i--}12 a.1m(b,i)};4 h=S V();4 l=S V();4 m=S V();4 n=S V();4 o={\'O\':\'我也要在这里发布\',\'13\':\'1n://1C.15.1o.1p\',\'N\':\'1n://1D.15.1o.1p/1E/15/1F.1G\'};4 p=1l[0];5(R p=="16"){17{4 q=p.1H;4 r=p.1I;4 s=p.1J;4 t=p.Z;4 u=p.1K;4 v=p.1L;4 w=p.1M;4 x=p.18;4 y=p.19}1a(e){12 11}}4 z=(p.1q==T?Q:p.1q);4 A=(p.1r==T?"1s":p.1r);4 B=(p.W==T?"1t":p.W);4 C=(p.1u==T?11:p.1u);4 D=(p.1b==T?1:p.1b);4 E=u*v;5(R r=="16"){9(4 i 1N r){4 F=11;5(r[i].Z==T||r[i].Z==""){5(r[i].1b.1m(D,1)!=\'1\'){F=Q}}M{r[i].Z=","+r[i].Z+",";5(r[i].Z.1O(","+t+",")==-1){F=Q}}5((r[i].O==""&&B=="1t")||(r[i].N==""&&B=="N")||F==Q){5(z==Q)1P;M r[i]=o}5(R r[i].7!="Y"&&r[i].7!="")h[r[i].7]=r[i];M l[l.6]=r[i]}9(i=l.6;i<E;i++){l[l.6]=o}}5(A=="1s"||A=="1v"){4 G=1Q.1R("1S"+q);5(G.6>0){9(4 i=0;i<G.6;i++){5(G[i].1c("7")!=T&&G[i].1c("7")!="")m[G[i].1c("7")]=G[i];M n[n.6]=G[i]}}5(C==Q){5(h.6>0){9(4 i=0;i<h.6;i++){5(h[i]!=T){4 H=h[i];5(H.O!=""){5(B=="N"){m[H.7].10[0].U=\'<1d 1e="\'+H.N+\'" 1f="0" />\';m[H.7].10[1].U=P.X(H.O,0,w)}M{m[H.7].U=P.X(H.O,0,w)}m[H.7].1g=H.13;5(R H.W!="Y")m[H.7].1h("1i",H.W)}}}}}M{5(m.6>0){9(4 i=0;i<m.6;i++){5(m[i]!=T){5(R h[i]=="16"){H=h[i]}M{H=o}5(B=="N"){4 I=\'<1d 1e="\'+H.N+\'" 1w="\';5(x!="")I+=\'18:\'+x+\'14;\';5(y!="")I+=\'19:\'+y+\'14;\';I+=\'" 1f="0" />\';m[i].10[0].U=I;m[i].10[1].U=P.X(H.O,0,w)}M{m[i].U=P.X(H.O,0,w)}m[i].1g=H.13;5(R H.W!="Y")m[H.7].1h("1i",H.W)}}}}5(l.6>0){4 J=S V();4 K=S V();9(4 i=0,j=0;i<E;i++,j++){17{5(l[j].O==""){1T S 1U();}M{J[i]=l[j]}}1a(e){J[i]=o}}4 k=0;9(i=0;i<v;i++){K[i]=S V();9(4 j=0;j<u;j++){K[i][j]=J[k];k++}}k=0;9(i=0;i<u;i++){9(4 j=0;j<v;j++,k++){17{5(B=="N"){5(R K[j][i].N=="Y")K[j][i].N=K[j][i].1V;4 I=\'<1d 1e="\'+K[j][i].N+\'" 1w="\';5(x!="")I+=\'18:\'+x+\'14;\';5(y!="")I+=\'19:\'+y+\'14;\';I+=\'" 1f="0" />\';n[k].10[0].U=I;n[k].10[1].U=P.X(K[j][i].O,0,w)}M{n[k].U=P.X(K[j][i].O,0,w)}n[k].1g=K[j][i].13;5(R K[j][i].W!="Y")n[k].1h("1i",K[j][i].W)}1a(e){}}}}}5(A=="1W"||A=="1v"){4 L=S V();L[\'1X\']=h;L[\'1Y\']=l;12 L}}',62,123,'||||var|if|length|pos||for|||||||||||||||||||||||||||||||||||||||else|pic|title|this|true|typeof|new|null|innerHTML|Array|type|csubstr|undefined|city|childNodes|false|return|url|px|sina|object|try|width|height|catch|area|getAttribute|img|src|border|href|setAttribute|webtype|function|version|arguments|substr|http|com|cn|rearrange|action|padding|text|fixedinc|both|style|webShow|split|break|charCodeAt|255|p4p|d1|pfpghc|1217235599_75506058_zhitou|jpg|resid|webs|province|cols|rows|titlelen|in|indexOf|continue|document|getElementsByName|res|throw|Error|picpath|data|fixed|grid'.split('|'),0,{}));

eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8 9(a,b,c){1 d=(h[3]==5?5:6);4(j a=="k"||a=="")7 6;1 e=a.l(\'\');1 f=0;1 g=e.m;n(1 i=0;i<g;i++){4(f>=c){o}4(e[i].p(0)<=q){f++}r{f+=2}}4(f>c&&d!=5){i--}7 a.s(b,i)}',29,29,'|var|||if|true|false|return|function|WSCSubstr||||||||arguments||typeof|undefined|split|length|for|break|charCodeAt|255|else|substr'.split('|'),0,{}));

/* location ads end */

function SubShowClass(C,i,c,l,I){var V=this,v=V;V.parentObj=V.$(C);if(V.parentObj==null&&C!="none"){throw new Error("SubShowClass(ID)参数错误:ID 对像不存在!(value:"+C+")")};V.lock=false;V.label=[];V.defaultID=c==null?0:c;V.selectedIndex=V.defaultID;V.openClassName=l==null?"selected":l;V.closeClassName=I==null?"":I;V.mouseIn=false;var O=function(){v.mouseIn=true},o=function(){v.mouseIn=false};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseover",O)}else{V.parentObj.addEventListener("mouseover",O,false)}};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseout",o)}else{V.parentObj.addEventListener("mouseout",o,false)}};if(typeof(i)!="string"){i="onmousedown"};i=i.toLowerCase();switch(i){case "onmouseover":V.eventType="mouseover";break;case "onmouseout":V.eventType="mouseout";break;case "onclick":V.eventType="click";break;case "onmouseup":V.eventType="mouseup";break;default:V.eventType="mousedown"};V.autoPlay=false;V.autoPlayTimeObj=null;V.spaceTime=5000};SubShowClass.prototype={version:"1.31",author:"mengjia",_setClassName:function(l,I){var o=this,i;i=l.className;if(i){i=i.replace(o.openClassName,"");i=i.replace(o.closeClassName,"");i+=" "+(I=="open"?o.openClassName:o.closeClassName)}else{i=(I=="open"?o.openClassName:o.closeClassName)};l.className=i},addLabel:function(labelID,contID,parentBg,springEvent,blurEvent){var t=this,labelObj=this.$(labelID),contObj=this.$(contID);if(labelObj==null&&labelID!="none"){throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:"+labelID+")")};var TempID=this.label.length;if(parentBg==""){parentBg=null};this.label.push([labelID,contID,parentBg,springEvent,blurEvent]);var tempFunc=function(){t.select(TempID)};if(labelID!="none"){if(labelObj.attachEvent){labelObj.attachEvent("on"+this.eventType,tempFunc)}else{labelObj.addEventListener(this.eventType,tempFunc,false)}};if(TempID==this.defaultID){if(labelID!="none"){this._setClassName(labelObj,"open")};if(this.$(contID)){contObj.style.display=""};if(this.ID!="none"){if(parentBg!=null){this.parentObj.style.background=parentBg}};if(springEvent!=null){eval(springEvent)}}else{if(labelID!="none"){this._setClassName(labelObj,"close")};if(contObj){contObj.style.display="none"}};var mouseInFunc=function(){t.mouseIn=true},mouseOutFunc=function(){t.mouseIn=false};if(contObj){if(contObj.attachEvent){contObj.attachEvent("onmouseover",mouseInFunc)}else{contObj.addEventListener("mouseover",mouseInFunc,false)};if(contObj.attachEvent){contObj.attachEvent("onmouseout",mouseOutFunc)}else{contObj.addEventListener("mouseout",mouseOutFunc,false)}}},select:function(num,force){if(typeof(num)!="number"){throw new Error("select(num)参数错误:num 不是 number 类型!(value:"+num+")")};if(force!=true&&this.selectedIndex==num){return};var i;for(i=0;i<this.label.length;i++){if(i==num){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"open")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display=""};if(this.ID!="none"){if(this.label[i][2]!=null){this.parentObj.style.background=this.label[i][2]}};if(this.label[i][3]!=null){eval(this.label[i][3])}}else if(this.selectedIndex==i||force==true){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"close")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display="none"};if(this.label[i][4]!=null){eval(this.label[i][4])}}};this.selectedIndex=num},random:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("random()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};var l=0,o;for(o=0;o<arguments.length;o++){l+=arguments[o]};var I=Math.random(),i=0;for(o=0;o<arguments.length;o++){i+=arguments[o]/l;if(I<i){O.select(o);break}}},order:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("order()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};if(!(/^\d+$/).test(SubShowClass.sum)){return};var i=0,o;for(o=0;o<arguments.length;o++){i+=arguments[o]};var I=SubShowClass.sum%i;if(I==0){I=i};var l=0;for(o=0;o<arguments.length;o++){l+=arguments[o];if(l>=I){O.select(o);break}}},play:function(spTime){var t=this;if(typeof(spTime)=="number"){this.spaceTime=spTime};clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime);this.autoPlay=true},autoPlayFunc:function(){var i=this;if(i.autoPlay==false||i.mouseIn==true){return};i.nextLabel()},nextLabel:function(){var t=this,index=this.selectedIndex;index++;if(index>=this.label.length){index=0};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},previousLabel:function(){var t=this,index=this.selectedIndex;index--;if(index<0){index=this.label.length-1};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},stop:function(){var i=this;clearInterval(i.autoPlayTimeObj);i.autoPlay=false},$:function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}};SubShowClass.readCookie=function(O){var o="",l=O+"=";if(document.cookie.length>0){var i=document.cookie.indexOf(l);if(i!=-1){i+=l.length;var I=document.cookie.indexOf(";",i);if(I==-1)I=document.cookie.length;o=unescape(document.cookie.substring(i,I))}};return o};SubShowClass.writeCookie=function(i,l,o,c){var O="",I="";if(o!=null){O=new Date((new Date).getTime()+o*3600000);O="; expires="+O.toGMTString()};if(c!=null){I=";domain="+c};document.cookie=i+"="+escape(l)+O+I};SubShowClass.sum=SubShowClass.readCookie("SSCSum");if((/^\d+$/).test(SubShowClass.sum)){SubShowClass.sum++}else{SubShowClass.sum=1};SubShowClass.writeCookie("SSCSum",SubShowClass.sum,12);

/******** Sales dept. begin ********/
function SinaDotAdJs(){
//-------------------------------

var pthis = this;
//浏览器判断
this.isIE=navigator.userAgent.indexOf("MSIE")==-1?false:true;
this.isOPER=navigator.userAgent.indexOf("Opera")==-1?false:true;
this.version=navigator.appVersion.split(";"); 
this.trim_Version=this.version[1].replace(/[ ]/g,""); 
this.isIE6=(navigator.appName=="Microsoft Internet Explorer" && this.trim_Version=="MSIE6.0")?true:false;
this.isXHTML = document.compatMode=="CSS1Compat"?true:false;

//获取body
this.bdy = (document.documentElement && document.documentElement.clientWidth)?document.documentElement:document.body;

//获取对象
this.$ = function(id){if(document.getElementById){return eval('document.getElementById("'+id+'")')}else{return eval('document.all.'+id)}};

//获取cookie
this.getAdCookie = function(N){
	var c=document.cookie.split("; ");
	for(var i=0;i<c.length;i++){var d=c[i].split("=");if(d[0]==N)return unescape(d[1]);}
	return "";
};

//设置cookie
this.setAdCookie = function(N,V,Q,D){
	var L=new Date();
	var z=new Date(L.getTime()+Q*60000);
    var tmpdomain = "";
	if(typeof(D)!="undefined"){if(D){tmpdomain="domain=sina.com.cn;";}}
	document.cookie=N+"="+escape(V)+";path=/;"+tmpdomain+"expires="+z.toGMTString()+";";
};

//日期判断函数
this.compareDate = function(type,d){
  try{
        var dateArr = d.split("-");
        var checkDate = new Date();
        checkDate.setFullYear(dateArr[0], dateArr[1]-1, dateArr[2]);
		var now = new Date();
        var nowTime = now.getTime();
		var checkTime = checkDate.getTime();
		if(type=="after"){          
		  if(nowTime >= checkTime){return true;}
		  else{return false;}
		}		
        else if(type=="before"){
          if(nowTime <= checkTime){return true;}
		  else{return false;}
		}
  }catch(e){return false;}
}

//获取时间对象
this.strToDateFormat = function(str,ext){
	var arys = new Array();
	arys = str.split('-');
	var newDate = new Date(arys[0],arys[1]-1,arys[2],arys[3],0,0);
	if(ext){newDate = new Date(newDate.getTime()+1000*60*60*24);}
	return newDate;
 }

//时间区间检查
this.checkTime = function(begin,end){
  var td = new Date();
  var flag = (td>=pthis.strToDateFormat(begin,false) && td<pthis.strToDateFormat(end,begin==end?true:false))?true:false;
  return flag;
}

//外部事件加载
this.addEvent = function(obj,event,func){
  var MSIE=navigator.userAgent.indexOf("MSIE");
  var OPER=navigator.userAgent.indexOf("Opera");
  if(document.all && MSIE!=-1 && OPER==-1){
    obj.attachEvent("on"+event,func);
  }else{
    obj.addEventListener(event,func,false);
  }
};

//PNG透明函数
this.correctPNG = function(){ 
    var arVersion = navigator.appVersion.split("MSIE");
    var vs = parseFloat(arVersion[1]);
    if ((vs >= 5.5) && (document.body.filters)){ 
       for(var j=0; j<document.images.length; j++){ 
          var img = document.images[j];
          var imgName = img.src.toUpperCase(); 
          if (imgName.substring(imgName.length-3, imgName.length) == "PNG"){ 
             var imgID = (img.id) ? "id='" + img.id + "' " : "";
             var imgClass = (img.className) ? "class='" + img.className + "' " : "";
             var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
             var imgStyle = "display:inline-block;" + img.style.cssText;
             if (img.align == "left"){imgStyle = "float:left;" + imgStyle}
             if (img.align == "right"){imgStyle = "float:right;" + imgStyle}
             if (img.parentElement.href){imgStyle = "cursor:hand;" + imgStyle}
             var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
             img.outerHTML = strNewHTML;
             j = j-1;
          } 
       } 
    }     
};

//容器对象
this.initWrap = function(mod,id,v,w,h,po,l,r,t,b,z,m,p,bg,dsp){
  var lst='';
  if(mod == 0x01){lst += 'pthis.'+v+' = document.createElement("'+id+'");';}
  else if(mod == 0x02){lst += 'pthis.'+v+' = document.getElementById("'+id+'");';}
  else return;
  if(v!="" && mod == 0x01){lst+=v+'.id = "'+v+'";';}
  if(w!=""){lst+=v+'.style.width = '+w+' + "px";';}
  if(h!=""){lst+=v+'.style.height = '+h+' + "px";';}
  if(po!=""){
	  lst+=v+'.style.position = "'+po+'";';

      if(l!=""){lst+=v+'.style.left = '+l+' + "px";';}
      else if(l=="" && r!=""){lst+=v+'.style.right = '+r+' + "px";';}
	  if(t!=""){lst+=v+'.style.top = '+t+' + "px";';}
      else if(t=="" && b!=""){lst+=v+'.style.bottom = '+b+' + "px";';}
	  if(z!=""){lst+=v+'.style.zIndex = "'+z+'";';}
  }
  if(bg!=""){lst+=v+'.style.background = "'+bg+'";';}
  if(m!=""){lst+=v+'.style.margin = "'+m+'";';}
  if(p!=""){lst+=v+'.style.padding = "'+p+'";';}
  if(dsp!=""){lst+=v+'.style.display = "'+dsp+'";';}
  return lst;
};

//素材对象
this.initObj = function(id,s,u,w,h){
  var lst = s.substring(s.length-3).toLowerCase();
  switch(lst){
	 case "tml":
	 case "htm":
	 case "php":var to = document.createElement("iframe");
                     to.id=id;
	                 to.width=w;
	                 to.height=h;
                     to.src=s;
                     to.frameBorder = 0;
					 to.allowTransparency = "true";
                     to.scrolling = "no";
                     to.marginheight = 0;
                     to.marginwidth = 0;
					 break;
	 case "swf": var to = document.createElement("div");
					 var fo = new sinaFlash( s, id, w, h, "7", "", false, "High");
	                 fo.addParam("wmode", "transparent");
	                 fo.addParam("allowScriptAccess", "always");
	                 fo.addParam("menu", "false");
	                 fo.write(to);
				     break;
     case "jpg":
     case "gif":
	 case "png":if(u!=""){
		             var to = document.createElement("a");
					 to.href = u;
					 to.target = "_blank";
					 var io = new Image();
	                 io.id = id;
					 io.style.width = w+"px";
					 io.style.height = h+"px";
					 io.style.border = "none";
					 io.src = s;
					 to.appendChild(io);
				}else{
				     var to = new Image();
	                 to.id = id;
					 to.style.width = w+"px";
					 to.style.height = h+"px";
					 to.style.border = "none";
					 to.style.cursor = "pointer";
					 to.src = s;	 
				}
				     break;
	     default:var to = document.createElement("a");
		             to.id = id;
					 to.href = u;
					 to.target = "_blank";
                     to.innerText = s;
  }
  return to;
};

//-------------------------------
};
/* http://d2.sina.com.cn/d1images/common/SinaDotTop.js begin */
/*
RotatorAD V3.8 2009-10-22
Author: Dakular <shuhu@staff.sina.com.cn>
格式: new RotatorAD(商业广告数组, 非商业广告数组, 层id)
说明: 第一次访问随机出现，以后访问顺序轮播；自动过滤过期广告；cookie时间24小时；商业广告数量不足时，从非商业广告中补充
	  限制最少轮播数量，广告少于限制数时，才从垫底里补充，否则不补垫底
*/
if(typeof(RotatorAD)!='function'){
var RotatorAD = function(rad,nad,div_id){

var date = new Date();
var id = 0;
var max = 99;
var url = document.location.href;
var cookiename = 'SinaRot'+escape(url.substr(url.indexOf('/',7),2)+url.substring(url.lastIndexOf('/')));
var timeout = 1440; //24h
var w = rad.width;
var h = rad.height;
var bnum = rad.num;
var num = rad.num;
var num2 = rad.num2;
var marginType = (typeof(rad.mtype)=="undefined")?0:rad.mtype;
var ary = new Array();
//过滤无效商广
for(var i=0; i<rad.length; i++){
	var start = strToDate(rad[i][2].replace('<startdate>','').replace('</startdate>',''));
	var end = strToDate(rad[i][3].replace('<enddate>','').replace('</enddate>',''),true);
	if(date>start && date<end){
		ary.push([rad[i][0], rad[i][1], rad[i][4], rad[i][5]?rad[i][5]:'0']);
	}
}
//过滤无效垫底
var vnad = new Array();
for(var i=0; i<nad.length; i++){
	if(nad[i][2]==null){
		vnad.push([nad[i][0], nad[i][1], '', '0']);
	}else{
		var start = strToDate(nad[i][2].replace('<startdate>','').replace('</startdate>',''));
		var end = strToDate(nad[i][3].replace('<enddate>','').replace('</enddate>',''),true);
		if(date>start && date<end){
			vnad.push([nad[i][0], nad[i][1], '', '0']);
		}
	}
}
//补位
var nn = 0;
if(vnad.length>0 && (num2==null || ary.length<num2)){
	for(var i=0; i<(num2==null?rad.num:num2); i++){
		if(i>ary.length-1){
			ary.push([vnad[nn][0], vnad[nn][1], '', '0']);
			if(++nn > nad.length-1) nn = 0;
		}
	}
}
//num = ary.length<num?ary.length:num;
//排序(同步有序号的广告)
ary.sort(function(x,y){return x[3]-y[3];});
//取id
if(typeof(globalRotatorId)=='undefined' || globalRotatorId==null || isNaN(globalRotatorId)){
	curId = G(cookiename);

	curId = curId==""?Math.floor(Math.random()*max):++curId;
	if(curId>max || curId==null || isNaN(curId)) curId=0;
	S(cookiename,curId,timeout);
	globalRotatorId = curId;
}
id=globalRotatorId%num;

//Show AD
if(ary.length==0) return; //如果没有广告则不显示
var n = id;

try{
  if(typeof(ary[n][0])=="undefined" || ary[n][0]=="") return;
  var type = ary[n][0].substring(ary[n][0].length-3).toLowerCase();
  var od = document.getElementById(div_id);
  if(od && marginType==1){od.style.marginTop = 8 + "px";}
  if(od && marginType==2){od.style.marginBottom = 8 + "px";}
  if(od && marginType==3){od.style.marginTop = 8 + "px";od.style.marginBottom = 8 + "px";}
}catch(e){return;}

if(type=='swf'){
var of = new sinaFlash(ary[n][0], div_id+'_swf', w, h, "7", "", false, "High");
of.addParam("wmode", "opaque");
of.addParam("allowScriptAccess", "always");
of.addVariable("adlink", escape(ary[n][1]));
if(ary[n][2]!="" && ary[n][2]!=null){of.addVariable("_did", ary[n][2]);}
of.write(div_id);
}else if(type=='jpg' || type=='gif'){
if(ary[n][2]!="" && ary[n][2]!=null){
  od.innerHTML = '<a href="'+ary[n][1]+'" target="_blank" onclick="try{_S_acTrack('+ary[n][2]+');}catch(e){}"><img src="'+ary[n][0]+'" border="0" width="'+w+'" height="'+h+'" /></a>';
}else{
  od.innerHTML = '<a href="'+ary[n][1]+'" target="_blank"><img src="'+ary[n][0]+'" border="0" width="'+w+'" height="'+h+'" /></a>';
}
}else if(type=='htm' || type=='tml'){
od.innerHTML = '<iframe id="ifm_'+div_id+'" frameborder="0" scrolling="no" width="'+w+'" height="'+h+'"></iframe>';
document.getElementById('ifm_'+div_id).src = ary[n][0];
}else if(type=='.js'){ //js
document.write('<script language="javascript" type="text/javascript" src="'+ary[n][0]+'"></scr'+'ipt>');
}else{ //textlink
    if(ary[n][2]!="" && ary[n][2]!=null){
  document.write('<a href="'+ary[n][1]+'" onclick="try{_S_acTrack('+ary[n][2]+');}catch(e){}"  target="_blank">'+ary[n][0]+'</a>');
    }else{
  document.write('<a href="'+ary[n][1]+'"  target="_blank">'+ary[n][0]+'</a>');
}
}

function G(N){
	var c=document.cookie.split("; ");
	for(var i=0;i<c.length;i++){
		var d=c[i].split("=");
		if(d[0]==N)return unescape(d[1]);
	}return '';
};
function S(N,V,Q){
	var L=new Date();
	var z=new Date(L.getTime()+Q*60000);
	document.cookie=N+"="+escape(V)+";path=/;expires="+z.toGMTString()+";";
};
function strToDate(str,ext){
	var arys = new Array();
	arys = str.split('-');
	var newDate = new Date(arys[0],arys[1]-1,arys[2],9,0,0);
	if(ext){
		newDate = new Date(newDate.getTime()+1000*60*60*24);
	}
	return newDate;
}

}
}

(function(){
  var pthis=this;this.compareDate = function (a,b){try{var n = new Date().getHours();if(n >= a && n < b){return true;}else{return false;}}catch(e){return false;}};
  try{window.timer_0915 = this.compareDate(9,15);}catch(e){}
  try{window.timer_1524 = this.compareDate(15,24);}catch(e){}
})();