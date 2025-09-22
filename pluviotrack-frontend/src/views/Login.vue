<template>
  <div class="login-page">
    <div class="login-image">
      <img src="../assets/CONICET3.jpg" alt="Imagen login" />
    </div>

    <div class="login-form-container">
      <h1>Login</h1>
      <form class="login-form">
        <label>Email</label>
        <input type="email" placeholder="Tu email" />

        <label>Contraseña</label>
        <input type="password" placeholder="Tu contraseña" />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  </div>
</template>

<script>
import '../style.css';
export default {
  name: "Login",
};
</script>


