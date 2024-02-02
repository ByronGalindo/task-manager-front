<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
  
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
  
        <button type="submit">Login</button>
      </form>
      <p class="register-prompt">
        ¿No tienes una cuenta?, <router-link to="/register" class="register-link">Regístrate!</router-link>
    </p>
  </div>
</template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          // Realizar la solicitud HTTP para iniciar sesión
          const response = await this.$axios.post('token/', {
              username: this.username,
              password: this.password,
          });
          
          const token = response.data.objeto.access;
          console.log(token)
            localStorage.setItem('token', token);
          // Manejar la respuesta (puede redirigir al usuario a la página de tareas, por ejemplo)
          console.log('Inicio de sesión exitoso:', response);
  
          // Redirigir a la página de tareas después del inicio de sesión exitoso
          this.$router.push('/tasks');
        } catch (error) {
          console.error('Error durante el inicio de sesión:', error);
          // Manejar errores aquí (puedes mostrar un mensaje de error)
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #3498db; /* Borde azul claro */
    border-radius: 8px;
    text-align: center;
    background-color: #ecf0f1; /* Fondo gris claro */
  }
  
  .login-form {
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
  
  .register-link {
    display: block;
    margin-top: 16px;
    color: #3498db; /* Texto azul claro */
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .register-link:hover {
    color: #2980b9; /* Cambia a un tono más oscuro al pasar el ratón */
  }

  .register-prompt {
  margin-top: 16px;
  font-size: 14px;
  white-space: nowrap; /* Asegura que todo el texto esté en una sola línea */
}

.register-link {
  display: inline; /* Asegura que el enlace esté en la misma línea */
}
  </style>