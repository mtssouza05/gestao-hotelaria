<template>
    <div class="login-wrapper">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card
          class="pa-6"
          style="width: 100%; max-width: 400px; background-color: #1e1e1e; border-radius: 16px;"
        >
          <v-card-title class="text-h6 text-white mb-4">
            <v-icon class="mr-2">mdi-account-circle</v-icon>
            Gestão Hotelaria - Acesso
          </v-card-title>
  
          <v-card-text>
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              variant="outlined"
              color="white"
              class="mb-4"
              density="comfortable"
            />
  
            <v-text-field
              v-model="senha"
              label="Senha"
              type="password"
              variant="outlined"
              color="white"
              density="comfortable"
            />
  
            <v-btn class="mt-6" block color="primary" @click="login">
              Entrar
            </v-btn>
  
            <div class="text-center mt-4">
              <a
                href="#"
                @click.prevent="abrirDialog"
                class="text-white text-decoration-underline text-caption"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
  
      <v-dialog v-model="dialog" max-width="400">
        <v-card style="background-color: #1e1e1e;">
          <v-card-title class="text-white">
            <v-icon class="mr-2">mdi-lock-reset</v-icon>
            Recuperar Senha
          </v-card-title>
  
          <v-card-text>
            <v-text-field
              v-model="emailRecuperacao"
              label="Informe seu e-mail"
              variant="outlined"
              color="white"
              type="email"
              density="comfortable"
            />
          </v-card-text>
  
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" color="grey-lighten-1" @click="dialog = false">
              Cancelar
            </v-btn>
            <v-btn color="primary" @click="enviarRecuperacao">Enviar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const senha = ref('')
  const dialog = ref(false)
  const emailRecuperacao = ref('')
  const router = useRouter()
  
  function login() {
    console.log('Login', email.value, senha.value)
    router.push('/')
  }
  
  function abrirDialog() {
    dialog.value = true
  }
  
  function enviarRecuperacao() {
    alert(`Enviar e-mail para: ${emailRecuperacao.value}`)
    dialog.value = false
  }
  </script>
  
  <style scoped>
  .login-wrapper {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: #121212;
  }
  </style>
  