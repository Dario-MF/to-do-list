import './scss/main.scss';
import { v4 as uuidv4 } from 'uuid';

// Carga de local storage 
let pendingStorage = [];
let finishedStorage = [];
try {
    pendingStorage = JSON.parse(localStorage.getItem('pendingTask'));
    finishedStorage = JSON.parse(localStorage.getItem('finishedTask'));

    pendingStorage.forEach(task => printTask(task, "pendingList"));
    finishedStorage.forEach(task => printTask(task, "performList"));

} catch{
    console.log('No hay datos en el storage')
}

sendStorage('pendingTask', pendingStorage);
sendStorage('finishedTask', finishedStorage);

//funcionalidad de los botones del modal.
document.getElementById('newTask').addEventListener("click", showModal, false);
document.getElementById('close-modal').addEventListener("click", closeModal, false);
document.getElementById('input-modal').addEventListener("click", captureModal, false);

// Envio de datos al storage.
function sendStorage(nameStorage, list) {
    localStorage.setItem(nameStorage, JSON.stringify(list));
}

//Mostrar modal
function showModal() {
    document.getElementById('modal').style.display = 'flex';
}

//Cerrar modal
function closeModal() {
    document.getElementById("title-new-task").value = '';
    document.getElementById("text-new-task").value = '';
    document.getElementById('modal').style.display = 'none';
}

//capturar modal
function captureModal() {
    let textTitle = document.getElementById("title-new-task").value;
    let textDescription = document.getElementById("text-new-task").value;
    let idItem = uuidv4();

    pendingStorage.push({ id: idItem, title: textTitle, description: textDescription });

    sendStorage('pendingTask', pendingStorage);

    printTask(searchElem(idItem, pendingStorage), "pendingList");
    closeModal();
}

//Buscar elemento en una lista storage.
const searchElem = (id, storage) => storage.find(item => item.id == id);

//insertar tareas 
function printTask(task, idUlNode) {
    let listTask = document.getElementById(idUlNode);
    let idBtnDelete = uuidv4();
    let idBtnMove = uuidv4();

    let newLi = document.createElement("li");
    let newDivCard = document.createElement("div");
    let newDivBoxHeader = document.createElement("div");
    let newH3CardTitle = document.createElement("h3");
    let newDivDeleteTask = document.createElement("div");
    let newDivFinishTask = document.createElement("div");
    let newPCardDescription = document.createElement("p");

    newLi.id = task.id;
    newDivCard.className = "card";
    newDivBoxHeader.className = "box-header";
    newH3CardTitle.className = "card-title";
    newH3CardTitle.innerText = task.title;
    newDivDeleteTask.id = idBtnDelete;
    newDivDeleteTask.className = "delete-task";
    newDivFinishTask.id = idBtnMove;
    newDivFinishTask.className = "finish-task";
    newPCardDescription.className = "card-description";
    newPCardDescription.innerText = task.description;

    newDivBoxHeader.appendChild(newH3CardTitle);
    newDivBoxHeader.appendChild(newDivDeleteTask);
    newDivBoxHeader.appendChild(newDivFinishTask);
    newDivCard.appendChild(newDivBoxHeader);
    newDivCard.appendChild(newPCardDescription);
    newLi.appendChild(newDivCard);
    listTask.append(newLi);

    eventButtons(task.id, idBtnDelete, idBtnMove, idUlNode);
}

// añadir evento del boton borrar y mover.
function eventButtons(idElement, idBtnDelete, idBtnMove, idUlNode) {
    let btnBorrar = document.getElementById(idBtnDelete);
    let btnMove = document.getElementById(idBtnMove);

    btnBorrar.addEventListener("click", function () { deleteTask(idElement, idUlNode) }, false);
    btnMove.addEventListener("click", function () { moveTask(idElement, idUlNode) }, false);
}

//Eliminar tarea
function deleteTask(idElement, idUlNode) {

    let element = document.getElementById(idElement)
    element.parentNode.removeChild(element);

    if (idUlNode == "pendingList") {
        pendingStorage = pendingStorage.filter(element => element.id != idElement)
        sendStorage('pendingTask', pendingStorage);

    } else if (idUlNode == "performList") {
        finishedStorage = finishedStorage.filter(element => element.id != idElement)
        sendStorage('finishedTask', finishedStorage);
    }
}

// Mover tarea de lista
function moveTask(idElement, idUlNode) {

    if (idUlNode == "pendingList") {
        finishedStorage.push(searchElem(idElement, pendingStorage));

        deleteTask(idElement, idUlNode);
        printTask(searchElem(idElement, finishedStorage), "performList");
        sendStorage('finishedTask', finishedStorage);

    } else if (idUlNode == "performList") {
        pendingStorage.push(searchElem(idElement, finishedStorage));

        deleteTask(idElement, idUlNode);
        printTask(searchElem(idElement, pendingStorage), "pendingList");
        sendStorage('pendingTask', pendingStorage);
    }
}