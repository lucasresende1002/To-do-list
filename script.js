document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('tarefaDate');
    // definir data padrão para hoje
    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');
    if(dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
    renderColumns();
});

function loadTasks(){
    try{
        return JSON.parse(localStorage.getItem('tasksByDate') || '{}');
    }catch(e){
        return {};
    }
}

function saveTasks(obj){
    localStorage.setItem('tasksByDate', JSON.stringify(obj));
}

function formatDateDisplay(isoDate){
    if(!isoDate) return '';
    const parts = isoDate.split('-');
    if(parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function adicionarTarefa(){
    const input = document.getElementById('tarefaInput');
    const dateInput = document.getElementById('tarefaDate');
    const tarefa = input.value.trim();
    const date = dateInput ? dateInput.value : '';
    if(!tarefa) return;
    if(!date) {
        alert('Selecione uma data para a tarefa.');
        return;
    }
    const tasksByDate = loadTasks();
    if(!tasksByDate[date]) tasksByDate[date] = [];
    const newTask = { id: Date.now(), text: tarefa, completed: false };
    tasksByDate[date].push(newTask);
    saveTasks(tasksByDate);
    input.value = '';
    renderColumns();
}

function removeTask(date, id){
    const tasksByDate = loadTasks();
    if(!tasksByDate[date]) return;
    tasksByDate[date] = tasksByDate[date].filter(t => t.id !== id);
    if(tasksByDate[date].length === 0) delete tasksByDate[date];
    saveTasks(tasksByDate);
    renderColumns();
}

function saveEdit(date, id, newText){
    const tasksByDate = loadTasks();
    if(!tasksByDate[date]) return;
    const task = tasksByDate[date].find(t => t.id === id);
    if(!task) return;
    task.text = newText;
    saveTasks(tasksByDate);
    renderColumns();
}

function toggleComplete(date, id){
    const tasksByDate = loadTasks();
    if(!tasksByDate[date]) return;
    const task = tasksByDate[date].find(t => t.id === id);
    if(!task) return;
    task.completed = !task.completed;
    saveTasks(tasksByDate);
    renderColumns();
}

function moveTask(sourceDate, id, targetDate){
    if(sourceDate === targetDate) return;
    const tasksByDate = loadTasks();
    if(!tasksByDate[sourceDate]) return;
    const idx = tasksByDate[sourceDate].findIndex(t => t.id === id);
    if(idx === -1) return;
    const [task] = tasksByDate[sourceDate].splice(idx,1);
    if(tasksByDate[sourceDate].length === 0) delete tasksByDate[sourceDate];
    if(!tasksByDate[targetDate]) tasksByDate[targetDate] = [];
    tasksByDate[targetDate].push(task);
    saveTasks(tasksByDate);
    renderColumns();
}

function renderColumns(){
    const container = document.getElementById('columns');
    if(!container) return;
    container.innerHTML = '';
    const tasksByDate = loadTasks();
    const dates = Object.keys(tasksByDate).sort();
    if(dates.length === 0){
        const p = document.createElement('p');
        p.className = 'empty-msg';
        p.textContent = 'Nenhuma tarefa adicionada.';
        container.appendChild(p);
        return;
    }
    dates.forEach(date => {
        const col = document.createElement('div');
        col.className = 'date-column';

        const header = document.createElement('div');
        header.className = 'date-header';
        header.textContent = formatDateDisplay(date);
        col.appendChild(header);

        const list = document.createElement('div');
        list.className = 'date-list';

        // droppable + hover-to-move support
        let hoverTimer = null;
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        list.addEventListener('dragenter', (e) => {
            e.preventDefault();
            // start hover timer to auto-move after 600ms
            if(window.__dragPayload && !hoverTimer){
                hoverTimer = setTimeout(() => {
                    const p = window.__dragPayload;
                    if(p && p.id) moveTask(p.date, p.id, date);
                    hoverTimer = null;
                }, 600);
            }
        });
        list.addEventListener('dragleave', (e) => {
            if(hoverTimer){
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        });
        list.addEventListener('drop', (e) => {
            e.preventDefault();
            if(hoverTimer){
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            let data = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
            if(!data){
                const p = window.__dragPayload;
                if(p && p.id) moveTask(p.date, p.id, date);
                return;
            }
            try{
                const parsed = JSON.parse(data);
                if(parsed && parsed.id && parsed.date){
                    moveTask(parsed.date, parsed.id, date);
                }
            }catch(_){
                // fallback: if only id provided
                const parts = data.split('|');
                if(parts.length === 2){
                    const sid = Number(parts[0]);
                    const sdate = parts[1];
                    moveTask(sdate, sid, date);
                }
            }
        });

        tasksByDate[date].forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';
            taskDiv.draggable = true;
            taskDiv.dataset.id = task.id;
            taskDiv.dataset.date = date;

            taskDiv.addEventListener('dragstart', (e) => {
                const payload = JSON.stringify({ id: task.id, date });
                e.dataTransfer.setData('application/json', payload);
                // for fallback
                e.dataTransfer.setData('text/plain', `${task.id}|${date}`);
                // store payload globally for hover-move support
                window.__dragPayload = { id: task.id, date };
            });
            taskDiv.addEventListener('dragend', () => {
                // clear global payload when drag ends
                window.__dragPayload = null;
            });

            const controls = document.createElement('div');

            // checkbox to mark complete
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !!task.completed;
            checkbox.title = 'Concluir tarefa';
            checkbox.style.marginRight = '8px';
            checkbox.onchange = () => toggleComplete(date, task.id);

            const spanText = document.createElement('span');
            spanText.textContent = task.text;
            spanText.style.marginRight = '10px';
            spanText.style.wordBreak = 'break-word';
            if(task.completed){
                spanText.classList.add('task-completed');
            }

            if(task.completed){
                taskDiv.classList.add('completed');
            }

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.title = 'Editar';
            editBtn.onclick = () => {
                // replace text with input and add date editor next to it
                const input = document.createElement('input');
                input.className = 'task-input-edit';
                input.value = task.text;

                // date input for moving while editing
                const dateEditor = document.createElement('input');
                dateEditor.type = 'date';
                dateEditor.className = 'task-date-input';
                dateEditor.value = date;

                // build a small wrapper
                const editWrapper = document.createElement('div');
                editWrapper.style.display = 'flex';
                editWrapper.style.gap = '6px';
                editWrapper.style.alignItems = 'center';
                editWrapper.appendChild(input);
                editWrapper.appendChild(dateEditor);

                taskDiv.replaceChild(editWrapper, spanText);
                editBtn.textContent = '💾';
                // save handler
                editBtn.onclick = () => {
                    const newText = input.value.trim();
                    const newDate = dateEditor.value;
                    if(newText) saveEdit(date, task.id, newText);
                    if(newDate && newDate !== date) moveTask(date, task.id, newDate);
                };
            };

            const dateBtn = document.createElement('button');
            dateBtn.textContent = '📅';
            dateBtn.title = 'Mudar data';
            dateBtn.onclick = () => {
                let existing = taskDiv.querySelector('.task-date-input');
                if(existing){
                    existing.remove();
                    return;
                }
                const mover = document.createElement('input');
                mover.type = 'date';
                mover.className = 'task-date-input';
                mover.value = date;
                mover.onchange = () => {
                    const newDate = mover.value;
                    if(newDate && newDate !== date){
                        moveTask(date, task.id, newDate);
                    }
                };
                taskDiv.insertBefore(mover, controls);
            };

            const del = document.createElement('button');
            del.textContent = '❌';
            del.title = 'Remover';
            del.onclick = () => removeTask(date, task.id);

            controls.appendChild(editBtn);
            controls.appendChild(dateBtn);
            controls.appendChild(del);

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(spanText);
            taskDiv.appendChild(controls);

            list.appendChild(taskDiv);
        });

        col.appendChild(list);
        container.appendChild(col);
    });
}