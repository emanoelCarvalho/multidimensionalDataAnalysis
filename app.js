const { createApp } = Vue;

createApp({
  data() {
    return {
      products: ["Arroz", "Feijão", "Macarrão"],
      stores: ["Loja A", "Loja B", "Loja C"],
      sales: [
        [10, 200, 150],
        [80, 120, 130], 
        [90, 150, 170],
      ],
      selectedStore: -1,
      chartInstance: null,
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    calculateSales() {
      const totals = [];
      for (let i = 0; i < this.products.length; i++) {
        let total = 0;

        if (this.selectedStore === -1) {
          // Todas as lojas
          for (let j = 0; j < this.stores.length; j++) {
            total += this.sales[j][i];
          }
        } else {
          // Loja específica
          total = this.sales[this.selectedStore][i];
        }

        totals[i] = total;
      }
      return totals;
    },
    renderChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.products,
          datasets: [
            {
              label: "Vendas Totais",
              data: this.calculateSales(),
              backgroundColor: ["rgba(75, 192, 192, 0.2)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    updateChart() {
      // Atualizar o dataset com as novas vendas filtradas
      const newSales = this.calculateSales();
      this.chartInstance.data.datasets[0].data = newSales;
      this.chartInstance.update(); // Atualizar o gráfico
    },
  },
}).mount("#app");
