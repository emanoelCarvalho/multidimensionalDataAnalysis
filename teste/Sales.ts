import { IOperation } from "./IOperation";

class Sales implements IOperation  {
  salesForDimension: number[][][];

  constructor(dimensions: number, branchs: number, products: number) {
    this.salesForDimension = [];

    for (let row = 0; row < dimensions; row++) {
      this.salesForDimension[row] = [];
      for (let col = 0; col < branchs; col++) {
        this.salesForDimension[row][col] = [];

        for (let deep = 0; deep < products; deep++) {
          this.salesForDimension[row][col][deep] = 0;
        }
      }
    }
  }
  registerSales(
    month: number,
    branch: number,
    product: number,
    amount: number
  ) {
    this.salesForDimension[month][branch][product] += amount;
  }
  getSales(month: number, branch: number, product: number): number {
    return this.salesForDimension[month][branch][product];
  }
}

export { Sales };
