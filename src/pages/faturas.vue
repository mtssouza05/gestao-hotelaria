<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">
        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 12px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-cash</v-icon>
              Pesquisar Faturas
            </div>
            <v-btn variant="text" size="small" @click="limparFiltros"
              style="color: #aaa; border-radius: 6px; padding: 4px 12px; font-weight: 500;">
              <v-icon start size="16">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.cliente" :items="clientes" label="Cliente" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.status" :items="statusOptions" label="Status" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.dataEmissao" label="Data de Emissão" variant="outlined" type="date"
                  color="white" density="comfortable" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.dataVencimento" label="Data de Vencimento" variant="outlined" type="date"
                  color="white" density="comfortable" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px; background-color: #1e1e1e;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-receipt</v-icon> Faturas
              <v-spacer />
              <v-btn variant="elevated" size="medium" class="text-grey-lighten-2" @click="abrirCadastro">
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
                  <th class="text-left text-white">Cliente</th>
                  <th class="text-left text-white">Valor</th>
                  <th class="text-left text-white">Status</th>
                  <th class="text-left text-white">Emissão</th>
                  <th class="text-left text-white">Vencimento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fatura, index) in faturasFiltradas" :key="index">
                  <td class="text-white">{{ fatura.cliente }}</td>
                  <td class="text-white">R$ {{ fatura.valor.toFixed(2) }}</td>
                  <td class="text-white">{{ fatura.status }}</td>
                  <td class="text-white">{{ fatura.dataEmissao }}</td>
                  <td class="text-white">{{ fatura.dataVencimento }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalCadastro" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">Cadastrar Fatura</v-card-title>
            <v-card-text>
              <v-text-field v-model="novaFatura.cliente" label="Cliente" variant="outlined" class="mb-3" />
              <v-text-field v-model.number="novaFatura.valor" label="Valor (R$)" type="number" variant="outlined"
                class="mb-3" />
              <v-select v-model="novaFatura.status" :items="statusOptions" label="Status" variant="outlined"
                class="mb-3" />
              <v-text-field v-model="novaFatura.dataEmissao" label="Data de Emissão" type="date" variant="outlined"
                class="mb-3" />
              <v-text-field v-model="novaFatura.dataVencimento" label="Data de Vencimento" type="date" variant="outlined"
                class="mb-3" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="modalCadastro = false">Cancelar</v-btn>
              <v-btn color="primary" @click="salvarFatura">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const filtros = ref({
  cliente: [],
  status: [],
  dataEmissao: '',
  dataVencimento: ''
})

const clientes = ['João', 'Maria', 'Carlos', 'Fernanda']
const statusOptions = ['Pago', 'Pendente', 'Atrasado']

const todasFaturas = ref([
  { cliente: 'João', valor: 150.00, status: 'Pago', dataEmissao: '2025-05-01', dataVencimento: '2025-05-10' },
  { cliente: 'Maria', valor: 300.00, status: 'Pendente', dataEmissao: '2025-05-05', dataVencimento: '2025-05-15' },
  { cliente: 'Carlos', valor: 450.00, status: 'Atrasado', dataEmissao: '2025-05-03', dataVencimento: '2025-05-12' }
])

const modalCadastro = ref(false)
const novaFatura = ref({
  cliente: '',
  valor: 0,
  status: '',
  dataEmissao: '',
  dataVencimento: ''
})

function limparFiltros() {
  filtros.value = { cliente: [], status: [], dataEmissao: '', dataVencimento: '' }
}

function abrirCadastro() {
  novaFatura.value = { cliente: '', valor: 0, status: '', dataEmissao: '', dataVencimento: '' }
  modalCadastro.value = true
}

function salvarFatura() {
  if (!novaFatura.value.cliente || !novaFatura.value.valor || !novaFatura.value.status || !novaFatura.value.dataEmissao || !novaFatura.value.dataVencimento) {
    alert('Preencha todos os campos.')
    return
  }
  todasFaturas.value.push({ ...novaFatura.value })
  modalCadastro.value = false
}

const faturasFiltradas = computed(() => {
  return todasFaturas.value.filter(f => {
    const clienteMatch = filtros.value.cliente.length === 0 || filtros.value.cliente.includes(f.cliente)
    const statusMatch = filtros.value.status.length === 0 || filtros.value.status.includes(f.status)
    const emissaoMatch = filtros.value.dataEmissao ? f.dataEmissao === filtros.value.dataEmissao : true
    const vencimentoMatch = filtros.value.dataVencimento ? f.dataVencimento === filtros.value.dataVencimento : true
    return clienteMatch && statusMatch && emissaoMatch && vencimentoMatch
  })
})

function exportarExcel() {
  const dadosParaExportar = faturasFiltradas.value.map(f => ({
    Cliente: f.cliente,
    Valor: f.valor,
    Status: f.status,
    'Data de Emissão': f.dataEmissao,
    'Data de Vencimento': f.dataVencimento
  }))

  const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas')
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, 'faturas.xlsx')
}
</script>
