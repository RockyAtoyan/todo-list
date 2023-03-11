import React, {useEffect, useRef} from "react";


export const HiBlock = () => {
    const hiBlock = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTimeout(() => {
            hiBlock.current?.classList.add('active')
        },0)
    },[])

    return <>{Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key) + '')).filter(item => item.type === 'todo').length === 0 && <div className={'hi_block'} ref={hiBlock}>
        <div>
            <p>Hi there! It`s TodoList Prototype. Get some fun, but try not to break anything here.</p>
            <button onClick={() => {
                hiBlock.current?.classList.remove('active')
            }}>Ok</button>
        </div>
    </div>}</>
}