<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">
        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 12px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Pesquisar Funcionários
            </div>
            <v-btn variant="text" size="small" @click="limparFiltros"
              style="color: #aaa; border-radius: 6px; padding: 4px 12px; font-weight: 500;">
              <v-icon start size="16">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.nome" :items="nomes" label="Nome" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.cargo" :items="cargos" label="Cargo" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-combobox v-model="filtros.status" :items="statusOptions" label="Status" variant="outlined"
                  density="comfortable" clearable multiple color="white" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="filtros.admissao" label="Data de Admissão" variant="outlined" type="date"
                  color="white" density="comfortable" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px; background-color: #1e1e1e;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-account-multiple</v-icon> Funcionários
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
                  <th class="text-left text-white">Nome</th>
                  <th class="text-left text-white">Cargo</th>
                  <th class="text-left text-white">Status</th>
                  <th class="text-left text-white">Admissão</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(funcionario, index) in funcionariosFiltrados" :key="index">
                  <td class="text-white">{{ funcionario.nome }}</td>
                  <td class="text-white">{{ funcionario.cargo }}</td>
                  <td class="text-white">{{ funcionario.status }}</td>
                  <td class="text-white">{{ funcionario.admissao }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalCadastro" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">Cadastrar Funcionário</v-card-title>
            <v-card-text>
              <v-text-field v-model="novoFuncionario.nome" label="Nome" variant="outlined" class="mb-3" />
              <v-select v-model="novoFuncionario.cargo" :items="cargos" label="Cargo" variant="outlined"
                class="mb-3" />
              <v-select v-model="novoFuncionario.status" :items="statusOptions" label="Status" variant="outlined"
                class="mb-3" />
              <v-text-field v-model="novoFuncionario.admissao" label="Data de Admissão" type="date" variant="outlined"
                class="mb-3" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="modalCadastro = false">Cancelar</v-btn>
              <v-btn color="primary" @click="salvarFuncionario">Salvar</v-btn>
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
  nome: [],
  cargo: [],
  status: [],
  admissao: ''
})

const nomes = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'José Henrique']
const cargos = ['Recepcionista', 'Camareira', 'Gerente']
const statusOptions = ['Ativo', 'Inativo', 'Férias']

const todosFuncionarios = ref([
  { nome: 'Ana Souza', cargo: 'Recepcionista', status: 'Ativo', admissao: '2023-01-15' },
  { nome: 'Bruno Lima', cargo: 'Camareira', status: 'Férias', admissao: '2022-06-20' },
  { nome: 'Carla Dias', cargo: 'Gerente', status: 'Inativo', admissao: '2021-09-10' },
  { nome: 'José Henrique', cargo: 'Gerente', status: 'Ativo', admissao: '2024-09-24' },
])

const modalCadastro = ref(false)
const novoFuncionario = ref({ nome: '', cargo: '', status: '', admissao: '' })

function abrirCadastro() {
  novoFuncionario.value = { nome: '', cargo: '', status: '', admissao: '' }
  modalCadastro.value = true
}

function limparFiltros() {
  filtros.value = { nome: [], cargo: [], status: [], admissao: '' }
}

function salvarFuncionario() {
  if (!novoFuncionario.value.nome || !novoFuncionario.value.cargo || !novoFuncionario.value.status || !novoFuncionario.value.admissao) {
    alert('Preencha todos os campos obrigatórios.')
    return
  }
  todosFuncionarios.value.push({ ...novoFuncionario.value })
  modalCadastro.value = false
}

const funcionariosFiltrados = computed(() => {
  return todosFuncionarios.value.filter(func => {
    const nomeMatch = filtros.value.nome.length === 0 || filtros.value.nome.includes(func.nome)
    const cargoMatch = filtros.value.cargo.length === 0 || filtros.value.cargo.includes(func.cargo)
    const statusMatch = filtros.value.status.length === 0 || filtros.value.status.includes(func.status)
    const admissaoMatch = filtros.value.admissao ? func.admissao === filtros.value.admissao : true
    return nomeMatch && cargoMatch && statusMatch && admissaoMatch
  })
})

function exportarExcel() {
  const dadosParaExportar = funcionariosFiltrados.value.map(func => ({
    Nome: func.nome,
    Cargo: func.cargo,
    Status: func.status,
    Admissao: func.admissao
  }))
  const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionarios');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'funcionarios.xlsx');
}
</script>