import React, {useEffect} from 'react';
import './App.scss';
import {TodoList} from "./Components/TodoList/TodoList";

const App = () => {

    useEffect(() => {

    },[])

    return (
        <div className="App">
            <TodoList/>
        </div>
    );
}

export default App;
