# index
get '/' do
  erb :index
end

get '/todos' do
  all_todos = Todo.all
  all_todos = all_todos.sort_by{ |t| t.id }
  content_type :json
  {todos: all_todos}.to_json
end

#create
post '/todos' do
  todo = Todo.new(todo_content: params[:content])
  if todo.save
    redirect '/todos'
  else

  end
end

#new

#update
patch "/todos/:id/edit" do
  todo = Todo.find_by(id: params[:id])
  todo.update(todo_content: params[:content])
  redirect "/todos"
end


#delete
delete "/todos/:id" do
  todo = Todo.find_by(id: params[:id])
  todo.delete
  redirect '/todos'
end

get '/todos/:id' do
  todos = Todos.find(params[:id])
  erb :"_todo", layout: false, locals: {todo: todo}
end