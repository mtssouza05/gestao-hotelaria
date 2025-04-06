<template>
  <v-app>
    <v-app-bar :elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="ExibeDrawerClick()"></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" image="./assets/arraxca.png"></v-avatar>
          </template>

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

            <v-divider></v-divider>

            <v-list-item @click="">
              <v-list-item-title>
                <v-icon>mdi-cog</v-icon>
                Configurações
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="">
              <v-list-item-title>
                <v-icon>mdi-logout</v-icon>
                Sair
              </v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>

      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="exibeDrawer" app>
      <!-- Topo com logo e nome -->
      <v-container class="pa-4 text-center" fluid>
        <v-avatar size="64" class="mb-2" image="./assets/sunsethotel.png" />
        <div class="text-h6 font-weight-bold">Sunset Hotel</div>
      </v-container>
      <v-divider class="my-2"></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" />
        <v-list-item prepend-icon="mdi-account" title="Clientes" value="clientes" />
        <v-list-item prepend-icon="mdi-calendar" title="Reservas" value="reservas" />
        <v-list-item prepend-icon="mdi-bed" title="Quartos" value="quartos" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

let exibeDrawer = ref(false);

const user = {
  nome: "Giorgian De Arrascaeta",
  cargo: "Gerente",
  contato: "arraxca@outlook.com"
}


function ExibeDrawerClick() {
  exibeDrawer.value = !exibeDrawer.value;
}

</script>