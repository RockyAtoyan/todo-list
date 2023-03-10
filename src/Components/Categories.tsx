import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import {setCategoryTodoAC} from "./store/todoReducer";

const categories = ['all','done','pending']

export const Categories = () => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    return <div className={'categories'}>
        {categories.map((category,index) => {
            return <button key={index} onClick={() => {
                dispatch(setCategoryTodoAC(category))
            }} >{category}</button>
        })}
    </div>
}