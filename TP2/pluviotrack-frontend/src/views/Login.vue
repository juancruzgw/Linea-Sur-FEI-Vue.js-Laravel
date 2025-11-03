
<template>
  <div class="login-container">
    <h2 class="login-title">Login</h2>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="form-input"
          required
        />
      </div>

      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <button type="submit" class="login-button">Ingresar</button>
    </form>
  </div>
</template>

<script>

import axios from "axios";
import '../style.css';

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';

      if (!this.email || !this.password) {
        this.error = 'Por favor, completa todos los campos.';
        return;
      }

      try {
        // Llamada POST al backend Laravel
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: this.email,
          password: this.password
        });

        // Si el login es correcto
        alert('Login exitoso ✅');
        // Redirigir al home
        this.$router.push({ name: 'home' });

      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.error = 'Contraseña o email incorrecto.';
        } else {
          this.error = 'Ocurrió un error en el servidor.';
        }
      }
    }
  }
};
</script>