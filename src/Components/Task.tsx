import {dispatchFetching} from "./TodoList/TodoList";
import {FC, LegacyRef, useEffect, useRef, useState} from "react";
import {setDragTaskAC, TaskType, TodoType} from "./store/todoReducer";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {Field, Form, Formik} from "formik";
import {Checkbox} from "@mui/material";
import TodayIcon from '@mui/icons-material/Today';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';

const UpdateTaskForm:FC<{task:TaskType,closeUpdateMode:(...args:any) => void}> = ({task,closeUpdateMode}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    return <Formik initialValues={{title:task.title,deadline:task.deadline.split('.').reverse().join('-')}} onSubmit={({title,deadline}) => {
        dispatchFetching(dispatch)
        if(title) localStorage.setItem(task.id,JSON.stringify({...task,title,deadline:String(deadline).split('-').reverse().join('.')}))
        closeUpdateMode()
    }}>
        <Form>
            <Field name={'title'} placeholder={'new Title'} />
            <Field name={'deadline'} type={'date'} placeholder={'new DeadLine'} />
            <button type={'submit'}>Update</button>
        </Form>
    </Formik>
}

export const Task:FC<{task:TaskType,setMode:any}> = ({task,setMode}) => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const [updateMode,setUpdateMode] = useState(false)
    const [doneMode,setDoneMode] = useState(task.done)

    const currentTask = useRef<HTMLDivElement>(null)

    useEffect(() => {
        dispatchFetching(dispatch)
        localStorage.setItem(task.id,JSON.stringify({...task,done:doneMode}))
    },[doneMode])

    const dragTask = useSelector((state:AppStateType) => state.todo.dragTask)


    const dragStartHandler = function (event:any){
        dispatch(setDragTaskAC(task))
    }

    const dropHandler = function (event:any){
        const dropTask = task
        dispatchFetching(dispatch)
        localStorage.setItem(dragTask?.id + "",JSON.stringify({...dragTask,order:dropTask.order,todoId:dropTask.todoId}))
        localStorage.setItem(task.id,JSON.stringify({...task,order:dragTask?.order,todoId:dragTask?.todoId}))
    }

    return <div draggable={true} ref={currentTask} className={'task'} onDragStart={dragStartHandler} onDrop={dropHandler} onDragOver={(e) => {
        e.preventDefault()
    }}>
        <div className="task_content">
            <h4>{task.title}</h4>
            <div className="task_btns">
                <h6><TodayIcon /> : {String(task.deadline)}</h6>
                <Checkbox checked={doneMode} onChange={(event) => {
                    setDoneMode(prev => !prev)
                }}/>
                <button onClick={() => {
                    setUpdateMode(prev => !prev)
                }}>
                    <ModeEditIcon/>
                </button>
                <button onClick={() => {
                    currentTask.current?.classList.add('active')
                }}>
                    <DeleteForeverIcon />
                </button>
            </div>
            {updateMode && <UpdateTaskForm task={task} closeUpdateMode={() => {
                setUpdateMode(false)
            }} />}
        </div>
        <div className="task_delete__page">
            <h2 onClick={() => {
                dispatchFetching(dispatch)
                localStorage.removeItem(task.id)
                currentTask.current?.classList.remove('active')
                setMode()
            }}>Are you <span style={{color:'red'}}>sure</span>?</h2>
            <button onClick={() => {
                currentTask.current?.classList.remove('active')
            }}>
                <ClearIcon />
            </button>
        </div>
    </div>
}