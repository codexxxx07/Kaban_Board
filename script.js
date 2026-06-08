// Kanban Board Application
// State Management
let tasks = [];
let currentFilter = 'all';
let draggedTask = null;

// DOM Elements
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskText = document.getElementById('taskText');
const taskPriority = document.getElementById('taskPriority');
const taskStatus = document.getElementById('taskStatus');
const cancelModal = document.getElementById('cancelModal');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const addTaskButtons = document.querySelectorAll('.add-task-btn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.documentElement.classList.remove('dark');
    renderTasks();
    setupEventListeners();
    handleSkeletonLoading();
});

// Skeleton Loading
function handleSkeletonLoading() {
    const skeleton = document.getElementById('skeletonLoader');
    const board = document.getElementById('kanbanBoard');

    window.addEventListener('load', () => {
        setTimeout(() => {
            skeleton.style.display = 'none';
            board.classList.remove('hidden');
            board.classList.add('animate-fade-in');
        }, 1200);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
    
    // Add Task Buttons
    addTaskButtons.forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.status));
    });
    
    // Modal Controls
    cancelModal.addEventListener('click', closeModal);
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });
    
    // Task Form Submit
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !taskModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Drag and Drop Setup
    setupDragAndDrop();
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

// Task Management
function loadTasks() {
    const savedTasks = localStorage.getItem('kanbanTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function saveTasks() {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

function createTask(text, priority, status) {
    const task = {
        id: Date.now().toString(),
        text: text.trim(),
        priority: priority,
        status: status,
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function updateTaskStatus(id, newStatus) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
        saveTasks();
        renderTasks();
    }
}

// Modal Management
function openModal(status = 'todo') {
    taskStatus.value = status;
    taskModal.classList.remove('hidden');
    taskModal.classList.add('flex');
    taskText.focus();
}

function closeModal() {
    taskModal.classList.add('hidden');
    taskModal.classList.remove('flex');
    taskForm.reset();
    taskPriority.value = 'medium';
}

function handleTaskSubmit(e) {
    e.preventDefault();
    const text = taskText.value.trim();
    const priority = taskPriority.value;
    const status = taskStatus.value;
    
    if (text) {
        createTask(text, priority, status);
        closeModal();
    }
}

// Filter Management
function setFilter(filter) {
    currentFilter = filter;
    
    // Update button states
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    });
    
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => task.status !== 'done');
        case 'completed':
            return tasks.filter(task => task.status === 'done');
        default:
            return tasks;
    }
}

// Render Tasks
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Clear all task containers
    document.getElementById('todoTasks').innerHTML = '';
    document.getElementById('doingTasks').innerHTML = '';
    document.getElementById('doneTasks').innerHTML = '';
    
    // Group tasks by status
    const todoTasks = filteredTasks.filter(task => task.status === 'todo');
    const doingTasks = filteredTasks.filter(task => task.status === 'doing');
    const doneTasks = filteredTasks.filter(task => task.status === 'done');
    
    // Render tasks in each column
    todoTasks.forEach(task => document.getElementById('todoTasks').appendChild(createTaskElement(task)));
    doingTasks.forEach(task => document.getElementById('doingTasks').appendChild(createTaskElement(task)));
    doneTasks.forEach(task => document.getElementById('doneTasks').appendChild(createTaskElement(task)));
    
    // Update counters
    document.getElementById('todoCount').textContent = todoTasks.length;
    document.getElementById('doingCount').textContent = doingTasks.length;
    document.getElementById('doneCount').textContent = doneTasks.length;
    
    // Show/hide empty placeholders
    toggleEmptyPlaceholder('todo', todoTasks.length);
    toggleEmptyPlaceholder('doing', doingTasks.length);
    toggleEmptyPlaceholder('done', doneTasks.length);
    
    // Re-setup drag and drop for new elements
    setupDragAndDrop();
}

function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task-card animate-fade-in';
    taskEl.draggable = true;
    taskEl.dataset.id = task.id;
    
    const priorityClass = `priority-${task.priority}`;
    const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    
    taskEl.innerHTML = `
        <div class="flex justify-between items-start gap-2 mb-2">
            <span class="priority-tag ${priorityClass}">${priorityLabel}</span>
            <button class="delete-btn text-gray-400 hover:text-red-500 transition-colors" data-id="${task.id}" aria-label="Delete task">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <p class="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">${escapeHtml(task.text)}</p>
    `;
    
    // Delete button event
    const deleteBtn = taskEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    return taskEl;
}

function toggleEmptyPlaceholder(status, taskCount) {
    const emptyEl = document.getElementById(`${status}Empty`);
    if (taskCount === 0) {
        emptyEl.classList.remove('hidden');
    } else {
        emptyEl.classList.add('hidden');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Drag and Drop
function setupDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    const columns = document.querySelectorAll('.column');
    
    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedTask = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(col => {
        col.classList.remove('drag-over');
    });
    draggedTask = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const column = e.target.closest('.column');
    if (column) {
        column.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const column = e.target.closest('.column');
    if (column && !column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (!column || !draggedTask) return;
    
    const taskId = e.dataTransfer.getData('text/plain');
    const newStatus = column.dataset.status;
    
    updateTaskStatus(taskId, newStatus);
    column.classList.remove('drag-over');
}
