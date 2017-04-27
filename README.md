# Sinatra Todo-List Con Edición de Tareas

## App Preview
![App Preview](./public/appPreview.jpg?raw=true "ToDo-list Preview")

## Descripción
* Se puede añadir un ToDo a la página.
* Se puede marcar completado o no un ToDo.
* Se puede borrar un ToDo de la página.
* Se pueden organizar un ToDo arrastrandolo a la posición deseada (HTML5 Drag and Drop)
* Se usa `handlebars.js` para interpolar los datos en la vista

## Instrucciones
1. Clona este repositorio
2. Debes tener PostgreSQL instalado
3. Ejecuta el comando `bundle install` desde el root.
4. Ejecuta `rake db:create` luego `rake db:migrate` y finalmente `rake db:seed`
5. Si estas en un sistema operativo Unix ejecuta `shotgun config.ru` de lo contrario `rackup` 
6. Abre el navegador en `http://localhost:puertoIndicado/`
