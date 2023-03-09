import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {Field, Form, Formik} from "formik";
import {FC} from "react";
import {deleteTodoAC, setFetchingAC, setNewTodoAC} from "../store/todoReducer";
import uniqid from 'uniqid'
import {Preloader} from "../Preloader";

const CreateForm:FC<{dispatchFetching:(...args:any) => void}> = ({dispatchFetching}) => {
    return <Formik initialValues={{title:''}} onSubmit={({title},{resetForm}) => {
        dispatchFetching()
        const id = uniqid()
        localStorage.setItem(id,JSON.stringify({id,title,order:1,type:'todo'}))
        resetForm(undefined)
    }}>
        <Form>
            <Field name={'title'} placeholder={'Create Todo'} />
            <button type={'submit'}>Create</button>
        </Form>
    </Formik>
}

export const dispatchFetching = (dispatch:(...args:any) => any) => {
    dispatch(setFetchingAC(true))
    setTimeout(() => {
        dispatch(setFetchingAC(false))
    },200)
}

export const TodoList = () => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const todos = useSelector((state:AppStateType) => state.todo.todos)
    const fetching = useSelector((state:AppStateType) => state.todo.fetching)

    const items = Object.keys(localStorage).filter(key => {
        return JSON.parse(localStorage.getItem(key) + '').type === 'todo'
    }).map(key => JSON.parse(localStorage.getItem(key) + '')).sort((a,b) => a.order - b.order).map(todo => {
        let tasks:any[] = []
        Object.keys(localStorage).forEach(key => {
            if(JSON.parse(localStorage.getItem(key) + '').todoId === todo.id){
                tasks.push(JSON.parse(localStorage.getItem(key) + ''))
            }
        })
        const newTaskId = uniqid()
        return todo && !todo.todoId && <div key={todo.id} className={'todo'}>
            <h2>{todo.title}</h2>
            <button onClick={() => {
                dispatchFetching(dispatch)
                localStorage.setItem(newTaskId,JSON.stringify({title:'123',todoId:todo.id,id:newTaskId}))
            }}>Create Task</button>
            {tasks.map(task => {
                return <div key={task.id} className={'task'}>
                    <h4>{task.title}</h4>
                    <button onClick={() => {
                        dispatchFetching(dispatch)
                        localStorage.removeItem(task.id)
                    }}>Delete</button>
                </div>
            })}
            <button onClick={() => {
                dispatchFetching(dispatch)
                localStorage.removeItem(todo.id)
            }}>Delete</button>
        </div>
    })

    return <div className={'todo_list'}>
        {fetching && <Preloader />}
        <CreateForm dispatchFetching={() => {
            dispatchFetching(dispatch)
        }} />
        {items}
    </div>
}