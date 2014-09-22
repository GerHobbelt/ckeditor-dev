﻿/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("image3",function(i){function y(){var a=this.getValue().match(z);(a=!!(a&&0!==parseInt(a[1],10)))||alert(j["invalid"+CKEDITOR.tools.capitalize(this.id)]);return a}function J(){function a(a,b){e.push(h.once(a,function(a){for(var h;h=e.pop();)h.removeListener();b(a)}))}var h=p.createElement("img"),e=[];return function(e,b,d){a("load",function(){var a=A(h);b.call(d,h,a.width,a.height)});a("error",function(){b(null)});a("abort",function(){b(null)});h.setAttribute("src",e+"?"+Math.random().toString(16).substring(2))}}
function B(){var a=this.getValue();q(!1);a!==t.data.src?(C(a,function(a,e,b){q(!0);if(!a)return k(!1);f.setValue(e);g.setValue(b);r=e;s=b;k(D.checkHasNaturalRatio(a))}),l=!0):l?(q(!0),f.setValue(m),g.setValue(n),l=!1):q(!0)}function E(){if(d){var a=this.getValue();if(a&&(a.match(z)||k(!1),"0"!==a)){var b="width"==this.id,e=m||r,c=n||s,a=b?Math.round(c*(a/e)):Math.round(e*(a/c));isNaN(a)||(b?g:f).setValue(a)}}}function k(a){if(c){if("boolean"==typeof a){if(u)return;d=a}else if(a=f.getValue(),u=!0,
(d=!d)&&a)a*=n/m,isNaN(a)||g.setValue(Math.round(a));c[d?"removeClass":"addClass"]("cke_btn_unlocked");c.setAttribute("aria-checked",d);CKEDITOR.env.hc&&c.getChild(0).setHtml(d?CKEDITOR.env.ie?"■":"▣":CKEDITOR.env.ie?"□":"▢")}}function q(a){a=a?"enable":"disable";f[a]();g[a]()}var z=/(^\s*(\d+)(px)?\s*$)|^$/i,F=CKEDITOR.tools.getNextId(),G=CKEDITOR.tools.getNextId(),b=i.lang.image3,j=i.lang.common,K=(new CKEDITOR.template('<div><a href="javascript:void(0)" tabindex="-1" title="'+b.lockRatio+'" class="cke_btn_locked" id="{lockButtonId}" role="checkbox"><span class="cke_icon"></span><span class="cke_label">'+
b.lockRatio+'</span></a><a href="javascript:void(0)" tabindex="-1" title="'+b.resetSize+'" class="cke_btn_reset" id="{resetButtonId}" role="button"><span class="cke_label">'+b.resetSize+"</span></a></div>")).output({lockButtonId:F,resetButtonId:G}),D=CKEDITOR.plugins.image3,v=i.widgets.registered.image.features,A=D.getNatural,p,t,H,C,m,n,r,s,l,d,u,c,o,f,g,w,x=!(!i.config.filebrowserImageBrowseUrl&&!i.config.filebrowserBrowseUrl),I=[{id:"src",type:"text",label:j.url,onKeyup:B,onChange:B,setup:function(a){this.setValue(a.data.src)},
commit:function(a){a.setData("src",this.getValue())},validate:CKEDITOR.dialog.validate.notEmpty(b.urlMissing)}];x&&I.push({type:"button",id:"browse",style:"display:inline-block;margin-top:16px;",align:"center",label:i.lang.common.browseServer,hidden:!0,filebrowser:"info:src"});return{title:b.title,minWidth:250,minHeight:100,onLoad:function(){p=this._.element.getDocument();C=J()},onShow:function(){t=this.widget;H=t.parts.image;l=u=d=!1;w=A(H);r=m=w.width;s=n=w.height},contents:[{id:"info",label:b.infoTab,
elements:[{type:"vbox",padding:0,children:[{type:"hbox",widths:["100%"],children:I}]},{id:"alt",type:"text",label:b.alt,setup:function(a){this.setValue(a.data.alt)},commit:function(a){a.setData("alt",this.getValue())}},{type:"hbox",widths:["25%","25%","50%"],requiredContent:v.dimension.requiredContent,children:[{type:"text",width:"45px",id:"width",label:j.width,validate:y,onKeyUp:E,onLoad:function(){f=this},setup:function(a){this.setValue(a.data.width)},commit:function(a){a.setData("width",this.getValue())}},
{type:"text",id:"height",width:"45px",label:j.height,validate:y,onKeyUp:E,onLoad:function(){g=this},setup:function(a){this.setValue(a.data.height)},commit:function(a){a.setData("height",this.getValue())}},{id:"lock",type:"html",style:"margin-top:18px;width:40px;height:20px;",onLoad:function(){function a(a){a.on("mouseover",function(){this.addClass("cke_btn_over")},a);a.on("mouseout",function(){this.removeClass("cke_btn_over")},a)}var b=this.getDialog();c=p.getById(F);o=p.getById(G);c&&(b.addFocusable(c,
4+x),c.on("click",function(a){k();a.data&&a.data.preventDefault()},this.getDialog()),a(c));o&&(b.addFocusable(o,5+x),o.on("click",function(a){if(l){f.setValue(r);g.setValue(s)}else{f.setValue(m);g.setValue(n)}a.data&&a.data.preventDefault()},this),a(o))},setup:function(a){k(a.data.lock)},commit:function(a){a.setData("lock",d)},html:K}]},{type:"hbox",id:"alignment",requiredContent:v.align.requiredContent,children:[{id:"align",type:"radio",items:[["None","none"],["Left","left"],["Center","center"],
["Right","right"]],label:j.align,setup:function(a){this.setValue(a.data.align)},commit:function(a){a.setData("align",this.getValue())}}]},{id:"hasCaption",type:"checkbox",label:b.captioned,requiredContent:v.caption.requiredContent,setup:function(a){this.setValue(a.data.hasCaption)},commit:function(a){a.setData("hasCaption",this.getValue())}}]},{id:"Upload",hidden:!0,filebrowser:"uploadButton",label:b.uploadTab,elements:[{type:"file",id:"upload",label:b.btnUpload,style:"height:40px"},{type:"fileButton",
id:"uploadButton",filebrowser:"info:src",label:b.btnUpload,"for":["Upload","upload"]}]}]}});