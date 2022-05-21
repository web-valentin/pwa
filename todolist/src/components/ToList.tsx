import React from 'react'
import TypeTodo from '../types/todo';
import Todo from './Todo'

interface Props {
    setTodos: React.Dispatch<React.SetStateAction<Array<TypeTodo>>>;
    todos: Array<TypeTodo>;
    filteredTodos: Array<TypeTodo>;
    sw: any;
}

const ToList: React.FC<Props> = ({setTodos, todos, filteredTodos, sw}) => {

    return (
        <div className="todo-container">
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <Todo todos={todos} setTodos={setTodos} todo={todo} key={todo.uniqueId} sw={sw} />
                ))}
            </ul>
        </div>  
    );
}

export default ToList;