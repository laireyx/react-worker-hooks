var l = Object.defineProperty;
var d = (t, e, s) => e in t ? l(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var a = (t, e, s) => (d(t, typeof e != "symbol" ? e + "" : e, s), s);
class u {
  constructor() {
    a(this, "handlers", /* @__PURE__ */ new Map());
    a(this, "handleRequest", async (e) => {
      const { eventType: s, eventSeq: c, args: o } = e.data;
      try {
        const n = this.handlers.get(s);
        if (!n)
          return;
        const r = {
          eventType: s,
          eventSeq: c,
          result: {
            success: !0,
            // eslint-disable-next-line @typescript-eslint/await-thenable
            response: await n(...o)
          }
        };
        self.postMessage(r);
      } catch (n) {
        const r = {
          eventType: s,
          eventSeq: c,
          result: {
            success: !1,
            reason: n
          }
        };
        self.postMessage(r);
      }
    });
    a(this, "on", (e, s) => {
      this.handlers.set(e, s);
    });
    self.addEventListener(
      "message",
      (e) => void this.handleRequest(e)
    );
  }
}
export {
  u as WorkerBridge
};
