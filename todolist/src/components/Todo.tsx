import React from 'react'
import TypeTodo from '../types/todo'

interface Props {
    setTodos: React.Dispatch<React.SetStateAction<Array<TypeTodo>>>;
    todos: Array<TypeTodo>;
    todo: TypeTodo;
    sw: any;
}

const Todo:React.FC<Props> = ({setTodos, todos, todo, sw}) => {

    const deleteHandler = () => {

        if (sw.controller) {
            sw.controller.postMessage({
                todos: todos.filter(el => el.uniqueId !== todo.uniqueId)
                
            });
        }

        setTodos(todos.filter(el => el.uniqueId !== todo.uniqueId))

    }

    const completeHandler = () => {
        if (sw.controller) {
            sw.controller.postMessage({
                todos: 
                    todos.map(item => {
                        if (item.uniqueId === todo.uniqueId) {
                            return {
                                ...item, complete: !item.complete
                            }
                        }
                        return item            
                    })
                
            });
        }

        setTodos(todos.map(item => {
            if (item.uniqueId === todo.uniqueId) {
                return {
                    ...item, complete: !item.complete
                }
            }
            return item            
        }))

    }

    return (
        <div className="todo">
            <li key={todo.uniqueId} className={`todo-item ${todo.complete ? "completed" : ""}`}>{todo.text}</li>
            <button onClick={completeHandler} className="complete-btn">
                Done
            </button>
            <button onClick={deleteHandler} className="trash-btn">
                Delete
            </button>
        </div>
    );
}

export default Todo;