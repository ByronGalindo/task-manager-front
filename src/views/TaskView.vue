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
      return async (event) => {
        event.preventDefault();
        if (this.draggedTask) {
          try {
            // Mover la tarea a la nueva columna (actualizar el estado según sea necesario)
            await this.$axios.patch(`http://localhost:8000/api/task_manager/tasks/${this.draggedTask.id}/`, {
              status: status,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            this.draggedTask.status = status;
            this.draggedTask = null;
          } catch (error) {
            console.error('Error al mover la tarea:', error);
          }
        }
      };
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
          const response = await this.$axios.post('http://localhost:8000/api/task_manager/tasks/', {
            description: description,
            status: status,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const newTask = response.data;
          this.tasksByStatus[status].push(newTask);
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
