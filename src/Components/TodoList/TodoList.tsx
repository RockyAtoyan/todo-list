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
        sessionStorage.setItem(id,JSON.stringify({id,title,order:1}))
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

    const items = Object.keys(sessionStorage).map(key => {
        return JSON.parse(sessionStorage.getItem(key) + '')
    }).sort((a,b) => a.order - b.order).map(todo => {
        let tasks:any[] = []
        Object.keys(sessionStorage).forEach(key => {
            if(JSON.parse(sessionStorage.getItem(key) + '').todoId === todo.id){
                tasks.push(JSON.parse(sessionStorage.getItem(key) + ''))
            }
        })
        const newTaskId = uniqid()
        return todo && !todo.todoId && <div key={todo.id} className={'todo'}>
            <h2>{todo.title}</h2>
            <button onClick={() => {
                dispatchFetching(dispatch)
                sessionStorage.setItem(newTaskId,JSON.stringify({title:'123',todoId:todo.id,id:newTaskId}))
            }}>Create Task</button>
            {tasks.map(task => {
                return <div key={task.id} className={'task'}>
                    <h4>{task.title}</h4>
                    <button onClick={() => {
                        dispatchFetching(dispatch)
                        sessionStorage.removeItem(task.id)
                    }}>Delete</button>
                </div>
            })}
            <button onClick={() => {
                dispatchFetching(dispatch)
                sessionStorage.removeItem(todo.id)
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