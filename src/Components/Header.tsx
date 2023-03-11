import {useEffect, useRef, useState} from "react";
import {dispatchFetching} from "./TodoList/TodoList";
import {ThunkDispatch} from "redux-thunk";
import {AppStateType} from "./store/store";
import {AnyAction} from "redux";
import {useDispatch} from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';


export const Header = () => {
    const dispatch:ThunkDispatch<AppStateType, any, AnyAction> = useDispatch()

    const deletePage = useRef<HTMLDivElement>(null)

    const [coordinates,setCoordinates] = useState<any[]>([1340,21])

    // useEffect(() => {
    //     setCoordinates([deletePage.current?.offsetTop,deletePage.current?.offsetLeft ? window.innerWidth - deletePage.current?.offsetLeft : 50])
    // },[deletePage.current?.offsetTop,deletePage.current?.offsetLeft])

    return <header className={'header'}>
        <h2>ToDo List</h2>
        <button onClick={(event) => {
            console.log(event)
            setCoordinates([event.clientX,event.clientY])
            deletePage.current?.classList.add('active')
        }} className={'header_btn btn'}>
            <DeleteIcon fontSize={'large'} />
        </button>
        <div className="header_delete__page" style={{transformOrigin:`98% 5%`}} ref={deletePage}>
            <h2 onClick={() => {
                dispatchFetching(dispatch)
                Object.keys(localStorage).map(key => [key,JSON.parse(localStorage.getItem(key) + '')]).forEach(arr => {
                    if(arr[1].type === 'todo'){
                        localStorage.removeItem(arr[0])
                    }
                })
                deletePage.current?.classList.remove('active')
            }}>All todos will die. Are you <span style={{color:'red'}}>sure</span>?</h2>
            <button onClick={(event) => {
                deletePage.current?.classList.remove('active')
            }} className={'header_btn btn'}>
                <ClearIcon fontSize={'large'} />
            </button>
        </div>
    </header>
}