//model interface operações
interface IOperation {
    registerSales(month: number, branch: number, product: number, amount: number): void; // Método não retorna nada
    getSales(month: number, branch: number, product: number): number; // Método retorna um número
  }
  
export {IOperation}