<template>
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
  
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
  
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
  
        <label for="first_name">First Name:</label>
        <input type="text" id="first_name" v-model="first_name">
  
        <label for="last_name">Last Name:</label>
        <input type="text" id="last_name" v-model="last_name">
  
        <!-- Puedes agregar más campos según lo que solicite la API -->
  
        <button type="submit">Register</button>
      </form>
      <p class="login-prompt">
      ¿Ya tienes una cuenta?, <router-link to="/login" class="login-link">Inicia sesión</router-link>
    </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RegisterView',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        // Puedes agregar más campos según lo que solicite la API
      };
    },
    methods: {
      async register() {
        try {
          // Realizar la solicitud HTTP para registrar al usuario
          const response = await this.$axios.post('task_manager/register/', {
              username: this.username,
              email: this.email,
              password: this.password,
              first_name: this.first_name,
              last_name: this.last_name,
              // Puedes agregar más campos según lo que solicite la API
          });
  
          // Manejar la respuesta (puede redirigir al usuario a la página de inicio de sesión, por ejemplo)
          console.log('Registro exitoso:', response);
  
          // Redirigir a la página de inicio de sesión después del registro exitoso
          this.$router.push('/login');
        } catch (error) {
          console.error('Error durante el registro:', error);
          // Manejar errores aquí (puedes mostrar un mensaje de error)
        }
      },
    },
  };
  </script>
  
  <style scoped>
/* ... Tus estilos actuales ... */

.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #3498db; /* Borde azul claro */
  border-radius: 8px;
  text-align: center;
  background-color: #ecf0f1; /* Fondo gris claro */
}

.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-bottom: 8px;
}

input {
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;
}

button {
  background-color: #3498db; /* Fondo azul claro */
  color: #fff; /* Texto blanco */
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9; /* Cambia a un tono más oscuro al pasar el ratón */
}

.login-prompt {
  margin-top: 16px;
  font-size: 14px;
  white-space: nowrap; /* Asegura que todo el texto esté en una sola línea */
}

.login-link {
  color: #3498db; /* Texto azul claro */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #2980b9; /* Cambia a un tono más oscuro al pasar el ratón */
}
</style>