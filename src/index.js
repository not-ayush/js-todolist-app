import "./styles.css";
import { tasks } from "./lib/tasks";

let activeList = "inbox";

function createTask(taskName, taskDate, taskDesc, taskPrior) {
    return {
        taskName,
        taskDate,
        taskDesc,
        taskPrior,
        taskStatus: false,
    };
}

//update default page data
const options = { weekday: "long", day: "numeric", month: "long" };
const formattedDate = new Date().toLocaleDateString("en-US", options);
document.querySelector(".current-date").innerText = formattedDate;
const listNameDOM = document.querySelector(".current-list");
listNameDOM.innerText = "Inbox";

const tasksContainer = document.querySelector(".tasks");
const formDiv = document.querySelector(".add-task-dlg");
const form = document.querySelector("form");

function addNewTaskToDom(newTaskName) {
    // check the latest task in the module, and add it to the dom
    let latestTask = tasks[activeList][newTaskName];
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    const taskDetailsDiv = document.createElement("div");
    taskDetailsDiv.classList.add("task-details");

    const checkBoxImg = document.createElement("img");
    checkBoxImg.classList.add("check-box");
    checkBoxImg.src = "./img/check.svg";
    checkBoxImg.alt = "";
    taskDetailsDiv.appendChild(checkBoxImg);

    const taskNameDiv = document.createElement("div");
    taskNameDiv.classList.add("task-name");
    taskNameDiv.innerText = latestTask.taskName;
    taskDetailsDiv.appendChild(taskNameDiv);

    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add("due-date", "task-list-name");
    dueDateDiv.innerText = latestTask.taskDate;
    taskDetailsDiv.appendChild(dueDateDiv);

    taskDiv.appendChild(taskDetailsDiv);

    const taskOptDiv = document.createElement("div");
    taskOptDiv.classList.add("task-opt");

    const removeImg = document.createElement("img");
    removeImg.classList.add("remove");
    removeImg.src = "./img/remove.svg";
    removeImg.alt = "";
    taskOptDiv.appendChild(removeImg);

    taskDiv.appendChild(taskOptDiv);

    tasksContainer.appendChild(taskDiv);
}

// show form dialogue on add task click, then user clicks submit, add the data to tasks module and dom.
document.querySelector(".add-btn").addEventListener("click", () => {
    formDiv.style.display = "block";
});
document.querySelector("#form-submit").addEventListener("click", () => {
    let newTaskDate = document.querySelector("#taskDate").value;
    let newTaskName = document.querySelector("#taskName").value;
    if (newTaskName in tasks[activeList]) {
        alert("Same task already exists!")
        form.reset()
        return
    } else if (newTaskName == "") {
        alert("Task name can't be empty")
        return
    }
    if (newTaskDate == "") {
        newTaskDate = activeList[0].toUpperCase() + activeList.substring(1);
    }
    let submittedPrior = document.querySelector('input[name="taskPriority"]:checked');
    let newTaskPrior = submittedPrior == null ? "Any" : submittedPrior.value;
    let newTask = createTask(
        document.querySelector("#taskName").value, 
        newTaskDate, 
        document.querySelector("#taskDesc").value, 
        newTaskPrior
    );
    tasks[activeList][newTask.taskName] = newTask;
    formDiv.style.display = "none";
    addNewTaskToDom(newTask.taskName);
    form.reset();
});
document.querySelector("#form-cancel").addEventListener("click", () => {
    formDiv.style.display = "none";
    form.reset();
});

// add event listeners for mark as done and remove
tasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("check-box")) {
        let currentTaskName = e.target.nextElementSibling.innerText;
        tasks[activeList][currentTaskName].taskStatus = !tasks[activeList][currentTaskName].taskStatus;
        e.target.nextElementSibling.classList.toggle("done");
    } else if (e.target.classList.contains("remove")) {
        let currentTaskName = e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.innerText;
        delete tasks[activeList][currentTaskName];
        e.target.parentElement.parentElement.remove();
    }
});

document.querySelector("#clear-done").addEventListener("click", () => {
    for (let curTaskName in tasks[activeList]) {
        let curTask = tasks[activeList][curTaskName];
        if (curTask.taskStatus == true) {
            delete tasks[activeList][curTaskName];
        }
    }
    for (let i = 0; i < tasksContainer.children.length; i++) {
        if (tasksContainer.children[i].firstElementChild.firstElementChild.nextElementSibling.classList.contains("done")) {
            tasksContainer.children[i].remove();
        }
    }
});
document.querySelector("#delete-all").addEventListener("click", () => {
    tasks[activeList] = {};
    tasksContainer.innerHTML = "";
});

