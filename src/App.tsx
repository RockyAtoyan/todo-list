import React, {useEffect} from 'react';
import './App.scss';
import {TodoList} from "./Components/TodoList/TodoList";
import {Header} from "./Components/Header";

const App = () => {

    useEffect(() => {

    },[])

    return (
        <div className="App">
            <Header />
            <TodoList/>
        </div>
    );
}

export default App;
