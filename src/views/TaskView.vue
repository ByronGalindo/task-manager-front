<template>
  <div class="container mt-5">
    <div class="columns">
      <div
        v-for="(tasks, status) in columns"
        :key="status"
        class="column"
        @drop="onDrop(status)"
        @dragover.prevent
      >
        <div class="card">
          <div class="card-header">
            <h5>{{ status }}</h5>
          </div>
          <ul class="list-group list-group-flush" style="list-style-type: none;">
  <!-- Oculta los puntos de la lista -->

  <li
    v-if="tasks.length === 0"
    class="list-group-item empty-column"
    @dblclick="createTask(status)"
  >
    <em>Doble clic para agregar una tarea</em>
  </li>

  <li
    v-for="task in tasks"
    :key="task.id"
    class="list-group-item task-card"
    draggable="true"
    @dragstart="onDragStart(task)"
    @dblclick="editTask(task)"
  >
    {{ task.description }}
  </li>

  <!-- Siempre mostrar la opción de agregar tarea -->
  <li class="list-group-item empty-column" @dblclick="createTask(status)">
    <em>Doble clic para agregar una tarea</em>
  </li>
</ul>
          <div
            v-if="tasks.length === 0"
            class="list-group-item empty-column"
            @dblclick="createTask(status)"
          >
            <em>Doble clic para agregar una tarea</em>
          </div>
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
      columns: {
        'todo': [],
        'in progress': [],
        'done': [],
      },
      draggedTask: null,
    };
  },
  methods: {
    organizeTasksByStatus(tasks) {
      const tasksByStatus = {
        'todo': [],
        'in progress': [],
        'done': [],
      };

      tasks.forEach((task) => {
        tasksByStatus[task.status].push(task);
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

        this.columns = this.organizeTasksByStatus(response.data.objeto);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    },
    onDragStart(task) {
      this.draggedTask = task;
    },
    onDrop(status) {
      if (this.draggedTask && this.draggedTask.status !== status) {
        const index = this.columns[this.draggedTask.status].indexOf(this.draggedTask);
        if (index !== -1) {
          this.columns[this.draggedTask.status].splice(index, 1);
          this.draggedTask.status = status;
          this.columns[status].push(this.draggedTask);

          this.saveTaskStatus(this.draggedTask.id, status);
        }
      }
      this.draggedTask = null;
    },
    async saveTaskStatus(taskId, status) {
      try {
        await this.$axios.patch(`http://localhost:8000/api/task_manager/tasks/${taskId}/`, {
          status: status,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error('Error al actualizar el estado de la tarea:', error);
      }
    },
    async editTask(task) {
      const newDescription = prompt('Editar descripción de la tarea:', task.description);
      if (newDescription !== null) {
        try {
          await this.$axios.put(`http://localhost:8000/api/task_manager/tasks/${task.id}/`, {
            description: newDescription,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          task.description = newDescription;
        } catch (error) {
          console.error('Error al editar la tarea:', error);
        }
      }
    },
    async createTask(status) {
  const description = prompt('Ingrese la descripción de la nueva tarea:');
  if (description !== null) {
    try {
      await this.$axios.post('http://localhost:8000/api/task_manager/tasks/', {
        description: description,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Actualizar las tareas después de la creación
      this.fetchTasks();
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  }
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

.task-card {
  cursor: pointer;
  margin-bottom: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
}

.task-content {
  width: 100%; /* Ocupa todo el ancho */
}

.empty-column {
  cursor: pointer;
  background-color: #eee;
  border: 1px dashed #999;
  border-radius: 5px;
  padding: 8px;
  text-align: center;
  color: #999;
}

.empty-column:hover {
  background-color: #ddd;
}
</style>
