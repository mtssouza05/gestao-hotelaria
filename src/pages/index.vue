<template>
  <v-container class="pa-4" style="height: 100vh;">
    <!-- Cards superiores -->
    <v-row style="max-height:500px" class="shrink-0 mb-4" justify="center">

      <v-col cols="12" md="4">
        <v-card class="rounded-lg elevation-16 d-flex flex-column h-100">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Check-ins
            <v-spacer />
            <v-icon class="ma-2" color="success">mdi-checkbox-marked-circle-outline</v-icon>
          </v-card-title>
          <v-card-subtitle class="text-subtitle-2">Total de check-ins</v-card-subtitle>
          <v-card-text class="text-h4 font-weight-bold">{{ checkins }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-lg elevation-16 d-flex flex-column h-100">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Check-outs
            <v-spacer />
            <v-icon class="ma-2" color="error">mdi-exit-run</v-icon>
          </v-card-title>
          <v-card-subtitle class="text-subtitle-2">Total de check-outs</v-card-subtitle>
          <v-card-text class="text-h4 font-weight-bold">{{ checkouts }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-lg elevation-16 d-flex flex-column h-100">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Reservas Pendentes
            <v-spacer />
            <v-icon class="ma-2" color="primary">mdi-calendar-clock</v-icon>
          </v-card-title>
          <v-card-subtitle class="text-subtitle-2">Total de reservas pendentes</v-card-subtitle>
          <v-card-text class="text-h4 font-weight-bold">{{ reservasPendentes }}</v-card-text>
          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg elevation-16 h-100">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Check-ins X Check-outs Semanal
            <v-icon class="ml-4" color="info">mdi-chart-line</v-icon>
          </v-card-title>
          <v-card-text class="pa-4">
            <div style="position: relative; width: 100%; height: 400px;">
              <LineChart :chart-data="chartData" :chart-options="chartOptions" :width="400" :height="400" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


  </v-container>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { defineChartComponent } from 'vue-chart-3'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  // 👇 AQUI ESTÁ O QUE FALTAVA
  LineController
} from 'chart.js'

let checkins = ref(12);
let checkouts = ref(10);
let reservasPendentes = ref(3);

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController
)

const LineChart = defineChartComponent('LineChart', 'line')

const chartData = ref({
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
  datasets: [
    {
      label: 'Check-ins',
      data: [5, 7, 3, 9, 6, 4, 8],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      tension: 0.4
    },
    {
      label: 'Check-outs',
      data: [4, 6, 2, 8, 5, 3, 7],
      borderColor: '#f44336',
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
      tension: 0.4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bootom',
      labels: {
        boxWidth: 20,
        padding: 15
      }
    }
  }
})


</script>

<style lang="css" scoped>
body {
  height: 100vh;
}
</style>
