<template>
  <div class="container mt-5">
    <div class="columns">
      <div
        v-for="(tasks, status) in tasksByStatus"
        :key="status"
        class="column"
        @dragover.prevent="allowDrop"
        @drop="onDrop(status)"
      >
        <div class="card">
          <div class="card-header">
            <h5>{{ status }}</h5>
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-for="task in tasks"
              :key="task.id"
              class="list-group-item"
              draggable="true"
              @dragstart="onDragStart(task)"
            >
              {{ task.description }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskView',
  data() {
    return {
      tasksByStatus: {},
      draggedTask: null,
    };
  },
  methods: {
    organizeTasksByStatus(tasks) {
      const tasksByStatus = {};

      tasks.forEach((task) => {
        const status = task.status;
        if (!tasksByStatus[status]) {
          tasksByStatus[status] = [];
        }

        tasksByStatus[status].push(task);
      });

      return tasksByStatus;
    },
    async fetchTasks() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/task_manager/tasks/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.tasksByStatus = this.organizeTasksByStatus(response.data.objeto);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    },
    allowDrop(event) {
      event.preventDefault();
    },
    onDragStart(task) {
      this.draggedTask = task;
    },
    onDrop(status) {
      return (event) => {
        event.preventDefault();
        if (this.draggedTask) {
          // Mover la tarea a la nueva columna (actualizar el estado según sea necesario)
          console.log(`Tarea ${this.draggedTask.description} movida a ${status}`);
          this.draggedTask.status = status;
          this.fetchTasks(); // Puedes eliminar y agregar la tarea de manera más eficiente en lugar de recargar todas las tareas
          this.draggedTask = null;
        }
      };
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.columns {
  display: flex;
}

.column {
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: #f5f5f5; /* Fondo gris claro */
}

.task-list {
  list-style-type: none; /* Elimina el estilo de la lista */
  padding: 0;
}
</style>
