import {
    setCurrentTodoIdAC,
    setDoneTodoAC,
    setDragTaskAC, setDragTodoAC,
    setPendingTodoAC,
    TaskType,
    TodoType
} from "./store/todoReducer";
import {dispatchFetching} from "./TodoList/TodoList";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import uniqid from "uniqid";
import {FC, useEffect, useRef, useState} from "react";
import {Task} from "./Task";
import {Field, Form, Formik} from "formik"
import {Categories} from "./Categories";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TodayIcon from '@mui/icons-material/Today';
import ClearIcon from "@mui/icons-material/Clear";

const UpdateTodoForm:FC<{todo:TodoType,closeUpdateMode:(...args:any) => void}> = ({todo,closeUpdateMode}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    return <Formik initialValues={{title:todo.title,deadline:todo.deadline.split('.').reverse().join('-')}} onSubmit={({title,deadline}) => {
        dispatchFetching(dispatch)
        if(title) localStorage.setItem(todo.id,JSON.stringify({...todo,title,deadline:String(deadline).split('-').reverse().join('.')}))
        closeUpdateMode()
    }}>
        <Form className={'todo_update__form'}>
            <Field name={'title'} placeholder={'New title'} />
            <Field name={'deadline'} type={'date'} placeholder={'New deadLine'} />
            <button type={'submit'}>Update</button>
        </Form>
    </Formik>
}

const CreateTaskForm:FC<{handleSubmit:(...args:any) => void}> = ({handleSubmit}) => {

    return <Formik initialValues={{title:'',deadline:new Date().toLocaleDateString().split('-').reverse().join(':')}} onSubmit={({title,deadline}) => {
        handleSubmit(title,deadline.split('-').reverse().join('.'))
    }}>
        <Form className={'todo_create__form'}>
            <Field name={'title'} placeholder={'Create task'} />
            <Field name={'deadline'} type={'date'} placeholder={'DeadLine'} />
            <button type={'submit'}>
                <AddIcon />
            </button>
        </Form>
    </Formik>
}


export const Todo:FC<{todo:TodoType,tasks:TaskType[]}> = ({todo,tasks}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const currentTodo = useRef<HTMLDivElement>(null)

    const [updateMode,setUpdateMode] = useState(false)
    const [createMode,setCreateMode] = useState(false)
    const [sortMode,setSortMode] = useState('all')
    const [watchingMode,setWatchingMode] = useState(tasks.length !== 0)
    const [bg,setBg] = useState('')


    const fetching = useSelector((state:AppStateType) => state.todo.fetching)
    const currentTodoId = useSelector((state:AppStateType) => state.todo.currentTodoId)
    const dragTodo = useSelector((state:AppStateType) => state.todo.dragTodo)

    const newTaskId = uniqid()

    const dragStartHandler = function (event:any){
        if(event.currentTarget.className !== 'task') dispatch(setDragTodoAC(todo))
    }

    const dropHandler = function (event:any){
        const dropTodo = todo
        dispatchFetching(dispatch)
        if(dropTodo){
            localStorage.setItem(dropTodo?.id + "",JSON.stringify({...dropTodo,order:dragTodo?.order}))
            localStorage.setItem(dragTodo?.id + "",JSON.stringify({...dragTodo,order:dropTodo?.order}))
        }
    }

    return <div className={'todo' + `${updateMode ? ' update' : ''}`} ref={currentTodo} style={{backgroundColor:todo.bgColor}}>
            <div className="todo_content" >
                <div className="todo_drag" draggable={true} onDragStart={dragStartHandler} onDrop={dropHandler} onDragOver={(e) => {
                    e.preventDefault()
                }}>
                    <h2>{todo.title}</h2>
                    <h3><TodayIcon /> : {String(todo.deadline)}</h3>
                    <div className="todo_btns">
                        <button onClick={() => {
                            setUpdateMode(prev => !prev)
                        }}>
                            <ModeEditIcon />
                        </button>
                        <button onClick={() => {
                            setCreateMode(prevState => !prevState)
                        }}>
                            <AddIcon />
                        </button>
                        <button onClick={() => {
                            if(tasks.length > 0)setWatchingMode(prev => !prev)
                        }}>{watchingMode ? <VisibilityOffIcon /> : <VisibilityIcon /> }</button>
                        <button disabled={fetching && todo.id === currentTodoId} onClick={() => {
                            currentTodo.current?.classList.add('active')
                        }}>
                            <DeleteForeverIcon />
                        </button>
                    </div>
                    {createMode && <CreateTaskForm handleSubmit={(title,deadline) => {
                        dispatchFetching(dispatch)
                        if(title) localStorage.setItem(newTaskId,JSON.stringify({id:newTaskId,todoId:todo.id,title,deadline,done:false,order:tasks.sort((a,b) => a.order - b.order)[tasks.length - 1] ? (tasks.sort((a,b) => a.order - b.order)[tasks.length - 1].order + 1) : 1}))
                        setCreateMode(false)
                        setWatchingMode(true)
                    }} />}
                </div>
                <div className="tasks">
                    {watchingMode && tasks.sort((a,b) => b.order - a.order).filter(task => sortMode === 'all' ? true : (sortMode === 'done' ? task.done : !task.done)).map(task => {
                        return <Task key={task.id} setMode = {() => {
                            if(tasks.length === 1) setWatchingMode(false)
                        }} task={task} />
                    })}
                </div>
                {watchingMode &&  <Categories currentCategory={sortMode} setCurrentCategory={(category:string) => {
                    setSortMode(category)
                }} />}
            </div>
            <div className="todo_delete__page">
                <h2 onClick={() => {
                    dispatchFetching(dispatch)
                    localStorage.removeItem(todo.id)
                    currentTodo.current?.classList.remove('active')
                }}>Are you <span style={{color:'red'}}>sure</span>?</h2>
                <button onClick={() => {
                    currentTodo.current?.classList.remove('active')
                }}>
                    <ClearIcon />
                </button>
            </div>
            <div className="todo_form__page">
                <UpdateTodoForm todo={todo} closeUpdateMode={() => {
                    setUpdateMode(false)
                }} />
                <button className={'close'} onClick={() => {
                    setUpdateMode(false)
                }}>
                    <ClearIcon />
                </button>
            </div>
    </div>
}