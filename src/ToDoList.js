import React, { useState } from 'react'
import './ToDo.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCalendarAlt, faSpinner, faCheckSquare, faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Collapse, Form, Label, FormGroup, NavLink, CardBody, Card, Input } from 'reactstrap';


function ToDoList() {

    // const API_KEY = "https://to-do-app-278812.uc.r.appspot.com/api/"
    const API_KEY = "http://127.0.0.1:8000/api/"

    const [view, setView] = useState(1)
    const [todo, setTodo] = useState("")

    var todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList = todoList ? todoList : {}
    const [list, setList] = useState(todoList);

    function setListData(props) {
        setList(props)
        localStorage.setItem("todoList", JSON.stringify(props))
    }

    async function addTodo(e) {
        e.preventDefault()

        const data = {
            todo: todo,
            status_id: 1
        }
        await axios.post(API_KEY + "addTodo", data)
            .then(function (response) {
                setListData(response.data.todos)

            })
            .catch(function (error) {
                console.log(error);
            });
        
        setTodo("")
    }

    async function handleChange(item) {

        let check = item.checked === 0 ? true : false

        const data = {
            to_do_id: item.id,
            checked: check,
        }
        console.log(data)
        await axios.post(API_KEY + "checkTodo", data)
            .then(function (response) {
                setListData(response.data.todos)

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    async function updateShelf(status) {

        const data = {
            status_id: status
        }

        await axios.post(API_KEY + "updateShelf", data)
            .then(function (response) {
                console.log(response.data)
                setListData(response.data.todos)

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    async function deleteTodo() {

        await axios.post(API_KEY + "deleteTodo")
            .then(function (response) {
                setListData(response.data.todos)

            })
            .catch(function (error) {
                console.log(error);
            });

    }


    let today = list.length > 0 ? list.filter(todo => todo.status_id === 1) : null
    let upcoming = list.length > 0 ? list.filter(todo => todo.status_id === 2) : null
    let inprogress = list.length > 0 ? list.filter(todo => todo.status_id === 3) : null
    let done = list.length > 0 ? list.filter(todo => todo.status_id === 4) : null

    let currentList = view === 1 ? today : view === 2 ? upcoming : view === 3 ? inprogress : view === 4 ? done : null



    let showList = currentList ? currentList.map((item, index) => {
        
        return (
            <div key={index} className="mb-2 ml-4">
                <li className={item.checked === 1 ? "text-dark" : null}><b><input onChange={(e) => handleChange(item)} type="checkbox" className="form-check-input" checked={item.checked} id="checkbox" />{item.to_do}</b></li>
            </div>
        )
    })
        : null

    return (
            <div className="container p-5">
                <div className="container text-white">
                    <div className="row">
                        <div className="col-md-8 offset-2">
                            <div id="boardView" className="row">
                                <div className="col-md-3 bg-dark">
                                    <ul className="list-unstyled mt-4 pl-3">
                                        <li className={view === 1 ? "text-muted" : null}><b><a onClick={() => setView(1)}><FontAwesomeIcon icon={faStar} className="text-warning" /> Today</a></b></li>
                                        <li className={view === 2 ? "text-muted" : null}><b><a onClick={() => setView(2)}><FontAwesomeIcon icon={faCalendarAlt} className="text-danger" /> Upcoming</a></b></li>
                                        <li className={view === 4 ? "text-muted" : null}><b><a onClick={() => setView(4)}><FontAwesomeIcon icon={faCheckSquare} className="text-primary" /> Done</a></b></li>
                                    </ul>
                                </div>
                                <div className="col-md-9 bg-secondary">
                                    <div className="row">
                                        <div className="col-8">
                                            {view === 1 ?
                                                <h1 className="mt-5 pl-3"><FontAwesomeIcon icon={faStar} size="sm" className="text-warning" /> Today</h1>
                                                :
                                                view === 2 ?
                                                    <h1 className="mt-5 pl-3"><FontAwesomeIcon icon={faCalendarAlt} className="text-danger" /> Upcoming</h1>
                                                    :
                                                    view === 3 ?
                                                        <h1 className="mt-5 pl-3"><FontAwesomeIcon icon={faSpinner} className="text-success" /> In-progress</h1>
                                                        :
                                                        view === 4 ?
                                                            <h1 className="mt-5 pl-3"><FontAwesomeIcon icon={faCheckSquare} className="text-primary" /> Done</h1>
                                                            :
                                                            null
                                            }
                                        </div>
                                        <div id="clear" className="col-4">
                                            {view === 1 ?
                                                <button onClick={() => updateShelf(4)} className="btn btn-warning btn-sm mt-5 float-right mr-5">Clear</button>
                                                :
                                                null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div id="list" className="col-md-9">
                                            <ul className="mt-3 pl-3 list-unstyled">
                                                {showList}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            {view === 4 ?
                                                <>
                                                    <button onClick={() => deleteTodo()} className="btn btn-danger btn-sm ml-3 mt-4">Delete all</button>
                                                    <button onClick={() => updateShelf(1)} className="btn btn-success btn-sm ml-3 mt-4">Restore all</button>
                                                </>
                                                : view !== 4 ?
                                                    <form onSubmit={addTodo} className="form-inline mt-4 pl-3">
                                                        <div className="form-group">
                                                            <input onChange={(e) => setTodo(e.target.value)} value={todo} type="text" className="form-control" id="textInput" placeholder="What do you need to do today?" />
                                                        </div>
                                                        <button type="submit" className="btn btn-warning"><FontAwesomeIcon icon={faPlus} /></button>
                                                    </form>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default ToDoList;