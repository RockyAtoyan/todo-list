import React, {useEffect, useRef, useState} from 'react';
import './App.scss';
import {TodoList} from "./Components/TodoList/TodoList";
import {Header} from "./Components/Header";
import WAVES from 'vanta/dist/vanta.waves.min'
import {IntroBlock} from "./Components/IntroBlock";

const App = () => {

    const [vantaMode,setVantaMode] = useState<any>(null)
    const bg = useRef(null)


    useEffect(() => {
        if(!vantaMode){
            setVantaMode(WAVES({
                el:bg.current,
                color: 0x161f17
            }))
        }
        return () => {
            if(vantaMode) vantaMode.destroy()
        }
    },[])



    return (
        <>
            <IntroBlock />
            <div ref={bg} className={'bg'}></div>
            <div className="wrapper">
                <Header />
                <main className={'main'}>
                    <TodoList/>
                </main>
            </div>
        </>

    );
}

export default App;
