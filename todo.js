//Picking the elements
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearBottom = document.querySelector("#clear-todos");

eventListener();

function eventListener(){
    // All event listeners
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearBottom.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    if(confirm("You sure that you want to clear all todos ?")){
        // Clear the todos from UI
        // todoList.innerHTML = ""; // Slow way
        // Fast way:
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue) === -1){
            //Didn't find

            listItem.setAttribute("style","display : none !important");
        }else{
            listItem.setAttribute("style","display : block !important");
        }
    });
}

function deleteTodo(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo deleted successfully !");
    }
}

function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deleteTodo){
            todos.splice(index,1); // Delete 1 object starting with current index
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosToUI(){
    // When wep page uploaded, program gets the todos from storage
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);

    });
}

function addTodo(e){
    // Get the input to newTodo var
    const newTodo = todoInput.value.trim();
    
    if(newTodo === ""){
        showAlert("danger","Please enter a todo !");
    }else{
        // Add entered todo to UI
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Todo successfully added !")
    }

    e.preventDefault();
}

function getTodosFromStorage(){ 
    //Get the whole todos from storage
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}


function showAlert(type, message){
     /*<div class="alert alert-danger" role="alert">
                        This is a danger alert—check it out!
                      </div> 
                      */

    const alert = document.createElement("div");
    
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //Remove alert after 1 sec with using setTimeout() method in Window object
    setTimeout(function(){
        alert.remove();
    },3000);
}


function addTodoToUI(newTodo){
    //Add to the UI the input

    /*<li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>*/

    //Create link element and list element, customize them
    const listItem = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    //Add Text Node
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    
    //Add the listItem to the To Do List
    todoList.appendChild(listItem);
    todoInput.value = ""; //Free the value
}