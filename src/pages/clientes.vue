<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">
        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 16px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-magnify</v-icon>
              Pesquisar de Clientes
            </div>
            <v-btn variant="text" size="small" class="text-grey-lighten-1" @click="limparFiltros">
              <v-icon start size="small">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.nome" :items="nomes" label="Nome" variant="outlined" density="comfortable"
                  clearable multiple color="white" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.status" :items="statusOptions" label="Status" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.categoria" :items="categorias" label="Categoria" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.tipo" :items="tipos" label="Tipo" variant="outlined" density="comfortable"
                  clearable multiple color="white" />
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px; background-color: #1e1e1e;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-account-group</v-icon> Clientes
              <v-spacer />
              <v-btn variant="elevated" size="medium" class="text-grey-lighten-2" @click="CadastrarCliente()">
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
              <v-btn variant="elevated" size="medium" class="ml-2" @click="exportarExcel">
                <v-icon left>mdi-file-excel</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <v-table density="comfortable">
              <thead>
                <tr>
                  <th class="text-left text-white">Nome</th>
                  <th class="text-left text-white">Status</th>
                  <th class="text-left text-white">Categoria</th>
                  <th class="text-left text-white">Tipo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cliente, index) in clientesFiltrados" :key="index">
                  <td class="text-white">{{ cliente.nome }}</td>
                  <td class="text-white">{{ cliente.status }}</td>
                  <td class="text-white">{{ cliente.categoria }}</td>
                  <td class="text-white">{{ cliente.tipo }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="dialogCadastro" max-width="600px">
          <v-card style="border-radius: 16px; background-color: #1e1e1e;">
            <v-card-title class="text-white font-weight-bold">
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              Cadastrar Cliente
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="salvarCliente">
                <v-text-field v-model="novoCliente.nome" label="Nome" variant="outlined" color="white" class="mb-4"
                  required />
                <v-select v-model="novoCliente.status" :items="statusOptions" label="Status" variant="outlined"
                  color="white" class="mb-4" required />
                <v-select v-model="novoCliente.categoria" :items="categorias" label="Categoria" variant="outlined"
                  color="white" class="mb-4" required />
                <v-select v-model="novoCliente.tipo" :items="tipos" label="Tipo" variant="outlined" color="white"
                  class="mb-4" required />
                <div class="d-flex justify-end">
                  <v-btn text @click="dialogCadastro = false" class="mr-2">Cancelar</v-btn>
                  <v-btn color="primary" type="submit">Salvar</v-btn>
                </div>
              </v-form>
            </v-card-text>
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
  nome: [],
  status: [],
  categoria: [],
  tipo: [],
})

const nomes = ['João', 'Maria', 'Carlos', 'Fernanda']
const statusOptions = ['Ativo', 'Inativo']
const categorias = ['Comum', 'Premium', 'VIP']
const tipos = ['Pessoa Física', 'Pessoa Jurídica']

const todosClientes = ref([
  { nome: 'João', status: 'Ativo', categoria: 'Comum', tipo: 'Pessoa Física' },
  { nome: 'Maria', status: 'Inativo', categoria: 'Premium', tipo: 'Pessoa Jurídica' },
  { nome: 'Carlos', status: 'Ativo', categoria: 'VIP', tipo: 'Pessoa Física' },
  { nome: 'Fernanda', status: 'Ativo', categoria: 'Comum', tipo: 'Pessoa Jurídica' },
])

function limparFiltros() {
  filtros.value = {
    nome: [],
    status: [],
    categoria: [],
    tipo: [],
  }
}

function consultar() {
  console.log('Filtros aplicados:', filtros.value)
}

const clientesFiltrados = computed(() => {
  return todosClientes.value.filter(cliente => {
    const nomeMatch = filtros.value.nome.length === 0 || filtros.value.nome.includes(cliente.nome)
    const statusMatch = filtros.value.status.length === 0 || filtros.value.status.includes(cliente.status)
    const categoriaMatch = filtros.value.categoria.length === 0 || filtros.value.categoria.includes(cliente.categoria)
    const tipoMatch = filtros.value.tipo.length === 0 || filtros.value.tipo.includes(cliente.tipo)
    return nomeMatch && statusMatch && categoriaMatch && tipoMatch
  })
})


const dialogCadastro = ref(false)

const novoCliente = ref({
  nome: '',
  status: '',
  categoria: '',
  tipo: '',
})

function CadastrarCliente() {
  dialogCadastro.value = true
}

function salvarCliente() {
  // Validações simples (já feitas pelo "required")
  if (
    novoCliente.value.nome &&
    novoCliente.value.status &&
    novoCliente.value.categoria &&
    novoCliente.value.tipo
  ) {
    todosClientes.value.push({ ...novoCliente.value })
    dialogCadastro.value = false

    // Limpa os campos para o próximo uso
    novoCliente.value = {
      nome: '',
      status: '',
      categoria: '',
      tipo: '',
    }
  }
}

function exportarExcel() {
  const dadosParaExportar = clientesFiltrados.value.map(cliente => ({
    Nome: cliente.nome,
    Status: cliente.status,
    Categoria: cliente.categoria,
    Tipo: cliente.tipo,
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, 'clientes.xlsx');
}
</script>