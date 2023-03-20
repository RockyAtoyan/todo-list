import uniqid from 'uniqid'

const IS = {
    todos: [] as TodoType[],
    tasks: [] as TaskType[],
    fetching:false,
    currentTodoId:null as string | null,
    category:'all',
    dragTask:null as TaskType | null,
    dropTask:null as TaskType | null,
    dragTodo:null as TodoType | null,
    dropTodo:null as TodoType | null
}

export type TodoType = {
    id: string
    title: string
    order: number
    done:boolean
    pending:boolean
    deadline:string
    bgColor:string
}

export type TaskType = {
    id: string
    title: string
    order: number
    todoId: string
    done:boolean
    pending:boolean
    deadline:string
}

export const todoReducer = (state = IS, action: ActionsType) => {
    // if (action.type === "set-new-todo") {
    //     return {...state, todos: [...state.todos, {...action.todo, id: uniqid()}]}
    // } else if (action.type === "set-new-task") {
    //     return {...state, todos: [...state.tasks, {...action.task, id: uniqid()}]}
    // } else if (action.type === "delete-todo") {
    //     return {...state, todos: [...state.todos].filter(todo => todo.id !== action.id)}
    // } else if (action.type === "delete-task") {
    //     return {...state, tasks: [...state.tasks].filter(task => task.id !== action.id)}}
    if (action.type === "set-fetching") {
        return {...state, fetching: action.fetching}
    } else if (action.type === "set-current-todo-id") {
        return {...state, currentTodoId: action.id}
    } else if (action.type === "set-category") {
        return {...state,category: action.caregory}
    } else if (action.type === "set-drag-task") {
        return {...state,dragTask: action.task}
    } else if (action.type === "set-drag-todo") {
        return {...state,dragTodo: action.todo}
    }
    return {...state}
}

//type ActionsType = setNewTodoACType | setNewTaskACType | deleteTodoACType | deleteTaskACType
type ActionsType =  setFetchingACType | setCurrentTodoIdACType | setPendingTodoACType | setDoneTodoACType | setCategoryTodoACType | setDropTaskACType | setDragTaskACType |
    setDragTodoACType

// type setNewTodoACType = {
//     type: 'set-new-todo'
//     todo: { title: string, order: number }
// }
// export const setNewTodoAC = (todo: { title: string, order: number }): setNewTodoACType => ({type: "set-new-todo", todo})
//
// type setNewTaskACType = {
//     type: 'set-new-task'
//     task: { title: string, order: number, todoId: string }
// }
// export const setNewTaskAC = (task: { title: string, order: number, todoId: string }): setNewTaskACType => ({type: "set-new-task", task})
//
// type deleteTodoACType = {
//     type: 'delete-todo'
//     id:string
// }
// export const deleteTodoAC = (id:string): deleteTodoACType => ({type: "delete-todo", id})
//
// type deleteTaskACType = {
//     type: 'delete-task'
//     id:string
// }
// export const deleteTaskAC = (id:string): deleteTaskACType => ({type: "delete-task", id})

type setFetchingACType = {
    type: 'set-fetching'
    fetching:boolean
}
export const setFetchingAC = (fetching:boolean): setFetchingACType => ({type: "set-fetching", fetching})

type setCurrentTodoIdACType = {
    type: 'set-current-todo-id'
    id:string | null
}
export const setCurrentTodoIdAC = (id:string | null): setCurrentTodoIdACType => ({type: "set-current-todo-id", id})

type setPendingTodoACType = {
    type: 'set-pending-todo'
    id:string
    pending:boolean
}
export const setPendingTodoAC = (id:string,pending:boolean): setPendingTodoACType => ({type: "set-pending-todo",id,pending})

type setDoneTodoACType = {
    type: 'set-done-todo'
    id:string
    done:boolean
}
export const setDoneTodoAC = (id:string,done:boolean): setDoneTodoACType => ({type: "set-done-todo",id,done})

type setCategoryTodoACType = {
    type: 'set-category'
    caregory:string
}
export const setCategoryTodoAC = (caregory:string): setCategoryTodoACType => ({type:'set-category',caregory})

type setDropTaskACType = {
    type: 'set-drop-task'
    id:string
}
export const setDropTaskAC = (id:string): setDropTaskACType => ({type:'set-drop-task',id})

type setDragTaskACType = {
    type: 'set-drag-task'
    task:TaskType
}
export const setDragTaskAC = (task:TaskType): setDragTaskACType => ({type:'set-drag-task',task})

type setDragTodoACType = {
    type: 'set-drag-todo'
    todo:TodoType
}
export const setDragTodoAC = (todo:TodoType): setDragTodoACType => ({type:'set-drag-todo',todo})