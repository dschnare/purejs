var pure=(function(){var d,m,a,c,n,b,h,o,l,e,j,g,k,f,i;j=({}).constructor;g=([]).constructor;k=("").constructor;f=(true).constructor;i=(4).constructor;return{isString:a=function(p){return typeof p==="string"||p instanceof k;},isBoolean:c=function(p){return typeof p==="boolean"||p instanceof f;},isNumber:n=function(p){return typeof p==="number"||p instanceof i;},isFunction:b=function(p){return typeof p==="function";},isArray:h=function(p){return p instanceof g||({}).toString.call(p)==="[object Array]"||(l(p)&&n(p.length)&&b(p.push));},isObject:o=function(p){return p&&typeof p==="object"&&!h(p);},isDefined:l=function(p){return p!==null&&p!==undefined;},isUndefined:e=function(p){return p===undefined||p===null;},typeOf:function(p){if(p===null){return"null";}if(h(p)){return"array";}return typeof p;},mixin:m=function(){var s,q=arguments.length,r,p,t=arguments[0];if(q===0){return{};}if(t===null||t===undefined){t={};}for(s=1;s<q;s++){p=arguments[s];if(p===null||p===undefined){continue;}for(r in p){if(p.hasOwnProperty(r)){t[r]=p[r];}}}return t;},override:function(){var u,s,q=arguments.length,r,p,t=arguments[0];if(q===0){return{};}if(t===null||t===undefined){t={};}for(s=1;s<q;s++){p=arguments[s];if(p===null||p===undefined){continue;}for(r in p){u=p[r];if(!p.hasOwnProperty(r)){continue;}if(b(u)&&b(t[r])){t[r]=(function(v,w){return function(){var x=undefined;if(arguments.length){x=v.apply(this,arguments);w.apply(this,arguments);}else{x=v.call(this);w.call(this);}return x;};}(u,t[r]));}else{t[r]=u;}}}return t;},adheresTo:function(t,p){var r,s,q;if((o(t)||b(t)||h(t))&&(o(p)||b(p)||h(p))){for(r in p){if(p[r]==="*"){if(r in t){continue;}return false;}if(typeof t[r]!==typeof p[r]&&typeof t[r]!==(p[r]+"")){return false;}}return true;}s=t===null?"null":typeof t;q=p===null?"null":typeof p;return s===q;},constructor:{create:(function(){var q,p;q="var F = function() {};\nF.prototype = o;\nreturn new F();\n";p=j.create||function(s){var r=function(){};r.prototype=s;return new r();};return function(y,s,v){var u,x,w,r;if(arguments.length===0){s={};y={};}else{if(arguments.length===1){if(typeof y==="string"){v=y;s={};y={};}else{s=y;y={};}}else{if(arguments.length===2){if(a(arguments[1])){v=s;s=y;y={};}}else{if(arguments.length===3){v+="";}}}}v=a(v)&&v.length?v:"UnnamedConstructor";if(b(y)){y=y.prototype;}try{u=p(y);}catch(t){if(b(y.constructor)&&o(y.constructor.prototype)){u=p(y.constructor.prototype);}else{u=m({},y);}}r=(function(){var z=q.replace(/F\b/g,v);return new Function("o",z);}());x=function(){var z=r(u);z.constructor=x;if(w){if(arguments.length){z.init.apply(z,arguments);}else{z.init();}}return z;};x.toString=function(){return"function "+v+" () { [native code] }";};x.getName=function(){return v;};m(u,s);w=b(u.init);x.prototype=u;return x;};}())}};}());