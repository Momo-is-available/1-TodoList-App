const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUl = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});
function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
      flagged: false,
    };
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}
function updateTodoList() {
  todoListUl.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    todoItem = createTodoItem(todo, todoIndex);
    todoListUl.append(todoItem);
  });
}
function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLi = document.createElement("li");
  const todoText = todo.text;
  todoLi.className = "todo";
  todoLi.innerHTML = `
  <li class="todo">
          <input type="checkbox" id="${todoId}" />
          <label class="custom-checkbox" for="${todoId}">
            <svg
              fill="transparent"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
          </label>
          <label class="todo-text" for="${todoId}"
            >${todoText}
          </label>
          <div class="button-container">
            <button class="flag-button ${todo.flagged ? "flagged" : ""}">
              <svg
                fill="var(--secondary-color)"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="M320-240h60v-200h100l40 80h200v-240H600l-40-80H320v440Zm237-180-40-80H380v-120h143l40 80h97v120H557ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
            </button>
            <button class="expand-button">
              <svg
                fill="var(--secondary-color)"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="M160-200v-80h400v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Zm0-160v-80h640v80H160Z"
                />
              </svg>
            </button>
            <button class="collapse-button" style="display: none;">
              <svg
                fill="var(--secondary-color)"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e8eaed"
              >
                <path
                  d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z"
                />
              </svg>
            </button>
            <button class="remove-button">
            <svg
              fill="var(--secondary-color)"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M200-440v-80h560v80H200Z" />
            </svg>
          </button>
          </div>
          <div class="detail-hidden">
            <textarea>${todo.details || ""}</textarea>
          </div> 
        </li>
  `;
  const detailsSection = todoLi.querySelector(".detail-hidden");
  const textarea = todoLi.querySelector("textarea");
  const detailsTextarea = detailsSection.querySelector("textarea");
  detailsTextarea.value = todo.details || "";
  detailsSection.querySelector("textarea").addEventListener("input", () => {
    allTodos[todoIndex].details = textarea.value;
    saveTodos();
  });
  textarea.addEventListener("input", () => autoResizeTextarea(textarea));

  const expandButton = todoLi.querySelector(".expand-button");
  expandButton.addEventListener("click", () => {
    detailsSection.classList.add("expanded");
    expandButton.style.display = "none";
    collapseButton.style.display = "flex";
  });
  const collapseButton = todoLi.querySelector(".collapse-button");
  collapseButton.addEventListener("click", () => {
    detailsSection.classList.remove("expanded");
    expandButton.style.display = "flex";
    collapseButton.style.display = "none";
  });

  const flagButton = todoLi.querySelector(".flag-button");
  flagButton.addEventListener("click", () => {
    todo.flagged = !todo.flagged;
    allTodos[todoIndex].flagged = todo.flagged;
    saveTodos();
    flagButton.classList.toggle("flagged");
  });

  const removeButton = todoLi.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    removeTodoItem(todoIndex);
  });
  const checkbox = todoLi.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  checkbox.checked = todo.completed;
  return todoLi;
}
function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}
function saveTodos() {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
}
function getTodos() {
  const todos = localStorage.getItem("todos") || [];
  return JSON.parse(todos);
}
function removeTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}
