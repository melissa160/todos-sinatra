require "faker"

5.times do
  state = [true, false].sample
  Todo.create({todo_content: Faker::Book.title, completed: state})
end
