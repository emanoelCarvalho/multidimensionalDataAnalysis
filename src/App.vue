<template>
  <div id="app">

    <aside class="sidebar">
      <nav>
        <div class="logo">
          <img src="https://th.bing.com/th/id/OIP.c79wLt-XSLf2-nkYfeMWYwHaD3?rs=1&pid=ImgDetMain"
            alt="Logomarca O Boticário" />
        </div>


        <div class="buttons">
          <div>
            <button class="btn-graph-type" @click="toggleOptions('graph')">Alterar Tipo de Gráfico</button>
            <div v-if="showGraphOptions" class="options">
              <button @click="changeGraphType('Bar')">Gráfico de Barra</button>
              <button @click="changeGraphType('Line')">Gráfico de Linha</button>
              <button @click="changeGraphType('Pie')">Gráfico de Pizza</button>
            </div>
          </div>

          <div>
            <button class="btn-product-filter" @click="toggleOptions('product')">Filtrar Vendas por Produto</button>
            <div v-if="showProductOptions" class="options">
              <select v-model="selectedProductIndex">
                <option disabled value="">Selecione um produto</option>
                <option v-for="(product, index) in products.values" :key="index" :value="index">
                  {{ product }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <button class="btn-branch-filter" @click="toggleOptions('branch')">Filtrar Vendas por Filial</button>
            <div v-if="showBranchOptions" class="options">
              <select v-model="selectedBranchIndex">
                <option disabled value="">Selecione uma filial</option>
                <option v-for="(branch, index) in branches.values" :key="index" :value="index">
                  {{ branch }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </aside>


    <main class="content">
      <h1>Análise de Vendas para Perfumarias</h1>
      <div class="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
    </main>
  </div>
</template>

<script>
import { Dimension } from "./model/Dimension.ts";
import { Sales } from "./model/Sales.ts";
import Chart from "chart.js/auto";

export default {
  data() {
    return {

      showGraphOptions: false,
      showProductOptions: false,
      showBranchOptions: false,
      selectedProductIndex: 0,
      selectedBranchIndex: 0,


      months: new Dimension("Meses", 12),
      branches: new Dimension("Filiais", 3),
      products: new Dimension("Produtos", 5),
      salesData: new Sales(12, 3, 5),


      chartType: "line",
      chart: null,
    };
  },
  created() {

    this.months.values = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    this.branches.values = ["Todas as Filiais", "Filial SP", "Filial RJ", "Filial PR"];
    this.products.values = ["Todos os Produtos", "D.C Floratta Cerejeira", "Perfume Paradise Floral", "D.C Boticollection Horizonte", "D.C Floratta Red", "D.C Malbec"];


    for (let month = 0; month < 12; month++) {
      for (let branch = 0; branch < 3; branch++) {
        for (let product = 0; product < 5; product++) {
          this.salesData.registerSales(month, branch, product, Math.floor(Math.random() * 1000));
        }
      }
    }
  },
  methods: {
    toggleOptions(type) {
      this[`show${type.charAt(0).toUpperCase() + type.slice(1)}Options`] = !this[
        `show${type.charAt(0).toUpperCase() + type.slice(1)}Options`
      ];
    },
    changeGraphType(type) {
      this.chartType = type.toLowerCase();
      this.updateChart();
    },
    updateChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");
      const data = this.getSalesDataForChart();

      if (this.chart) {
        this.chart.destroy();
      }


      const colors = [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(201, 203, 207, 0.6)",
        "rgba(123, 239, 178, 0.6)",
        "rgba(255, 105, 180, 0.6)",
        "rgba(0, 128, 255, 0.6)",
        "rgba(255, 255, 0, 0.6)",
        "rgba(128, 0, 128, 0.6)",
      ];

      const borderColors = colors.map((color) => color.replace("0.6", "1"));

      this.chart = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.months.values,
          datasets: [
            {
              label: this.getChartLabel(),
              data,
              backgroundColor: this.chartType === "pie" ? colors : colors[0],
              borderColor: this.chartType === "pie" ? borderColors : borderColors[0],
              borderWidth: 1,
              fill: this.chartType !== "pie",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: this.chartType === "pie",
              position: "top",
            },
          },
        },
      });
    },
    getChartLabel() {
      const branch = this.selectedBranchIndex === 0 ? "Todas as Filiais" : this.branches.values[this.selectedBranchIndex];
      const product = this.selectedProductIndex === 0 ? "Todos os Produtos" : this.products.values[this.selectedProductIndex];
      return `Vendas - ${branch}, ${product}`;
    },
    getSalesDataForChart() {
      const salesByMonth = new Array(this.months.values.length).fill(0);

      for (let month = 0; month < this.months.values.length; month++) {
        for (let branch = 0; branch < this.branches.values.length - 1; branch++) {
          if (this.selectedBranchIndex !== 0 && branch + 1 !== this.selectedBranchIndex) continue;

          for (let product = 0; product < this.products.values.length - 1; product++) {
            if (this.selectedProductIndex !== 0 && product + 1 !== this.selectedProductIndex) continue;

            salesByMonth[month] += this.salesData.getSales(month, branch, product);
          }
        }
      }

      return salesByMonth;
    },
  },
  watch: {
    selectedProductIndex: "updateChart",
    selectedBranchIndex: "updateChart",
  },
  mounted() {
    this.updateChart();
  },
};
</script>

<style scoped>
#app {
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(111, 149, 126, 1) 35%);
  width: 100%;
  height: 100vh;
  position: fixed;
}

.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #333;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.logo img {
  width: 100%;
}

.buttons {
  margin-top: 20px;
}

button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-graph-type {
  background-color: #4CAF50;
  color: white;
}

.btn-graph-type:hover {
  background-color: #45a049;
}

.btn-product-filter {
  background-color: #ff9800;
  color: white;
}

.btn-product-filter:hover {
  background-color: #e68a00;
}

.btn-branch-filter {
  background-color: #f44336;
  color: white;
}

.btn-branch-filter:hover {
  background-color: #da190b;
}

.options {
  margin-top: 10px;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
}

.options button, .options input, .options select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
}

.content {
  margin-left: 270px; 
  padding: 20px;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  height: 100vh; 
  box-sizing: border-box; 
}

h1 {
  font-size: 36px; 
  color: #333;
  margin-bottom: 30px; 
  text-align: center; 
}

.chart-container {
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 90%; 
  max-width: 800px; 
  height: 500px; 
  margin: 0 auto; 
}


</style>
