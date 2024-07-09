import "./styles.css";

let activeList = "Inbox";
let tasks; // the object that the session works with, and then writes to the storage if browser closoes/reloads

// Retrieve data from localStorage when window loads
window.onload = function () {
    const savedData = JSON.parse(window.localStorage.getItem("tasksData"));
    if (savedData) {
        tasks = savedData;
        console.log(`Retreived data succesfully!`);
    } else {
        tasks = tasksInit();
    }
    renderLists();
    switchToList(activeList);
};

function tasksInit() {
    return {
        Inbox: {
            // taskname: {taskName: "", taskDate: "", taskDesc: "", taskPrior: "", taskStatus: bool},
        },
    };
}

// task constructor
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
const curListDOM = document.querySelector(".current-list");
curListDOM.innerText = activeList;

const tasksContainer = document.querySelector(".tasks");
const formDiv = document.querySelector(".add-task-dlg");
const form = document.querySelector("form");

function addTaskToDom(newTaskName) {
    // add the given (taskName) task to the it to the dom
    let newTask = tasks[activeList][newTaskName];
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
    if (newTask.taskStatus) {
        taskNameDiv.classList.add("done");
    }
    taskNameDiv.innerText = newTask.taskName;
    taskDetailsDiv.appendChild(taskNameDiv);

    const dueDateDiv = document.createElement("div");
    dueDateDiv.classList.add("due-date", "task-list-name");
    dueDateDiv.innerText = newTask.taskDate;
    taskDetailsDiv.appendChild(dueDateDiv);

    const moreDetailsDiv = document.createElement("div");
    moreDetailsDiv.classList.add("more-details");
    const ulElement = document.createElement("ul");
    const descLi = document.createElement("li");
    descLi.classList.add("task-desc");
    descLi.innerText = newTask.taskDesc;
    const priorityLi = document.createElement("li");
    priorityLi.classList.add("task-priority");
    priorityLi.innerText = newTask.taskPrior;
    ulElement.appendChild(descLi);
    ulElement.appendChild(priorityLi);
    moreDetailsDiv.appendChild(ulElement);

    taskDetailsDiv.appendChild(moreDetailsDiv);

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
        alert("Same task already exists!");
        form.reset();
        return;
    } else if (newTaskName == "") {
        alert("Task name can't be empty");
        return;
    }
    if (newTaskDate == "") {
        newTaskDate = activeList[0].toUpperCase() + activeList.substring(1);
    }
    let submittedPrior = document.querySelector('input[name="taskPriority"]:checked');
    let newTaskPrior = submittedPrior == null ? "Any" : submittedPrior.value;
    let newTask = createTask(document.querySelector("#taskName").value, newTaskDate, document.querySelector("#taskDesc").value, newTaskPrior);
    tasks[activeList][newTask.taskName] = newTask;
    formDiv.style.display = "none";
    addTaskToDom(newTask.taskName);
    form.reset();
});
document.querySelector("#form-cancel").addEventListener("click", () => {
    formDiv.style.display = "none";
    form.reset();
});

// add event listeners for options in the task
tasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("check-box")) {
        let currentTaskName = e.target.nextElementSibling.innerText;
        tasks[activeList][currentTaskName].taskStatus = !tasks[activeList][currentTaskName].taskStatus;
        e.target.nextElementSibling.classList.toggle("done");
    } else if (e.target.classList.contains("remove")) {
        let currentTaskName = e.target.parentElement.previousElementSibling.firstElementChild.nextElementSibling.innerText;
        delete tasks[activeList][currentTaskName];
        e.target.parentElement.parentElement.remove();
    } else if (e.target.classList.contains("task-name")) {
        e.target.nextElementSibling.nextElementSibling.classList.toggle("expanded");
    }
});

// delete options
document.querySelector("#clear-done").addEventListener("click", () => {
    for (let curTaskName in tasks[activeList]) {
        let curTask = tasks[activeList][curTaskName];
        if (curTask.taskStatus == true) {
            delete tasks[activeList][curTaskName];
        }
    }
    for (let i = tasksContainer.children.length - 1; i >= 0; i--) {
        if (tasksContainer.children[i].firstElementChild.firstElementChild.nextElementSibling.classList.contains("done")) {
            tasksContainer.children[i].remove();
        }
    }
});
document.querySelector("#delete-all").addEventListener("click", () => {
    let toDelete = activeList;
    if (toDelete == "Inbox") {
        alert("Default list can't be deleted.");
        return;
    }
    delete tasks[toDelete];
    switchToList("Inbox");
    document.querySelectorAll(".user-list").forEach((elem) => {
        if (elem.children[1].innerText == toDelete) {
            elem.remove();
            return;
        }
    });
});


// list functionality
function renderListToDOM(newListName) {
    const userListLi = document.createElement("li");
    userListLi.classList.add("user-list", "task-list");

    const iconDiv = document.createElement("div");
    iconDiv.classList.add("icon");

    const imgElement = document.createElement("img");
    imgElement.src = "img/list.svg";
    imgElement.alt = "";

    iconDiv.appendChild(imgElement);

    const spanElement = document.createElement("span");
    spanElement.innerText = newListName;

    userListLi.appendChild(iconDiv);
    userListLi.appendChild(spanElement);

    document.querySelector(".user-lists > ul").appendChild(userListLi);
}

function createNewTaskList(newListName) {
    if (newListName in tasks) {
        alert("The list already exists");
        return;
    }
    tasks[newListName] = {};
    renderListToDOM(newListName);
    activeList = newListName;
    curListDOM.innerText = newListName;
    tasksContainer.innerHTML = "";
}

function switchToList(listName) {
    activeList = listName;
    curListDOM.innerText = listName;
    tasksContainer.innerHTML = "";
    for (let curTask in tasks[activeList]) {
        addTaskToDom(tasks[activeList][curTask].taskName);
    }
}

function renderLists() {
    for (let curList in tasks) {
        if (curList == "Inbox") {
            continue;
        }
        renderListToDOM(curList);
    }
}

// new list button
document.querySelector(".new-list").addEventListener("click", () => {
    let newListName = prompt("Enter new list name: ");
    if (newListName) {
        createNewTaskList(newListName);
    } else {
        return;
    }
});
// switching list event
document.querySelector(".side-bar").addEventListener("click", (e) => {
    const taskListItem = e.target.closest(".task-list");
    if (taskListItem) {
        switchToList(taskListItem.querySelector("span").innerText);
    }
});


// function for checking local storage support and availability
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
if (!storageAvailable("localStorage")) {
    alert("Your browser/window type doesn't support storage facility");
}
// Save data to localStorage
window.onbeforeunload = function () {
    window.localStorage.setItem("tasksData", JSON.stringify(tasks));
};

