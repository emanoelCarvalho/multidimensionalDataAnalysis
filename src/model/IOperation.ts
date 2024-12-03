interface IOperation {
    registerSales(month: number, branch: number, product: number, amount: number); 

    getSales(month: number, branch: number, product: number): number;
}

export {IOperation}