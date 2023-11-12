var l = Object.defineProperty;
var d = (t, e, s) => e in t ? l(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var a = (t, e, s) => (d(t, typeof e != "symbol" ? e + "" : e, s), s);
class i {
  constructor() {
    a(this, "handlers", /* @__PURE__ */ new Map());
    a(this, "handleRequest", async (e) => {
      const { eventType: s, eventSeq: o, args: c } = e.data;
      try {
        const n = this.handlers.get(s);
        if (!n)
          throw new TypeError(
            `Invalid event type: ${String(s)} does not have any handler`
          );
        const r = {
          eventType: s,
          eventSeq: o,
          result: {
            success: !0,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            response: await n(...c)
          }
        };
        self.postMessage(r);
      } catch (n) {
        const r = {
          eventType: s,
          eventSeq: o,
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
  i as WorkerBridge
};
