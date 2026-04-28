

let currentFilter = "all"

const inputDOM = document.querySelector("#todolist")
const buttonDOM = document.querySelector("#addBtn")
const listDOM = document.querySelector("#taskList")
const editDOM = document.querySelector("#btnEditDelete")


//////////////////////////////// localStorage /////////////////////////////////////////////////


let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// svg

const editSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>
`

const deleteSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
`

//////////////////////////////// dino progress /////////////////////////////////////////////////

function updateProgress() {
    const dino = document.querySelector(".dino")
    const box = document.querySelector(".progress-box")

    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length

    if (total === 0) {
        dino.style.left = "0px"
        return
    }

    const percent = completed / total

    const maxMove = box.clientWidth - dino.clientWidth
    const move = maxMove * percent

    dino.style.left = move + "px"

//////////////////////////////// jump trigger /////////////////////////////////////////////////

    if (percent === 1) {
        dino.classList.add("jump")

        dino.addEventListener("animationend", () => {
    dino.classList.remove("jump")
})
    }
}
function updateGround() {
    const ground = document.querySelector(".ground")

    if (tasks.length > 0) {
        ground.style.animationPlayState = "running"
    } else {
        ground.style.animationPlayState = "paused"
    }
}

//////////////////////////////// render /////////////////////////////////////////////////

function renderTasks() {
    listDOM.innerHTML = ""

    let filteredTasks = tasks

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed)
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed)
    }

    filteredTasks.forEach((task, index) => {
        const liDOM = document.createElement("li")
        liDOM.classList.add("sec-list")

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = task.completed
        checkbox.classList.add("checkbox")

        const span = document.createElement("span")
        span.classList.add("span")
        span.textContent = task.text

        if (task.completed) {
            span.classList.add("completed")
        }

        const btnGroup = document.createElement("div")

        const editBtn = document.createElement("button")
        editBtn.innerHTML = editSVG
        editBtn.classList.add("btn-edit")

        const deleteBtn = document.createElement("button")
        deleteBtn.innerHTML = deleteSVG
        deleteBtn.classList.add("btn-delete")

        // checkbox
        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked
            saveTasks()
            renderTasks()
        })

        // delete
        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1)
            saveTasks()
            renderTasks()
        })

        // edit
        editBtn.addEventListener("click", function () {
            const newTask = prompt("Yeni görev:")

            if (newTask !== null && newTask.trim() !== "") {
                tasks[index].text = newTask
                saveTasks()
                renderTasks()
            }
        })

        btnGroup.appendChild(editBtn)
        btnGroup.appendChild(deleteBtn)

        liDOM.appendChild(checkbox)
        liDOM.appendChild(span)
        liDOM.appendChild(btnGroup)

        listDOM.appendChild(liDOM)
    })
    updateGround()
    updateProgress()
}

//////////////////////////////// filter buttons /////////////////////////////////////////////////


document.querySelector("#allBtn").addEventListener("click", () => {
    currentFilter = "all"
    renderTasks()
})

document.querySelector("#activeBtn").addEventListener("click", () => {
    currentFilter = "active"
    renderTasks()
})

document.querySelector("#completedBtn").addEventListener("click", () => {
    currentFilter = "completed"
    renderTasks()
})

document.querySelector("#clearAll").addEventListener("click", () => {
    tasks = []
    saveTasks()
    renderTasks()
})



//////////////////////////////// add function /////////////////////////////////////////////////


function addTask() {
    const taskText = inputDOM.value.trim()
    if (taskText === "") return

    tasks.push({
        text: taskText,
        completed: false
    })

    saveTasks()
    renderTasks()

    inputDOM.value = ""
}

function updateDateTime() {
    const now = new Date();
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formattedDate = now.toLocaleDateString('tr-TR', options);
    
    document.querySelector('#datetime').textContent = formattedDate;
}

updateDateTime();

setInterval(updateDateTime, 60000);

buttonDOM.addEventListener("click", addTask)



inputDOM.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask()
    }
})

renderTasks()

