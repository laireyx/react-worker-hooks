var k = Object.defineProperty;
var h = (r, s, e) => s in r ? k(r, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[s] = e;
var n = (r, s, e) => (h(r, typeof s != "symbol" ? s + "" : s, e), e);
function u(r, s = { type: "module" }) {
  const e = new w(r, s);
  return function() {
    return e;
  };
}
class w {
  constructor(s, e = { type: "module" }) {
    n(this, "worker");
    n(this, "eventSeq", 0);
    n(this, "pendingTasks", /* @__PURE__ */ new Map());
    n(this, "taskWithTransferable", (s, e, ...t) => {
      const o = this.eventSeq++, a = {
        resolve: () => {
          throw new Error("Placeholder not replaced");
        },
        reject: () => {
          throw new Error("Placeholder not replaced");
        }
      }, i = new Promise(
        (d, l) => {
          Object.assign(a, { resolve: d, reject: l });
        }
      );
      this.pendingTasks.set(o, a);
      const c = {
        eventType: s,
        eventSeq: o,
        args: t
      };
      return this.worker.postMessage(c, e), i;
    });
    n(this, "task", (s, ...e) => this.taskWithTransferable(s, [], ...e));
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
  w as BrowserBridge,
  u as startWorker
};
