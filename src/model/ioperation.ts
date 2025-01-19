interface IOperation {
  registerSales(
    month: number,
    branch: number,
    product: number,
    amount: number
  ): void;
  getSales(month: number, branch: number, product: number): number;
}

export { IOperation };
