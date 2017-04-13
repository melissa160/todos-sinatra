$(document).ready(function() {
  getTodos()
  bindEvents();
});

function bindEvents() {
  // Desinscribirse de eventos anteriores
  $('.addTodo').off('submit');
  $('.edit-form').off('submit');
  $(".delete").off("click");
  $('.edit').off('click');

  // Enlaza los eventos que agregan, remuevan y completan TODOS a los elmentos del DOM indicados
  $('.addTodo').on('submit', addTodo);
  $(".delete").on("click", deleteTodo);
  $('.edit').on('click', editTodo);
  $('.edit-form').on('submit', updateTodo);
}

//HANDLEBAR
var source = $("#entry_template").html();
var template = Handlebars.compile(source)
var sourceEditTemplate = $("#edit_template").html();
var editTemplate = Handlebars.compile(sourceEditTemplate)
var todos = {}

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
  var html = editTemplate(todo)
  $(this).replaceWith(html)

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

