import {dispatchFetching} from "./TodoList/TodoList";
import {FC, useEffect, useState} from "react";
import {setDragTaskAC, TaskType, TodoType} from "./store/todoReducer";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {Field, Form, Formik} from "formik";
import {Checkbox} from "@mui/material";

const UpdateTaskForm:FC<{task:TaskType,closeUpdateMode:(...args:any) => void}> = ({task,closeUpdateMode}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    return <Formik initialValues={{title:task.title,deadline:task.deadline}} onSubmit={({title,deadline}) => {
        dispatchFetching(dispatch)
        localStorage.setItem(task.id,JSON.stringify({...task,title,deadline}))
        closeUpdateMode()
    }}>
        <Form>
            <Field name={'title'} placeholder={'new Title'} />
            <Field name={'deadline'} type={'date'} placeholder={'new DeadLine'} />
            <button type={'submit'}>Update</button>
        </Form>
    </Formik>
}

export const Task:FC<{task:TaskType}> = ({task}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const [updateMode,setUpdateMode] = useState(false)
    const [doneMode,setDoneMode] = useState(task.done)

    const dragTask = useSelector((state:AppStateType) => state.todo.dragTask)

    useEffect(() => {
        localStorage.setItem(task.id,JSON.stringify({...task,done:doneMode}))
    },[doneMode])

    const dragStartHandler = function (event:any){
        dispatch(setDragTaskAC(task))
    }

    const dropHandler = function (event:any){
        const dragTaskOrder = dragTask?.order
        const dropTaskOrder = task.order
        dispatchFetching(dispatch)
        localStorage.setItem(dragTask?.id + "",JSON.stringify({...dragTask,order:dropTaskOrder}))
        localStorage.setItem(task.id,JSON.stringify({...task,order:dragTaskOrder}))
    }

    return <div draggable={true} className={'Task'} onDragStart={dragStartHandler} onDrop={dropHandler} onDragOver={(e) => {
        e.preventDefault()
    }}>
        <h4>{task.title}</h4>
        <h6>Deadline : {String(task.deadline)}</h6>
        <Checkbox checked={doneMode} onChange={() => {
            setDoneMode(prev => !prev)
        }} />
        <button onClick={() => {
            setUpdateMode(prev => !prev)
        }}>Update</button>
        {updateMode && <UpdateTaskForm task={task} closeUpdateMode={() => {
            setUpdateMode(false)
        }} />}
        <button onClick={() => {
            dispatchFetching(dispatch)
            localStorage.removeItem(task.id)
        }}>Delete</button>
    </div>
}