<template>
  <v-app>
    <v-app-bar :elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="ExibeDrawerClick()"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-menu location="bottom end" offset-y>
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" image="./assets/joseworker.png"></v-avatar>
          </template>

          <v-card width="300" class="pa-2">
            <v-list>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">
                  {{ user.nome }}
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold">
                  {{ user.cargo }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mt-2 mb-1">
                  {{ user.contato }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-divider class="my-1"></v-divider>

              <v-list-item @click="openConfigDialog">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-cog</v-icon>
                  Configurações
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="exibeDrawer" app>
      <v-container class="pa-4 text-center" fluid>
        <v-avatar size="64" class="mb-2" image="./assets/sunsethotel.png" />
        <div class="text-h6 font-weight-bold">Sunset Hotel</div>
      </v-container>
      <v-divider class="my-2"></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/" />
        <v-list-item prepend-icon="mdi-account" title="Clientes" value="clientes" to="clientes" />
        <v-list-item prepend-icon="mdi-calendar" title="Reservas" value="reservas" to="reservas" />
        <v-list-item prepend-icon="mdi-bed" title="Quartos" value="quartos" to="quartos" />
        <v-list-item prepend-icon="mdi-account-hard-hat" title="Funcionários" value="funcionarios" to="funcionarios" />
        <v-list-item prepend-icon="mdi-currency-usd" title="Fatura/Pagamento" value="faturas" to="faturas" />
        <v-list-item prepend-icon="mdi-calendar" title="Eventos" value="eventos" to="eventos" />

      </v-list>

      <div class="logout-btn-wrapper">
        <v-btn
          text
          color="red lighten-1"
          class="logout-btn"
          @click="logout"
        >
          <v-icon left>mdi-logout</v-icon>
          Sair
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-dialog v-model="dialogConfig" max-width="500">
      <v-card style="background-color: #1e1e1e; color: white;">
        <v-card-title>
          <v-icon class="mr-2">mdi-cog-outline</v-icon>
          Configurações
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-form>
            <v-text-field label="Nome do Usuário" v-model="user.nome" variant="outlined" color="white" />
            <v-text-field label="E-mail" v-model="user.contato" variant="outlined" color="white" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey lighten-1" @click="dialogConfig = false">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarConfig">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const exibeDrawer = ref(false)
const dialogConfig = ref(false)

const router = useRouter()

const user = ref({
  nome: 'José Henrique',
  cargo: 'Gerente',
  contato: 'josehenrique@sunsethotel.com'
})

function ExibeDrawerClick() {
  exibeDrawer.value = !exibeDrawer.value
}

function logout() {
  router.push('/login')
}

function openConfigDialog() {
  dialogConfig.value = true
}

function salvarConfig() {
  alert(`Configurações salvas para: ${user.value.nome} - ${user.value.contato}`)
  dialogConfig.value = false
}
</script>

<style scoped>
.logout-btn-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.v-navigation-drawer:hover .logout-btn-wrapper {
  opacity: 1;
}

.logout-btn {
  width: 90%;
  justify-content: flex-start;
}
</style>
