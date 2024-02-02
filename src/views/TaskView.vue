<template>
    <div class="container mt-5">
      <div class="row">
        <div v-for="(tasks, status) in tasksByStatus" :key="status" class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>{{ status }}</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li v-for="task in tasks" :key="task.id" class="list-group-item">
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
    name:'TaskView',
    data() {
      return {
        tasksByStatus: {},
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
    border: 1px solid #ccc;
    margin: 10px;
  }
  </style>
  