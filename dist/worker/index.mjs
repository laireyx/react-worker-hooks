var d = Object.defineProperty;
var f = (t, s, e) => s in t ? d(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var n = (t, s, e) => (f(t, typeof s != "symbol" ? s + "" : s, e), e);
class u {
  constructor(s, e) {
    this.response = s, this.transfer = e;
  }
}
class g {
  constructor() {
    n(this, "handlers", /* @__PURE__ */ new Map());
    n(this, "handleRequest", async (s) => {
      const { eventType: e, eventSeq: c, args: h } = s.data;
      try {
        const a = this.handlers.get(e);
        if (!a)
          return;
        const r = await a(...h);
        let l, o;
        r instanceof u ? { response: l, transfer: o } = r : (l = r, o = []);
        const i = {
          eventType: e,
          eventSeq: c,
          result: {
            success: !0,
            response: l
          }
        };
        self.postMessage(i, { transfer: o });
      } catch (a) {
        const r = {
          eventType: e,
          eventSeq: c,
          result: {
            success: !1,
            reason: a
          }
        };
        self.postMessage(r);
      }
    });
    n(this, "on", (s, e) => {
      this.handlers.set(s, e);
    });
    n(this, "onTransfer", (s, e) => {
      this.handlers.set(s, e);
    });
    self.addEventListener(
      "message",
      (s) => void this.handleRequest(s)
    );
  }
}
export {
  g as WorkerBridge,
  u as WrapTransferable
};
