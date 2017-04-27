$(document).ready(function() {
  getTodos()
  bindEvents();
});

function bindEvents() {
  // Desinscribirse de eventos anteriores
  $('.addTodo').off('submit');
  $(".delete").off("click");
  $('.edit').off('click');
  $('.edit-form').off('submit');
  $('.edit-form input[type="button"]').off('click');
  // $('.edit-form input[type="submit"]').first().off('submit')
  // Enlaza los eventos que agregan, remuevan y completan TODOS a los elmentos del DOM indicados
  $('.addTodo').on('submit', addTodo);
  $(".delete").on("click", deleteTodo);
  $('.edit').on('click', editTodo);
  $('.edit-form').on('submit', updateTodo);
  $('.edit-form input[type="button"]').on('click', getTodos);

  // $('.edit-form input[type="submit"]').first().on('submit', updateTodo)
}

//HANDLEBAR
var source = $("#entry_template").html();
var template = Handlebars.compile(source)
var sourceEditTemplate = $("#edit_template").html();
var editTemplate = Handlebars.compile(sourceEditTemplate)
var todos = {}

//DRAG AND DROP
var cols = []
var dragSrcEl = null;
// function buildTodo(todoName) {
//   // Eso nos ta un pedazo del DOM
//   var todoTemplate = $.trim($('#todo_template').html());
//   console.log(todoTemplate)
//   // Creamos un elemento de jquery a partir del template
//   var $todo = $(todoTemplate);
//   // Modificamos el texto con el que nos pasen como argumento
//   $todo.find('h2').text(todoName);
//   // Devuelve el elemento de jquery para ser usado en otra parte.
//   return $todo;
// }

// Crea las funciones que añaden, remueven y completan TODOS. 
function addTodo(event){
  event.preventDefault()
  var url = this.action
  var data = $(this).serialize()
  $(".addTodo input[type='text']").val("")
  $.ajax({
    method: "POST",
    url: url,
    data: data,
  }).done(render).fail()

}

function getTodos(){
  $.ajax({
    method: "GET",
    url: "/todos",
  }).done(render).fail()
}

function render(response){
  createObjTodos(response)
  
  var html = template(response)
  $("#todo_template").html(html)
  dragAndDrop()
  bindEvents()

}

//meto los todos en un objeto cuya llave es el id del todo y el valor es el json todo de respuesta
//el objeto todos lo voy a usar en el edit
function createObjTodos(response){
  todos = response.todos.reduce(function(todos_obj, todo){
    todos_obj[todo.id] = todo
    return todos_obj

  }, {});
}

function deleteTodo(event){
  event.preventDefault()
  var deleteElement = this
  var url = deleteElement.href
  $.ajax({
    method: "DELETE",
    url: url,
  }).done(render).fail()
}

function editTodo(event){
  event.preventDefault()
  var todoId = this.dataset.id
  var todo = todos[todoId] //busco el todo  en el arreglo todos por id

  var element = this
  var html = editTemplate(todo)
  $($(this).parent().siblings()[0]).find("div.append_edit").replaceWith(html)
    if (todo.completed === true){
      $($($(element).parent().siblings()[0]).children()[2]).find("input[type='checkbox']").attr( 'checked','checked');  
    }

  // debugger
  bindEvents()
  }


function updateTodo(event){
  event.preventDefault()
  var element = this
  var url = element.action
  var data = $(this).serialize()
  $.ajax({
    method: "PATCH",
    url: url,
    data: data
  }).done(render).fail()

}

function handleDragStart(e) {
  // this.style.opacity = '0.4';  // this / e.target is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  bindEvents()
}


function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
  bindEvents()
  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
  bindEvents()
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
  bindEvents()
}

function handleDrop(e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  bindEvents()
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });
  bindEvents()
}

function dragAndDrop(){
  cols = document.querySelectorAll('#todo_template .article_todo');
  [].forEach.call(cols, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);

  });
}