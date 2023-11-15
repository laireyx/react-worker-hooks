var w = Object.defineProperty;
var d = (n, e, t) => e in n ? w(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var s = (n, e, t) => (d(n, typeof e != "symbol" ? e + "" : e, t), t);
class l {
  constructor(e, t = { type: "module" }) {
    s(this, "worker");
    s(this, "terminated", !1);
    s(this, "eventSeq", 0);
    s(this, "pendingTasks", /* @__PURE__ */ new Map());
    s(this, "taskWithTransferable", (e, t, ...r) => new Promise((o, i) => {
      if (this.terminated)
        return i(
          new Error(
            "Cannot start a new task: this worker is already terminated"
          )
        );
      const h = this.eventSeq++;
      this.pendingTasks.set(h, {
        resolve: o,
        reject: i
      });
      const k = {
        eventType: e,
        eventSeq: h,
        args: r
      };
      this.worker.postMessage(k, t);
    }));
    s(this, "task", (e, ...t) => this.taskWithTransferable(e, [], ...t));
    s(this, "handleResponse", (e) => {
      const { data: t } = e, r = this.pendingTasks.get(t.eventSeq);
      if (!r)
        throw new Error(
          `Invalid worker response: pending task with seq #${t.eventSeq} not found`
        );
      t.result.success ? r.resolve(t.result.response) : r.reject(t.result.reason);
    });
    this.worker = new Worker(e, t), this.worker.addEventListener(
      "message",
      (r) => this.handleResponse(r)
    );
  }
  terminate() {
    if (this.terminated)
      throw new Error(
        "Cannot terminate this worker: this worker is already terminated"
      );
    this.worker.terminate(), this.terminated = !0;
  }
}
class a {
  constructor(e, t = null) {
    s(this, "lastWorkerIndex", 0);
    s(this, "_terminated", !1);
    s(this, "assign", (e) => {
      if (this.assertOnline(
        "Cannot assign a new task: this pool is already terminated"
      ), e > this.workers.length)
        throw new RangeError(
          `Cannot select ${e} workers: This pool has only ${this.workers.length} workers.`
        );
      const t = new a(
        this.workers.concat(this.workers).slice(this.lastWorkerIndex, this.lastWorkerIndex + e),
        this
      );
      return this.lastWorkerIndex = (this.lastWorkerIndex + e) % this.workers.length, t;
    });
    s(this, "task", (e, ...t) => this.assertOnline(
      "Cannot start a new task: this pool is already terminated"
    ).workers.map((r) => r.task(e, ...t)));
    s(this, "terminate", () => {
      if (this.parent)
        throw new Error(
          "Cannot terminate this pool: only the root-level pool can be terminated"
        );
      this.assertOnline(
        "Cannot terminate this pool: this pool is already terminated"
      ), this.workers.forEach((e) => e.terminate()), this.workers = [], this._terminated = !0;
    });
    this.workers = e, this.parent = t;
  }
  get terminated() {
    var e;
    return ((e = this.parent) == null ? void 0 : e.terminated) ?? this._terminated;
  }
  assertOnline(e) {
    if (this.terminated)
      throw new Error(e);
    return this;
  }
  get size() {
    return this.workers.length;
  }
}
function p(n, e = { type: "module" }) {
  const t = new l(n, e);
  return function() {
    return t;
  };
}
function u(n, e, t = { type: "module" }) {
  const r = [];
  for (let i = 0; i < n; i++)
    r.push(new l(e, t));
  const o = new a(r);
  return function() {
    return o;
  };
}
export {
  p as startWorker,
  u as startWorkerPool
};
