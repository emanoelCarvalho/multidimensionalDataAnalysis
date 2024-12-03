import { Dimension } from "./Dimension";
import { Sales } from "./Sales";

const months = new Dimension("Months", 3);
const branchs = new Dimension("Branchs", 3);
const products = new Dimension("Products", 3); 

const sales = setValues();

function setValues() {
    months.setValue(0, "Jan");
    months.setValue(1, "Feb");
    months.setValue(2, "Mar");

    branchs.setValue(0, "Branch 1");
    branchs.setValue(1, "Branch 2");
    branchs.setValue(2, "Branch 3");

    products.setValue(0, "Malbec");
    products.setValue(1, "Egeo");
    products.setValue(2, "Zaad");

    const sales = new Sales(3, 3, 3);

    sales.registerSales(0, 0, 0, 10);
    sales.registerSales(0, 1, 2, 5);
    sales.registerSales(2, 2, 1, 20);
    return sales;
}

function showSales() {
    for (let month = 0; month < months.values.length; month++) {
        console.log(`Month: ${months.getValue(month)}`);
        for (let branch = 0; branch < branchs.values.length; branch++) {
            console.log(`   Branch: ${branchs.getValue(branch)}`); 
            for (let product = 0; product < products.values.length; product++) {
                const salesResgisters = sales.getSales(month, branch, product); 
                console.log(`   Product: ${products.getValue(product)} - Sales: ${salesResgisters}`)
            }
        }
    }
}

showSales();