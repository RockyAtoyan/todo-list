import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "../store/store";
import {AnyAction} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {Field, Form, Formik} from "formik";
import {FC} from "react";
import {setFetchingAC} from "../store/todoReducer";
import uniqid from 'uniqid'
import {Preloader} from "../Preloader";
import {Todo} from "../Todo";
import {Categories} from "../Categories";

const CreateForm:FC<{dispatchFetching:(...args:any) => void,fetching:boolean,lastTodoOrder:number}> = ({dispatchFetching,fetching,lastTodoOrder}) => {
    return <Formik initialValues={{title:'',deadline:new Date().toLocaleDateString()}} onSubmit={({title,deadline},{resetForm}) => {
        dispatchFetching()
        const id = uniqid()
        if(title) localStorage.setItem(id,JSON.stringify({id,title,deadline:deadline.split('-').reverse().join(':') ,pending:false,done:false,order:lastTodoOrder + 1,type:'todo'}))
        resetForm(undefined)
    }}>
        <Form className={'create_form'}>
            <Field name={'title'} placeholder={'Create Todo'} />
            <Field name={'deadline'} type={'date'} placeholder={''} />
            <button disabled={fetching} type={'submit'}>Create</button>
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

    const fetching = useSelector((state:AppStateType) => state.todo.fetching)
    const category = useSelector((state:AppStateType) => state.todo.category)

    const items = Object.keys(localStorage).filter(key => {
        return JSON.parse(localStorage.getItem(key) + '').type === 'todo'
    }).map(key => JSON.parse(localStorage.getItem(key) + '')).sort((a,b) => a.order - b.order)

    const todos = items.filter(todo => category === 'pending' ? todo.pending : (category === 'done' ? todo.done : true)).map(todo => {
        let tasks:any[] = []
        Object.keys(localStorage).forEach(key => {
            if(JSON.parse(localStorage.getItem(key) + '').todoId === todo.id){
                tasks.push(JSON.parse(localStorage.getItem(key) + ''))
            }
        })
        return todo && <Todo key={todo.id} todo={todo} tasks={tasks} />
    })

    return <div className={'todo_list'}>
        <CreateForm lastTodoOrder={Array.from(items)[items.length - 1] ? Array.from(items)[items.length - 1].order : 0 } fetching={fetching} dispatchFetching={() => {
            dispatchFetching(dispatch)
        }} />
        {todos}
    </div>
}