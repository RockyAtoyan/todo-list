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

export const TodoList = () => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const todos = useSelector((state:AppStateType) => state.todo.todos)
    const fetching = useSelector((state:AppStateType) => state.todo.fetching)

    const items = Object.keys(sessionStorage).map(key => {
        return JSON.parse(sessionStorage.getItem(key) + '')
    })

    return <div className={'todo_list'}>
        {fetching && <Preloader />}
        <CreateForm dispatchFetching={() => {
            dispatch(setFetchingAC(true))
            setTimeout(() => {
                dispatch(setFetchingAC(false))
            },200)
        }} />
        {items.sort((a,b) => a.order - b.order).map(todo => {
            return todo && <div key={todo.id} className={'todo'}>
                <h2>{todo.title}</h2>
                <button onClick={() => {
                    dispatch(setFetchingAC(true))
                    setTimeout(() => {
                        dispatch(setFetchingAC(false))
                    },200)
                    sessionStorage.removeItem(todo.id)
                }}>Delete</button>
            </div>
        })}
    </div>
}