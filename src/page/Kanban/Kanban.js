import Layout1 from "../../layout/Layout1"
import { useEffect } from "react";
import './style.css'

export default function Kanban(){
    
useEffect(() => {
const todos = document.querySelectorAll(".todo");
const all_status = document.querySelectorAll(".status");
let draggableTodo = null;

todos.forEach((todo) => {
  todo.addEventListener("dragstart", dragStart);
  todo.addEventListener("dragend", dragEnd);
});

function dragStart() {
  draggableTodo = this;
  setTimeout(() => {
    this.style.display = "none";
  }, 0);
  console.log("dragStart");
}

function dragEnd() {
  draggableTodo = null;
  setTimeout(() => {
    this.style.display = "block";
  }, 0);
  console.log("dragEnd");
}

all_status.forEach((status) => {
  status.addEventListener("dragover", dragOver);
  status.addEventListener("dragenter", dragEnter);
  status.addEventListener("dragleave", dragLeave);
  status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
  e.preventDefault();
  //   console.log("dragOver");
}

function dragEnter() {
  this.style.border = "1px dashed #ccc";
  console.log("dragEnter");
}

function dragLeave() {
  this.style.border = "none";
  console.log("dragLeave");
}

function dragDrop() {
  this.style.border = "none";
  this.appendChild(draggableTodo);
  //this**
  console.log(this)
  console.log("dropped");
}

/* modal */

    const btns = document.querySelectorAll("[data-target-modal]");
    const close_modals = document.querySelectorAll(".close-modal");
    const overlay = document.getElementById("overlay");
    
    btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.targetModal).classList.add("active");
    overlay.classList.add("active");
  });
});

close_modals.forEach((btn) => {
  btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
});

window.onclick = (event) => {
    if (event.target == overlay) {
        const modals = document.querySelectorAll(".modal");
        modals.forEach((modal) => modal.classList.remove("active"));
        overlay.classList.remove("active");
    }
};

/* create todo  */
const todo_submit = document.getElementById("todo_submit");

todo_submit.addEventListener("click", createTodo);

function createTodo() {
    const todo_div = document.createElement("div");
    const input_val = document.getElementById("todo_input").value;
    const txt = document.createTextNode(input_val);
    
    todo_div.appendChild(txt);
    todo_div.classList.add("todo");
    todo_div.setAttribute("draggable", "true");
    
  /* create span */
  const span = document.createElement("span");
  const span_txt = document.createTextNode("\u00D7");
  span.classList.add("close");
  span.appendChild(span_txt);
  
  todo_div.appendChild(span);
  
  const backlog = document.getElementById("no_status")  
  backlog.appendChild(todo_div);
  
  //remove new ones
  span.addEventListener("click", () => {
    //**
    console.log(span.parentElement)
    span.parentElement.style.display = "none";
  });
  //   console.log(todo_div);
  
  todo_div.addEventListener("dragstart", dragStart);
  todo_div.addEventListener("dragend", dragEnd);
  
  document.getElementById("todo_input").value = "";
  const todo_form = document.getElementById("todo_form")
    todo_form.classList.remove("active");
  overlay.classList.remove("active");
  
}

const close_btns = document.querySelectorAll(".close");

//remove starting ones
close_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    //**
    console.log(btn.parentElement)
    btn.parentElement.style.display = "none";
});
});


})

return <Layout1> 
    <div class="modal" id="todo_form">
      <div class="header">
        <div class="title">Add Todo</div>
        <button class="btn close-modal">&times;</button>
      </div>
      <div class="body">
        <input type="text" id="todo_input" />
        <input type="submit" value="Add Todo" id="todo_submit" />
      </div>
    </div>
    <div class="todo-container">
      <div class="status" id="no_status">
        <h1>Backlog</h1>
        <button id="add_btn" data-target-modal="#todo_form">+ Add Todo</button>
      </div>
      <div class="status">
        <h1>Selected</h1>
      </div>
      <div class="status">
        <h1>Ongoing</h1>
      </div>
      <div class="status">
        <h1>Review</h1>
      </div>
      <div class="status">
        <h1>Finished</h1>
      </div>
    </div>

    <div id="overlay"></div></Layout1>
}