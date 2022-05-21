import React, { useEffect } from 'react'
import Todo from '../types/todo'

interface Props {
    inputText: string;
    todos: Array<Todo>;
    setTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
    setInputText: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    status: string;
    sw: any;
}

const Form: React.FC<Props> = ({inputText, todos, setTodos, setInputText, setStatus, status, sw}) => {
    const inputTextHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setInputText(e.currentTarget.value)
    }

    const submitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        if (sw.controller) {
            sw.controller.postMessage({
                todos: [
                    ...todos, {text: inputText, complete: false, uniqueId: Math.random() * 1000}
                ]
            });
        }

        setTodos([
            ...todos, {text: inputText, complete: false, uniqueId: Math.random() * 1000}
        ])

        setInputText('')
    } 

    const filterHandler = (e: React.FormEvent<HTMLSelectElement>) => {
        setStatus(e.currentTarget.value)
    }

    return (
        <form>
            <input value={inputText} onChange={inputTextHandler} type="text" className="todo-input" />
            <button onClick={submitHandler} className="todo-button" type="submit">
                +
            </button>
            <div className="select">
                <select onChange={filterHandler} name="todos" className="filter-todo">
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="uncompleted">Uncompleted</option>
                </select>
            </div>
    </form>
    );
}

export default Form;