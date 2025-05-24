<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">
        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 12px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-calendar-clock</v-icon>
              Pesquisar Eventos
            </div>
            <v-btn variant="text" size="small" @click="limparFiltros" style="color: #aaa;">
              <v-icon start size="16">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.nome" :items="nomesEventos" label="Nome do Evento"
                  variant="outlined" multiple clearable color="white" />
              </v-col>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.status" :items="statusOptions" label="Status"
                  variant="outlined" multiple clearable color="white" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.data" label="Data do Evento" type="date" variant="outlined" color="white" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px; background-color: #1e1e1e;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-calendar-multiselect</v-icon> Eventos
              <v-spacer />
              <v-btn variant="elevated" class="text-grey-lighten-2" @click="abrirModalCadastro">
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn variant="elevated" class="ml-2" @click="exportarExcel">
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
                  <th class="text-left text-white">Data</th>
                  <th class="text-left text-white">Local</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(evento, index) in eventosFiltrados" :key="index">
                  <td class="text-white">{{ evento.nome }}</td>
                  <td class="text-white">{{ evento.status }}</td>
                  <td class="text-white">{{ evento.data }}</td>
                  <td class="text-white">{{ evento.local }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalCadastroEvento" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">Cadastrar Evento</v-card-title>
            <v-card-text>
              <v-text-field v-model="novoEvento.nome" label="Nome" variant="outlined" class="mb-3" />
              <v-select v-model="novoEvento.status" :items="statusOptions" label="Status" variant="outlined" class="mb-3" />
              <v-text-field v-model="novoEvento.data" label="Data" type="date" variant="outlined" class="mb-3" />
              <v-text-field v-model="novoEvento.local" label="Local" variant="outlined" class="mb-3" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="modalCadastroEvento = false">Cancelar</v-btn>
              <v-btn color="primary" @click="salvarEvento">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const filtros = ref({ nome: [], status: [], data: '' })
const nomesEventos = ['Feira de Turismo', 'Workshop de Hotelaria', 'Festa Junina']
const statusOptions = ['Agendado', 'Concluído', 'Cancelado']

const todosEventos = ref([
  { nome: 'Feira de Turismo', status: 'Agendado', data: '2025-06-10', local: 'Salão Principal' },
  { nome: 'Workshop de Hotelaria', status: 'Concluído', data: '2025-04-20', local: 'Sala 2' },
  { nome: 'Festa Junina', status: 'Cancelado', data: '2025-06-23', local: 'Área Externa' },
])

const modalCadastroEvento = ref(false)
const novoEvento = ref({ nome: '', status: '', data: '', local: '' })

const limparFiltros = () => {
  filtros.value = { nome: [], status: [], data: '' }
}

const abrirModalCadastro = () => {
  novoEvento.value = { nome: '', status: '', data: '', local: '' }
  modalCadastroEvento.value = true
}

const salvarEvento = () => {
  if (!novoEvento.value.nome || !novoEvento.value.status || !novoEvento.value.data || !novoEvento.value.local) {
    alert('Preencha todos os campos.')
    return
  }
  todosEventos.value.push({ ...novoEvento.value })
  modalCadastroEvento.value = false
}

const eventosFiltrados = computed(() => {
  return todosEventos.value.filter(e => {
    const nomeMatch = filtros.value.nome.length === 0 || filtros.value.nome.includes(e.nome)
    const statusMatch = filtros.value.status.length === 0 || filtros.value.status.includes(e.status)
    const dataMatch = filtros.value.data ? e.data === filtros.value.data : true
    return nomeMatch && statusMatch && dataMatch
  })
})

const exportarExcel = () => {
  const dados = eventosFiltrados.value.map(e => ({
    Nome: e.nome,
    Status: e.status,
    Data: e.data,
    Local: e.local,
  }))
  const worksheet = XLSX.utils.json_to_sheet(dados)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'eventos.xlsx')
}
</script>
