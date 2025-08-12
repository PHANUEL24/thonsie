// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clearAllBtn');
const recycleBinBtn = document.getElementById('recycleBinBtn');
const recycleBinModal = document.getElementById('recycleBinModal');
const deletedTasksList = document.getElementById('deletedTasksList');
const restoreAllBtn = document.getElementById('restoreAllBtn');
const emptyBinBtn = document.getElementById('emptyBinBtn');
const closeModalBtn = document.querySelector('.close');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const deletedCountSpan = document.getElementById('deletedCount');
const notificationContainer = document.getElementById('notificationContainer');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderDeletedTasks();
    updateStats();
    updateDeletedCount();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearAllBtn.addEventListener('click', clearAllTasks);
recycleBinBtn.addEventListener('click', openRecycleBin);
closeModalBtn.addEventListener('click', closeRecycleBin);
restoreAllBtn.addEventListener('click', restoreAllTasks);
emptyBinBtn.addEventListener('click', emptyRecycleBin);

// Functions
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
        // Move to deleted tasks
        deletedTasks.unshift({
            ...taskToDelete,
            deletedAt: new Date().toISOString()
        });
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        saveDeletedTasks();
        renderTasks();
        renderDeletedTasks();
        updateStats();
        updateDeletedCount();
    }
}

function clearAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to clear all tasks?')) {
        // Move all tasks to deleted
        const tasksToDelete = tasks.map(task => ({
            ...task,
            deletedAt: new Date().toISOString()
        }));
        deletedTasks.unshift(...tasksToDelete);
        tasks = [];
        saveTasks();
        saveDeletedTasks();
        renderTasks();
        renderDeletedTasks();
        updateStats();
        updateDeletedCount();
    }
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <p>No tasks found!</p>
                <small>Add some tasks to get started.</small>
            </div>
        `;
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </li>
    `).join('');
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveDeletedTasks() {
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Recycle Bin Functions
function openRecycleBin() {
    recycleBinModal.style.display = 'block';
    renderDeletedTasks();
}

function closeRecycleBin() {
    recycleBinModal.style.display = 'none';
}

function restoreTask(id) {
    const taskToRestore = deletedTasks.find(task => task.id === id);
    if (taskToRestore) {
        tasks.unshift(taskToRestore);
        deletedTasks = deletedTasks.filter(task => task.id !== id);
        saveTasks();
        saveDeletedTasks();
        renderTasks();
        renderDeletedTasks();
        updateStats();
        updateDeletedCount();
    }
}

function restoreAllTasks() {
    if (deletedTasks.length === 0) {
        alert('No tasks to restore!');
        return;
    }
    
    tasks.unshift(...deletedTasks);
    deletedTasks = [];
    saveTasks();
    saveDeletedTasks();
    renderTasks();
    renderDeletedTasks();
    updateStats();
    updateDeletedCount();
    closeRecycleBin();
}

function emptyRecycleBin() {
    if (deletedTasks.length === 0) {
        alert('Recycle bin is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to permanently delete all tasks in the recycle bin?')) {
        deletedTasks = [];
        saveDeletedTasks();
        renderDeletedTasks();
        updateDeletedCount();
        closeRecycleBin();
    }
}

function renderDeletedTasks() {
    if (deletedTasks.length === 0) {
        deletedTasksList.innerHTML = `
            <div class="empty-state">
                <p>Recycle bin is empty!</p>
                <small>Deleted tasks will appear here.</small>
            </div>
        `;
        return;
    }
    
    deletedTasksList.innerHTML = deletedTasks.map(task => `
        <div class="deleted-task-item" data-id="${task.id}">
            <span class="deleted-task-text">${escapeHtml(task.text)}</span>
            <button class="restore-single-btn" onclick="restoreTask(${task.id})">Restore</button>
        </div>
    `).join('');
}

function updateDeletedCount() {
    deletedCountSpan.textContent = deletedTasks.length;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === recycleBinModal) {
        closeRecycleBin();
    }
});

// Additional features
taskInput.addEventListener('input', function() {
    if (this.value.length > 100) {
        this.value = this.value.substring(0, 100);
        showNotification('Task cannot be longer than 100 characters!', 'warning');
    }
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);

    const icon = document.createElement('span');
    icon.classList.add('notification-icon');
    icon.innerHTML = getIcon(type);

    const content = document.createElement('div');
    content.classList.add('notification-content');

    const msg = document.createElement('div');
    msg.classList.add('notification-message');
    msg.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('notification-close');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => closeNotification(notification);

    content.appendChild(msg);
    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);

    notificationContainer.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 3000);
}

function closeNotification(notification) {
    notification.classList.add('exit');
    notification.addEventListener('animationend', () => {
        notification.remove();
    });
}

function getIcon(type) {
    switch(type) {
        case 'success':
            return '&#10004;'; // checkmark
        case 'warning':
            return '&#9888;'; // warning sign
        case 'error':
            return '&#10060;'; // cross mark
        default:
            return '';
    }
}
