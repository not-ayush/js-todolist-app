import "./styles.css";
import { tasks } from "./lib/tasks";

let activeList = "inbox";

function createTask(taskName, taskDate, taskDesc, taskPrior) {
    return {
        taskName,
        taskDate,
        taskDesc: taskDesc ? taskDesc : "no desc",
        taskPrior: taskPrior ? taskPrior : 0,
        taskStatus: false,
    };
}

//update date
const options = { weekday: "long", day: "numeric", month: "long" };
const formattedDate = new Date().toLocaleDateString("en-US", options);
document.querySelector(".current-date").innerText = formattedDate;

// query dom elements
const tasksContainer = document.querySelector(".tasks");
const formDiv = document.querySelector(".add-task-dlg");

function addNewTaskToDom() {
    // check the latest task in the module, and add it to the dom
    let latestTask = tasks[activeList][tasks[activeList].length - 1];
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
    if (newTaskDate == '') {newTaskDate = activeList[0].toUpperCase() + activeList.substring(1)}
    let newTask = createTask(
        document.querySelector("#taskName").value,
        newTaskDate,
        document.querySelector('#taskDesc').value,
        document.querySelector('input[name="taskPriority"]:checked').value,
    );
    tasks[activeList].push(newTask);
    formDiv.style.display = "none";
    addNewTaskToDom();
    document.querySelector("form").reset();
});
document.querySelector('#form-cancel').addEventListener('click', () => {
    formDiv.style.display = "none";
    document.querySelector("form").reset();
})

// add event listeners for mark as done and remove
tasksContainer.addEventListener('click', (e) => {
})