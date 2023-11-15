export class WrapTransferable<T> {
  constructor(
    public response: T,
    public transfer: Transferable[],
  ) {}
}
