<template>
  <v-container class="pa-4">
    <v-row class="ml-10" justify="center">

      <v-col col="12" md="4">
        <v-card class="rounded-lg elevation-2 d-flex flex-column" width="400">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Check-ins
            <v-spacer></v-spacer>
            <v-icon class="ma-2" color="success">mdi-checkbox-marked-circle-outline</v-icon>
          </v-card-title>

          <v-card-subtitle class="text-subtitle-2">
            Total de check-ins
          </v-card-subtitle>

          <v-card-text class="text-h4 font-weight-bold">
            {{ checkins }}
          </v-card-text>


          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col col="12" md="4">
        <v-card class="rounded-lg elevation-2 d-flex flex-column" width="400" append-icon="">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Check-outs
            <v-spacer></v-spacer>
            <v-icon class="ma-2" color="error">mdi-exit-run</v-icon>
          </v-card-title>

          <v-card-subtitle class="text-subtitle-2">
            Total de check-outs
          </v-card-subtitle>

          <v-card-text class="text-h4 font-weight-bold">
            {{ checkins }}
          </v-card-text>


          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col col="12" md="4">
        <v-card class="rounded-lg elevation-2 d-flex flex-column" width="400" append-icon="">
          <v-card-title class="text-h5 font-weight-bold d-flex">
            Reservas Pendentes
            <v-spacer></v-spacer>
            <v-icon class="ma-2" color="primary">mdi-calendar-clock</v-icon>
          </v-card-title>

          <v-card-subtitle class="text-subtitle-2">
            Total de reservas pendentes
          </v-card-subtitle>

          <v-card-text class="text-h4 font-weight-bold">
            {{ checkins }}
          </v-card-text>


          <v-card-actions class="justify-end">
            <v-btn class="pa-1" @click="" size="small">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>


    <v-row>
      <Bar :data="chartData" :options="chartOptions" />
    </v-row>
  </v-container>

</template>

<script lang="ts" setup>

import { ref } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';

let checkins = ref(0);


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = {
  labels: ['Check-ins', 'Check-outs', 'Reservas'],
  datasets: [
    {
      label: 'Total por categoria',
      backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      data: [12, 9, 5], // coloque os valores reais aqui
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Resumo do Hotel',
    },
  },
};


</script>
