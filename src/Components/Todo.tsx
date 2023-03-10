import {setCurrentTodoIdAC, setDoneTodoAC, setPendingTodoAC, TaskType, TodoType} from "./store/todoReducer";
import {dispatchFetching} from "./TodoList/TodoList";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import uniqid from "uniqid";
import {FC, useEffect, useState} from "react";
import {Task} from "./Task";
import {Field, Form, Formik} from "formik";
import {Checkbox} from "@mui/material";


const UpdateTodoForm:FC<{todo:TodoType,closeUpdateMode:(...args:any) => void}> = ({todo,closeUpdateMode}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    return <Formik initialValues={{title:todo.title,deadline:todo.deadline}} onSubmit={({title,deadline}) => {
        dispatchFetching(dispatch)
        localStorage.setItem(todo.id,JSON.stringify({...todo,title,deadline}))
        closeUpdateMode()
    }}>
        <Form>
            <Field name={'title'} placeholder={'new Title'} />
            <Field name={'deadline'} type={'date'} placeholder={'new DeadLine'} />
            <button type={'submit'}>Update</button>
        </Form>
    </Formik>
}

const CreateTaskForm:FC<{handleSubmit:(...args:any) => void}> = ({handleSubmit}) => {

    return <Formik initialValues={{title:'',deadline:new Date().toLocaleDateString()}} onSubmit={({title,deadline}) => {
        handleSubmit(title,deadline)
    }}>
        <Form>
            <Field name={'title'} placeholder={'new Title'} />
            <Field name={'deadline'} type={'date'} placeholder={'new DeadLine'} />
            <button type={'submit'}>Create</button>
        </Form>
    </Formik>
}


export const Todo:FC<{todo:TodoType,tasks:TaskType[]}> = ({todo,tasks}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const [updateMode,setUpdateMode] = useState(false)
    const [createMode,setCreateMode] = useState(false)
    const [todoPendingMode,setTodoPendingMode] = useState(todo.pending)
    const [todoDoneMode,setTodoDoneMode] = useState(todo.done)

    useEffect(() => {
        localStorage.setItem(todo.id,JSON.stringify({...todo,pending:todoPendingMode}))
    },[todoPendingMode])

    useEffect(() => {
        localStorage.setItem(todo.id,JSON.stringify({...todo,done:todoDoneMode}))
    },[todoDoneMode])

    const fetching = useSelector((state:AppStateType) => state.todo.fetching)
    const currentTodoId = useSelector((state:AppStateType) => state.todo.currentTodoId)

    const newTaskId = uniqid()

    return <div className={'todo'}>
        <div key={todo.id} className={'todo'}>
            <h2>{todo.title}</h2>
            <h3>Deadline : {String(todo.deadline)}</h3>
            <Checkbox checked={todoPendingMode} onChange={(event) => {
                setTodoPendingMode(prev => !prev)
            }}/>
            <Checkbox checked={todoDoneMode} onChange={(event) => {
                setTodoDoneMode(prev => !prev)
            }}/>
            <button onClick={() => {
                setUpdateMode(prev => !prev)
            }}>Update</button>
            {updateMode && <UpdateTodoForm todo={todo} closeUpdateMode={() => {
                setUpdateMode(false)
            }} />}
            <button onClick={() => {
                setCreateMode(prevState => !prevState)
            }}>Create Task</button>
            {createMode && <CreateTaskForm handleSubmit={(title,deadline) => {
                dispatchFetching(dispatch)
                localStorage.setItem(newTaskId,JSON.stringify({id:newTaskId,todoId:todo.id,title,deadline,order:tasks.sort((a,b) => a.order - b.order)[tasks.length - 1] ? (tasks.sort((a,b) => a.order - b.order)[tasks.length - 1].order + 1) : 1}))
                setCreateMode(false)
                dispatch(setCurrentTodoIdAC(todo.id))
            }} />}
            <button onClick={() => {
                if(currentTodoId === todo.id) return dispatch(setCurrentTodoIdAC(null))
                dispatch(setCurrentTodoIdAC(todo.id))
            }}>{currentTodoId === todo.id ? 'Hide tasks' : 'Show tasks' }</button>
            {currentTodoId === todo.id && tasks.sort((a,b) => b.order - a.order).map(task => {
                return <Task key={task.id} task={task} />
            })}
            <button disabled={fetching && todo.id === currentTodoId} onClick={() => {
                dispatchFetching(dispatch)
                localStorage.removeItem(todo.id)
            }}>Delete</button>
        </div>
    </div>
}