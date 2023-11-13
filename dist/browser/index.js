"use strict";var w=Object.defineProperty;var k=(t,r,e)=>r in t?w(t,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[r]=e;var n=(t,r,e)=>(k(t,typeof r!="symbol"?r+"":r,e),e);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function u(t,r={type:"module"}){const e=new a(t,r);return function(){return e}}class a{constructor(r,e={type:"module"}){n(this,"worker");n(this,"eventSeq",0);n(this,"pendingTasks",new Map);n(this,"task",(r,...e)=>{const s=this.eventSeq++,o={resolve:()=>{throw new Error("Placeholder not replaced")},reject:()=>{throw new Error("Placeholder not replaced")}},i=new Promise((d,l)=>{Object.assign(o,{resolve:d,reject:l})});this.pendingTasks.set(s,o);const c={eventType:r,eventSeq:s,args:e};return this.worker.postMessage(c),i});n(this,"handleResponse",r=>{const{data:e}=r,s=this.pendingTasks.get(e.eventSeq);if(!s)throw new Error(`Invalid worker response: pending task with seq #${e.eventSeq} not found`);e.result.success?s.resolve(e.result.response):s.reject(e.result.reason)});this.worker=new Worker(r,e),this.worker.addEventListener("message",s=>this.handleResponse(s))}}exports.BrowserBridge=a;exports.startWorker=u;
