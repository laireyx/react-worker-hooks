var l = Object.defineProperty;
var w = (t, r, e) => r in t ? l(t, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[r] = e;
var n = (t, r, e) => (w(t, typeof r != "symbol" ? r + "" : r, e), e);
function h(t, r = { type: "module" }) {
  const e = new k(t, r);
  return function() {
    return e;
  };
}
class k {
  constructor(r, e = { type: "module" }) {
    n(this, "worker");
    n(this, "eventSeq", 0);
    n(this, "pendingTasks", /* @__PURE__ */ new Map());
    n(this, "task", (r, ...e) => {
      const s = this.eventSeq++, o = {
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
      this.pendingTasks.set(s, o);
      const i = {
        eventType: r,
        eventSeq: s,
        args: e
      };
      return this.worker.postMessage(i), a;
    });
    n(this, "handleResponse", (r) => {
      const { data: e } = r, s = this.pendingTasks.get(e.eventSeq);
      if (!s)
        throw new Error(
          `Invalid worker response: pending task with seq #${e.eventSeq} not found`
        );
      e.result.success ? s.resolve(e.result.response) : s.reject(e.result.reason);
    });
    this.worker = new Worker(r, e), this.worker.addEventListener(
      "message",
      (s) => this.handleResponse(s)
    );
  }
}
export {
  k as BrowserBridge,
  h as startWorker
};
