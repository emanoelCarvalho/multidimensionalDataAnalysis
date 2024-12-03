<template>
  <div id="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav>
        <div class="logo">
          <img src="https://th.bing.com/th/id/OIP.c79wLt-XSLf2-nkYfeMWYwHaD3?rs=1&pid=ImgDetMain" alt="Logomarca O Boticário" />
        </div>

        <!-- Botões com Opções abaixo -->
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
            <button class="btn-month-filter" @click="toggleOptions('month')">Filtrar Vendas por Mês</button>
            <div v-if="showMonthOptions" class="options">
              <!-- Dropdown de meses -->
              <select v-model="selectedMonth">
                <option disabled value="">Selecione um mês</option>
                <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
              </select>
            </div>
          </div>

          <div>
            <button class="btn-branch-filter" @click="toggleOptions('branch')">Filtrar Vendas por Filial</button>
            <div v-if="showBranchOptions" class="options">
              <select v-model="selectedBranch">
                <option value="Filial 1">Filial 1</option>
                <option value="Filial 2">Filial 2</option>
                <option value="Filial 3">Filial 3</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <h1>Análise de Vendas Supermercado</h1>
      <div class="chart-container">
        <canvas id="salesChart"></canvas> <!-- Canvas para o gráfico -->
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      showGraphOptions: false,
      showMonthOptions: false,
      showBranchOptions: false,
      selectedMonth: '',
      selectedBranch: 'Filial 1',
      months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      salesData: {
        "Filial 1": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
        "Filial 2": [50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150],
        "Filial 3": [80, 180, 280, 380, 480, 580, 680, 780, 880, 980, 1080, 1180]
      },
      chartType: 'line', // Tipo de gráfico inicial
      chart: null,
    };
  },
  methods: {
    // Alterna a exibição das opções baseadas no botão clicado
    toggleOptions(type) {
      if (type === 'graph') {
        this.showGraphOptions = !this.showGraphOptions;
      } else if (type === 'month') {
        this.showMonthOptions = !this.showMonthOptions;
      } else if (type === 'branch') {
        this.showBranchOptions = !this.showBranchOptions;
      }
    },
    // Método para alterar o tipo de gráfico
    changeGraphType(type) {
      this.chartType = type;
      this.updateChart();
    },
    // Atualiza o gráfico com base nas seleções
    updateChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");
      const data = this.getSalesDataForChart();

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: this.chartType.toLowerCase(),
        data: {
          labels: this.months,
          datasets: [{
            label: `Vendas - ${this.selectedBranch}`,
            data: data,
            borderColor: "rgba(54, 162, 235, 1)",  // Cor de borda mais visível
            backgroundColor: "rgba(54, 162, 235, 0.2)",  // Cor de fundo suave
            fill: true,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Vendas por Mês",
              font: {
                size: 18,
                weight: 'bold',
                family: 'Arial, sans-serif'
              },
              color: '#333'  // Cor do título
            },
            legend: {
              labels: {
                font: {
                  size: 14,
                  weight: 'bold'
                },
                color: '#333'  // Cor das legendas
              }
            }
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
                color: '#333'  // Cor das labels do eixo X
              }
            },
            y: {
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
                color: '#333'  // Cor das labels do eixo Y
              }
            }
          }
        },
      });
    },
    // Obtém os dados de vendas para o gráfico, com base nos filtros
    getSalesDataForChart() {
      const sales = this.salesData[this.selectedBranch];
      const filteredData = sales.slice();

      if (this.selectedMonth) {
        const monthIndex = this.months.indexOf(this.selectedMonth);
        return [filteredData[monthIndex]]; // Filtra apenas o mês selecionado
      }

      return filteredData; // Retorna todos os dados se nenhum mês for selecionado
    },
  },
  watch: {
    selectedBranch: "updateChart",
    selectedMonth: "updateChart",
  },
  mounted() {
    this.updateChart();
  }
};
</script>

<style scoped>
/* Estilo igual ao código fornecido acima */
#app {
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(111, 149, 126, 1) 35%);
  width: 100%;
  height: 100vh;
  position: fixed;
}

/* Sidebar styles */
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

/* Button styles */
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

/* Estilos para os botões */
.btn-graph-type {
  background-color: #4CAF50;
  color: white;
}

.btn-graph-type:hover {
  background-color: #45a049;
}

.btn-month-filter {
  background-color: #2196F3;
  color: white;
}

.btn-month-filter:hover {
  background-color: #0b7dda;
}

.btn-branch-filter {
  background-color: #f44336;
  color: white;
}

.btn-branch-filter:hover {
  background-color: #da190b;
}

/* Estilos para as opções abaixo dos botões */
.options {
  margin-top: 10px;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
}

.options button,
.options input,
.options select {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
}

/* Main content */
.content {
  margin-left: 270px;
  padding: 20px;
}

h1 {
  font-size: 32px;
  color: #333;
}

/* Gráfico responsivo */
.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>
