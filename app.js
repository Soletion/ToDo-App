const API_URL = 'http://localhost:3000/tasks';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = [];

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', async () => {
  tasks = await fetchTasks();
  renderTasks();
});

// Manejar envío de formulario
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  const newTask = await addTask(text);
  tasks.push(newTask);
  renderTasks();
  taskInput.value = '';
});

// Obtener tareas desde la API
async function fetchTasks() {
  const res = await fetch(API_URL);
  return await res.json();
}

// Renderizar tareas en la lista
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.style.textDecoration = 'line-through';

    // Botón completar
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Desmarcar' : 'Completar';
    completeBtn.onclick = async () => {
      const updatedTask = await toggleTask(task);
      // Actualiza solo la tarea modificada en el array
      tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      renderTasks();
    };

    // Botón eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = async () => {
      await deleteTask(task.id);
      tasks = tasks.filter(t => t.id !== task.id);
      renderTasks();
    };

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Agregar tarea a la API
async function addTask(text) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, completed: false })
  });
  return await res.json();
}

// Cambiar estado de completado
async function toggleTask(task) {
  const res = await fetch(`${API_URL}/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed })
  });
  return await res.json();
}

// Eliminar tarea
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
}
