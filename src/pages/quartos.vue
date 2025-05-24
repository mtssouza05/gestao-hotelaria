<template>
  <v-container class="pa-4" style="height: 100vh;">
    <v-row justify="center">
      <v-col cols="12" xl="10" lg="11" md="12">

        <v-card elevation="2" class="pa-6 mb-6" style="border-radius: 12px; background-color: #121212;">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-h5 font-weight-bold text-white d-flex align-center">
              <v-icon class="mr-2">mdi-bed</v-icon>
              Pesquisar Quartos
            </div>
            <v-btn variant="text" size="small" @click="limparFiltros"
              style="color: #aaa; border-radius: 6px; padding: 4px 12px; font-weight: 500;">
              <v-icon start size="16">mdi-close</v-icon> Limpar
            </v-btn>
          </div>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model="filtros.nome" label="Nome do Quarto" variant="outlined" color="white"
                  density="comfortable" clearable />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox v-model="filtros.categoria" :items="categorias" label="Categoria" variant="outlined"
                  color="white" clearable density="comfortable" />
              </v-col>
              <v-col cols="12" md="4">
                <v-combobox v-model="filtros.tipo" :items="tipos" label="Tipo" variant="outlined" color="white"
                  clearable density="comfortable" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="pa-4" style="border-radius: 12px;">
          <v-card-title class="text-white font-weight-medium mb-2">
            <div style="display: flex;">
              <v-icon class="mr-2">mdi-bed-outline</v-icon> Quartos
              <v-spacer />
              <v-btn variant="elevated" size="medium" class="text-grey-lighten-2" @click="CadastrarQuarto()">
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
                  <th class="text-left text-white">Categoria</th>
                  <th class="text-left text-white">Tipo</th>
                  <th class="text-left text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(quarto, index) in quartosFiltrados" :key="index">
                  <td class="text-white">{{ quarto.nome }}</td>
                  <td class="text-white">{{ quarto.categoria }}</td>
                  <td class="text-white">{{ quarto.tipo }}</td>
                  <td class="text-white">{{ quarto.status }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="modalCadastroQuarto" max-width="500px">
          <v-card>
            <v-card-title class="text-h6">Cadastrar Quarto</v-card-title>
            <v-card-text>
              <v-text-field v-model="novoQuarto.nome" label="Nome do Quarto" variant="outlined" class="mb-3" />
              <v-select v-model="novoQuarto.categoria" :items="categorias" label="Categoria" variant="outlined"
                class="mb-3" />
              <v-select v-model="novoQuarto.tipo" :items="tipos" label="Tipo" variant="outlined" class="mb-3" />
              <v-select v-model="novoQuarto.status" :items="['Disponível', 'Ocupado', 'Reservado', 'Manutenção']"
                label="Status" variant="outlined" class="mb-3" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="modalCadastroQuarto = false">Cancelar</v-btn>
              <v-btn color="primary" @click="salvarQuarto">Salvar</v-btn>
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
  nome: '',
  categoria: '',
  tipo: ''
})

const categorias = ['Comum', 'Premium', 'VIP']
const tipos = ['Solteiro', 'Casal', 'Família']

const todosQuartos = ref([
  { nome: 'Quarto 101', categoria: 'Comum', tipo: 'Solteiro', status: 'Disponível' },
  { nome: 'Quarto 102', categoria: 'Premium', tipo: 'Casal', status: 'Ocupado' },
  { nome: 'Quarto 103', categoria: 'VIP', tipo: 'Família', status: 'Reservado' },
  { nome: 'Quarto 104', categoria: 'Comum', tipo: 'Solteiro', status: 'Disponível' },
  { nome: 'Quarto 105', categoria: 'VIP', tipo: 'Casal', status: 'Manutenção' },
])

const limparFiltros = () => {
  filtros.value = { nome: '', categoria: '', tipo: '' }
}

const quartosFiltrados = computed(() => {
  return todosQuartos.value.filter(quarto => {
    const matchNome = !filtros.value.nome || quarto.nome.toLowerCase().includes(filtros.value.nome.toLowerCase())
    const matchCategoria = !filtros.value.categoria || quarto.categoria === filtros.value.categoria
    const matchTipo = !filtros.value.tipo || quarto.tipo === filtros.value.tipo
    return matchNome && matchCategoria && matchTipo
  })
})

const modalCadastroQuarto = ref(false)

const novoQuarto = ref({
  nome: '',
  categoria: '',
  tipo: '',
  status: ''
})

function CadastrarQuarto() {
  novoQuarto.value = {
    nome: '',
    categoria: '',
    tipo: '',
    status: ''
  }
  modalCadastroQuarto.value = true
}

function salvarQuarto() {
  const { nome, categoria, tipo, status } = novoQuarto.value
  if (!nome || !categoria || !tipo || !status) {
    alert('Preencha todos os campos para salvar o quarto.')
    return
  }

  todosQuartos.value.push({ ...novoQuarto.value })
  modalCadastroQuarto.value = false
}


function exportarExcel() {
  const dadosParaExportar = quartosFiltrados.value.map(quarto => ({
    Nome: quarto.nome,
    Categoria: quarto.categoria,
    Tipo: quarto.tipo
  }));

  const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'quartos');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, 'quartos.xlsx');
}

</script>
