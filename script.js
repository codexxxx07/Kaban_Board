// Kanban Board Application
// State Management (encapsulated in IIFE to avoid global pollution)
(() => {
    'use strict';

    // Private state
    const state = {
        tasks: [],
        currentFilter: 'all',
        draggedTask: null,
        isSubmitting: false,
        lastActionTime: 0
    };

    // DOM Elements (cached)
    const DOM = {
        taskModal: null,
        taskForm: null,
        taskText: null,
        taskPriority: null,
        taskStatus: null,
        cancelModal: null,
        themeToggle: null,
        filterButtons: null,
        addTaskButtons: null,
        kanbanBoard: null,
        skeletonLoader: null,
        todoTasks: null,
        doingTasks: null,
        doneTasks: null,
        todoCount: null,
        doingCount: null,
        doneCount: null,
        todoEmpty: null,
        doingEmpty: null,
        doneEmpty: null
    };

    // Rate limiting configuration
    const RATE_LIMIT = {
        TASK_CREATE: 1000, // 1 second between task creations
        DRAG_THROTTLE: 100 // 100ms throttle for drag events
    };

    // Initialize Application
    document.addEventListener('DOMContentLoaded', () => {
        cacheDOMElements();
        loadTheme();
        loadTasks();
        renderTasks();
        setupEventListeners();
        handleSkeletonLoading();
    });

// Cache DOM Elements
    function cacheDOMElements() {
        DOM.taskModal = document.getElementById('taskModal');
        DOM.taskForm = document.getElementById('taskForm');
        DOM.taskText = document.getElementById('taskText');
        DOM.taskPriority = document.getElementById('taskPriority');
        DOM.taskStatus = document.getElementById('taskStatus');
        DOM.cancelModal = document.getElementById('cancelModal');
        DOM.themeToggle = document.getElementById('themeToggle');
        DOM.filterButtons = document.querySelectorAll('.filter-btn');
        DOM.addTaskButtons = document.querySelectorAll('.add-task-btn');
        DOM.kanbanBoard = document.getElementById('kanbanBoard');
        DOM.skeletonLoader = document.getElementById('skeletonLoader');
        DOM.todoTasks = document.getElementById('todoTasks');
        DOM.doingTasks = document.getElementById('doingTasks');
        DOM.doneTasks = document.getElementById('doneTasks');
        DOM.todoCount = document.getElementById('todoCount');
        DOM.doingCount = document.getElementById('doingCount');
        DOM.doneCount = document.getElementById('doneCount');
        DOM.todoEmpty = document.getElementById('todoEmpty');
        DOM.doingEmpty = document.getElementById('doingEmpty');
        DOM.doneEmpty = document.getElementById('doneEmpty');
    }

    // Skeleton Loading
    function handleSkeletonLoading() {
        if (!DOM.skeletonLoader || !DOM.kanbanBoard) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.skeletonLoader.style.display = 'none';
                DOM.kanbanBoard.classList.remove('hidden');
                DOM.kanbanBoard.classList.add('animate-fade-in');
            }, 1200);
        });
    }

// Event Listeners Setup
    function setupEventListeners() {
        if (!DOM.themeToggle || !DOM.cancelModal || !DOM.taskModal || !DOM.taskForm) return;

        // Theme Toggle
        DOM.themeToggle.addEventListener('click', toggleTheme);
        
        // Filter Buttons
        DOM.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => setFilter(btn.dataset.filter));
        });
        
        // Add Task Buttons
        DOM.addTaskButtons.forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.status));
        });
        
        // Modal Controls
        DOM.cancelModal.addEventListener('click', closeModal);
        DOM.taskModal.addEventListener('click', (e) => {
            if (e.target === DOM.taskModal) closeModal();
        });
        
        // Task Form Submit
        DOM.taskForm.addEventListener('submit', handleTaskSubmit);
        
        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !DOM.taskModal.classList.contains('hidden')) {
                closeModal();
            }
        });
        
        // Event Delegation for delete buttons
        document.addEventListener('click', handleDelegatedClick);
        
        // Drag and Drop Setup
        setupDragAndDrop();
    }

// Theme Management
    function loadTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.documentElement.classList.remove('dark');
            } else if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        try {
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

// Task Management
    function loadTasks() {
        try {
            const savedTasks = localStorage.getItem('kanbanTasks');
            if (savedTasks) {
                const parsedTasks = JSON.parse(savedTasks);
                // Validate data structure
                if (Array.isArray(parsedTasks)) {
                    state.tasks = parsedTasks.filter(task => {
                        return task && 
                               typeof task.id === 'string' && 
                               typeof task.text === 'string' && 
                               typeof task.priority === 'string' && 
                               typeof task.status === 'string';
                    });
                }
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            localStorage.removeItem('kanbanTasks');
            state.tasks = [];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem('kanbanTasks', JSON.stringify(state.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

// Generate unique ID with collision prevention
    function generateUniqueId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${random}`;
    }

    // Sanitize user input
    function sanitizeInput(text) {
        if (typeof text !== 'string') return '';
        return text.trim().replace(/[<>]/g, '');
    }

    function createTask(text, priority, status) {
        // Rate limiting check
        const now = Date.now();
        if (now - state.lastActionTime < RATE_LIMIT.TASK_CREATE) {
            console.warn('Task creation rate limited');
            return;
        }
        state.lastActionTime = now;

        // Validate inputs
        const sanitizedText = sanitizeInput(text);
        if (!sanitizedText) {
            console.warn('Empty task text after sanitization');
            return;
        }

        const validPriorities = ['low', 'medium', 'high'];
        const validStatuses = ['todo', 'doing', 'done'];
        
        if (!validPriorities.includes(priority)) priority = 'medium';
        if (!validStatuses.includes(status)) status = 'todo';

        const task = {
            id: generateUniqueId(),
            text: sanitizedText,
            priority: priority,
            status: status,
            createdAt: new Date().toISOString()
        };
        state.tasks.push(task);
        saveTasks();
        renderTasks();
    }

function deleteTask(id) {
        if (!id) return;
        state.tasks = state.tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function updateTaskStatus(id, newStatus) {
        if (!id || !newStatus) return;
        const task = state.tasks.find(t => t.id === id);
        if (task) {
            const validStatuses = ['todo', 'doing', 'done'];
            if (validStatuses.includes(newStatus)) {
                task.status = newStatus;
                saveTasks();
                renderTasks();
            }
        }
    }

// Modal Management
    function openModal(status = 'todo') {
        if (!DOM.taskStatus || !DOM.taskModal || !DOM.taskText) return;
        DOM.taskStatus.value = status;
        DOM.taskModal.classList.remove('hidden');
        DOM.taskModal.classList.add('flex');
        DOM.taskText.focus();
    }

    function closeModal() {
        if (!DOM.taskModal || !DOM.taskForm || !DOM.taskPriority) return;
        DOM.taskModal.classList.add('hidden');
        DOM.taskModal.classList.remove('flex');
        DOM.taskForm.reset();
        DOM.taskPriority.value = 'medium';
    }

function handleTaskSubmit(e) {
        e.preventDefault();
        
        if (state.isSubmitting) return;
        state.isSubmitting = true;

        try {
            const text = DOM.taskText ? DOM.taskText.value : '';
            const priority = DOM.taskPriority ? DOM.taskPriority.value : 'medium';
            const status = DOM.taskStatus ? DOM.taskStatus.value : 'todo';
            
            if (text) {
                createTask(text, priority, status);
                closeModal();
            }
        } catch (error) {
            console.error('Error handling task submit:', error);
        } finally {
            // Reset submission state after delay
            setTimeout(() => {
                state.isSubmitting = false;
            }, RATE_LIMIT.TASK_CREATE);
        }
    }

// Filter Management
    function setFilter(filter) {
        state.currentFilter = filter;
        
        // Update button states
        DOM.filterButtons.forEach(btn => {
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
        switch (state.currentFilter) {
            case 'active':
                return state.tasks.filter(task => task.status !== 'done');
            case 'completed':
                return state.tasks.filter(task => task.status === 'done');
            default:
                return state.tasks;
        }
    }

// Render Tasks (optimized with document fragment)
    function renderTasks() {
        if (!DOM.todoTasks || !DOM.doingTasks || !DOM.doneTasks) return;

        const filteredTasks = getFilteredTasks();
        
        // Clear all task containers
        DOM.todoTasks.innerHTML = '';
        DOM.doingTasks.innerHTML = '';
        DOM.doneTasks.innerHTML = '';
        
        // Group tasks by status
        const todoTasks = filteredTasks.filter(task => task.status === 'todo');
        const doingTasks = filteredTasks.filter(task => task.status === 'doing');
        const doneTasks = filteredTasks.filter(task => task.status === 'done');
        
        // Use document fragments for better performance
        const todoFragment = document.createDocumentFragment();
        const doingFragment = document.createDocumentFragment();
        const doneFragment = document.createDocumentFragment();
        
        todoTasks.forEach(task => todoFragment.appendChild(createTaskElement(task)));
        doingTasks.forEach(task => doingFragment.appendChild(createTaskElement(task)));
        doneTasks.forEach(task => doneFragment.appendChild(createTaskElement(task)));
        
        DOM.todoTasks.appendChild(todoFragment);
        DOM.doingTasks.appendChild(doingFragment);
        DOM.doneTasks.appendChild(doneFragment);
        
        // Update counters
        if (DOM.todoCount) DOM.todoCount.textContent = todoTasks.length;
        if (DOM.doingCount) DOM.doingCount.textContent = doingTasks.length;
        if (DOM.doneCount) DOM.doneCount.textContent = doneTasks.length;
        
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
        
            const prioritySpan = document.createElement('span');
            prioritySpan.className = `priority-tag ${priorityClass}`;
            prioritySpan.textContent = priorityLabel;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn text-gray-400 hover:text-red-500 transition-colors';
            deleteBtn.dataset.id = task.id;
            deleteBtn.setAttribute('aria-label', 'Delete task');
            deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex justify-between items-start gap-2 mb-2';
            headerDiv.appendChild(prioritySpan);
            headerDiv.appendChild(deleteBtn);
            
            const textP = document.createElement('p');
            textP.className = 'text-gray-800 dark:text-gray-300 text-sm leading-relaxed';
            textP.textContent = task.text; // Safe: textContent prevents XSS
            
            taskEl.appendChild(headerDiv);
            taskEl.appendChild(textP);
        
        return taskEl;
    }

    // Event delegation for delete buttons
    function handleDelegatedClick(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn && deleteBtn.dataset.id) {
            deleteTask(deleteBtn.dataset.id);
        }
    }

function toggleEmptyPlaceholder(status, taskCount) {
        const emptyEl = document.getElementById(`${status}Empty`);
        if (emptyEl) {
            if (taskCount === 0) {
                emptyEl.classList.remove('hidden');
            } else {
                emptyEl.classList.add('hidden');
            }
        }
    }

// Drag and Drop (with throttling)
    let dragThrottleTimer = null;

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
        if (!e.target.dataset.id) return;
        state.draggedTask = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }

    function handleDragEnd(e) {
        if (!e.target) return;
        e.target.classList.remove('dragging');
        document.querySelectorAll('.column').forEach(col => {
            col.classList.remove('drag-over');
        });
        state.draggedTask = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
        
        // Throttle drag events
        if (dragThrottleTimer) return;
        dragThrottleTimer = setTimeout(() => {
            dragThrottleTimer = null;
        }, RATE_LIMIT.DRAG_THROTTLE);
        
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
        if (!column || !state.draggedTask) return;
        
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = column.dataset.status;
        
        updateTaskStatus(taskId, newStatus);
        column.classList.remove('drag-over');
    }
})();
