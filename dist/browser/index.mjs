var l = Object.defineProperty;
var w = (r, s, e) => s in r ? l(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var n = (r, s, e) => (w(r, typeof s != "symbol" ? s + "" : s, e), e);
import { useState as p } from "react";
function g(r, s = { type: "module" }) {
  const [e] = p(
    new k(r, s)
  );
  return e;
}
class k {
  constructor(s, e = { type: "module" }) {
    n(this, "worker");
    n(this, "eventSeq", 0);
    n(this, "pendingTasks", /* @__PURE__ */ new Map());
    n(this, "task", (s, ...e) => {
      const t = this.eventSeq++, o = {
        resolve: () => {
          throw new Error("Placeholder not replaced");
        },
        reject: () => {
          throw new Error("Placeholder not replaced");
        }
      }, a = new Promise(
        (c, d) => {
          Object.assign(o, { resolve: c, reject: d });
        }
      );
      this.pendingTasks.set(t, o);
      const i = {
        eventType: s,
        eventSeq: t,
        args: e
      };
      return this.worker.postMessage(i), a;
    });
    n(this, "handleResponse", (s) => {
      const { data: e } = s, t = this.pendingTasks.get(e.eventSeq);
      if (!t)
        throw new Error(
          `Invalid worker response: pending task with seq #${e.eventSeq} not found`
        );
      e.result.success ? t.resolve(e.result.response) : t.reject(e.result.reason);
    });
    this.worker = new Worker(s, e), this.worker.addEventListener(
      "message",
      (t) => this.handleResponse(t)
    );
  }
}
export {
  k as BrowserBridge,
  g as useWorker
};
