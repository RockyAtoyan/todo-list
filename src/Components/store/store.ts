import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import {todoReducer} from "./todoReducer";


const rootReducer = combineReducers({
    todo:todoReducer
})

export type AppStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer,applyMiddleware(thunk))