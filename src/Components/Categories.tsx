import {FC} from "react";

const categories = ['all','done','active']

export const Categories:FC<{setCurrentCategory:(...args:any) => void,currentCategory:string}> = ({currentCategory,setCurrentCategory}) => {

    return <div className={'categories'}>
        {categories.map((category,index) => {
            return <button className={currentCategory === category ? 'active' : ''} key={index} onClick={() => {
                setCurrentCategory(category)
            }} >{category}</button>
        })}
    </div>
}