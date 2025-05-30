<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">
        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 12px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              Pesquisar Reservas
            </div>
            <v-btn variant="text" size="small" @click="limparFiltros"
              style="color: #aaa; border-radius: 6px; padding: 4px 12px; font-weight: 500;">
              <v-icon start size="16">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.nome" :items="nomes" label="Cliente" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.status" :items="statusOptions" label="Status" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
            </v-row>

            <!-- Filtros de Data -->
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.checkIn" label="Data Check-in" variant="outlined" type="date"
                  color="white" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.checkOut" label="Data Check-out" variant="outlined" type="date"
                  color="white" density="comfortable" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px; background-color: #1e1e1e;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-calendar-check</v-icon> Reservas
              <v-spacer />
              <v-btn variant="elevated" size="medium" class="text-grey-lighten-2" @click="CadastrarReserva()">
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn variant="elevated" size="medium" class="ml-2" @click="exportarExcel">
                <v-icon left>mdi-file-excel</v-icon>
              </v-btn>
            </div>

          </v-card-title>

          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left text-white">Nome</th>
                  <th class="text-left text-white">Status</th>
                  <th class="text-left text-white">Check-in</th>
                  <th class="text-left text-white">Check-out</th>
                  <th class="text-left text-white">Quartos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(reserva, index) in reservasFiltradas" :key="index">
                  <td class="text-white">{{ reserva.nome }}</td>
                  <td class="text-white">{{ reserva.status }}</td>
                  <td class="text-white">{{ reserva.checkIn }}</td>
                  <td class="text-white">{{ reserva.checkOut }}</td>
                  <td class="text-white">
                    <v-btn variant="outlined" size="small" class="rounded-sm text-white"
                      style="text-transform: none; font-size: 0.8rem; padding: 4px 10px; border-color: #555;"
                      @click="openModal(reserva.quartos)">
                      {{ reserva.quartos.length }} Quartos
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalCadastroReserva" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">Cadastrar Reserva</v-card-title>
            <v-card-text>
              <v-text-field v-model="novaReserva.nome" label="Nome do Cliente" variant="outlined" class="mb-3" />
              <v-select v-model="novaReserva.status" :items="statusOptions" label="Status" variant="outlined"
                class="mb-3" />
              <v-text-field v-model="novaReserva.checkIn" label="Data Check-in" type="date" variant="outlined"
                class="mb-3" />
              <v-text-field v-model="novaReserva.checkOut" label="Data Check-out" type="date" variant="outlined"
                class="mb-3" />
              <v-btn @click="adicionarQuarto()" variant="outlined" size="small" class="mb-2">
                <v-icon start>mdi-plus</v-icon> Adicionar Quarto
              </v-btn>

              <v-row v-for="(quarto, index) in novaReserva.quartos" :key="index" class="mb-2">
                <v-col cols="6">
                  <v-text-field v-model="quarto.nome" label="Nome do Quarto" variant="outlined" dense />
                </v-col>
                <v-col cols="6">
                  <v-select v-model="quarto.categoria" :items="['Comum', 'Premium', 'VIP']" label="Categoria"
                    variant="outlined" dense />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="modalCadastroReserva = false">Cancelar</v-btn>
              <v-btn color="primary" @click="salvarReserva">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>

    <v-dialog v-model="modalVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">Detalhes dos Quartos</span>
        </v-card-title>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left text-white">Quarto</th>
                <th class="text-left text-white">Categoria</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(quarto, index) in quartosModal" :key="index">
                <td class="text-white">{{ quarto.nome }}</td>
                <td class="text-white">{{ quarto.categoria }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey lighten-2" @click="modalVisible = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const filtros = ref({
  nome: [],
  status: [],
  categoria: [],
  tipo: [],
  checkIn: '',
  checkOut: '',
  quartos: [],
})

const nomes = ['João', 'Maria', 'Carlos', 'Fernanda']
const statusOptions = ['Confirmada', 'Cancelada', 'Pendente']

const todasReservas = ref([
  { nome: 'João', status: 'Confirmada', checkIn: '2025-05-05', checkOut: '2025-05-10', quartos: [{ nome: 'Quarto 101', categoria: 'Comum' }, { nome: 'Quarto 102', categoria: 'Premium' }] },
  { nome: 'Maria', status: 'Cancelada', checkIn: '2025-05-06', checkOut: '2025-05-12', quartos: [{ nome: 'Quarto 201', categoria: 'Premium' }] },
  { nome: 'Carlos', status: 'Pendente', checkIn: '2025-05-07', checkOut: '2025-05-14', quartos: [{ nome: 'Quarto 301', categoria: 'VIP' }] },
  { nome: 'Fernanda', status: 'Confirmada', checkIn: '2025-05-08', checkOut: '2025-05-13', quartos: [{ nome: 'Quarto 401', categoria: 'Comum' }, { nome: 'Quarto 402', categoria: 'VIP' }] },
])

const modalVisible = ref(false)
const quartosModal = ref([])

function limparFiltros() {
  filtros.value = {
    nome: [],
    status: [],
    categoria: [],
    tipo: [],
    checkIn: '',
    checkOut: '',
    quartos: [],
  }
}

function openModal(quartos) {
  quartosModal.value = quartos
  modalVisible.value = true
}

const reservasFiltradas = computed(() => {
  return todasReservas.value.filter(reserva => {
    const nomeMatch = filtros.value.nome.length === 0 || filtros.value.nome.includes(reserva.nome)
    const statusMatch = filtros.value.status.length === 0 || filtros.value.status.includes(reserva.status)
    const checkInMatch = filtros.value.checkIn ? reserva.checkIn === filtros.value.checkIn : true
    const checkOutMatch = filtros.value.checkOut ? reserva.checkOut === filtros.value.checkOut : true
    const quartosMatch = filtros.value.quartos.length === 0 || filtros.value.quartos.includes(reserva.quartos.length)
    return nomeMatch && statusMatch && checkInMatch && checkOutMatch && quartosMatch
  })
})

const modalCadastroReserva = ref(false)

const novaReserva = ref({
  nome: '',
  status: '',
  checkIn: '',
  checkOut: '',
  quartos: [],
})

function CadastrarReserva() {
  novaReserva.value = {
    nome: '',
    status: '',
    checkIn: '',
    checkOut: '',
    quartos: [],
  }
  modalCadastroReserva.value = true
}

function adicionarQuarto() {
  novaReserva.value.quartos.push({ nome: '', categoria: '' })
}

function salvarReserva() {
  if (!novaReserva.value.nome || !novaReserva.value.status || !novaReserva.value.checkIn || !novaReserva.value.checkOut) {
    alert('Preencha todos os campos obrigatórios.')
    return
  }
  todasReservas.value.push({ ...novaReserva.value })
  modalCadastroReserva.value = false
}


function exportarExcel() {
  const dadosParaExportar = reservasFiltradas.value.map(reserva => ({
    Nome: reserva.nome,
    Status: reserva.status,
    checkIn: reserva.checkIn,
    checkOut: reserva.checkOut,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'reservas');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, 'reservas.xlsx');
}

</script>