import uniqid from 'uniqid'

const IS = {
    todos: [] as TodoType[],
    tasks: [] as TaskType[],
    fetching:false
}

export type TodoType = {
    id: string
    title: string
    order: number
}

export type TaskType = {
    id: string
    title: string
    order: number
    todoId: string
}

export const todoReducer = (state = IS, action: ActionsType) => {
    if (action.type === "set-new-todo") {
        return {...state, todos: [...state.todos, {...action.todo, id: uniqid()}]}
    } else if (action.type === "set-new-task") {
        return {...state, todos: [...state.tasks, {...action.task, id: uniqid()}]}
    } else if (action.type === "delete-todo") {
        return {...state, todos: [...state.todos].filter(todo => todo.id !== action.id)}
    } else if (action.type === "delete-task") {
        return {...state, tasks: [...state.tasks].filter(task => task.id !== action.id)}
    } else if (action.type === "set-fetching") {
        return {...state, fetching: action.fetching}
    }
    return {...state}
}

type ActionsType = setNewTodoACType | setNewTaskACType | deleteTodoACType | deleteTaskACType | setFetchingACType

type setNewTodoACType = {
    type: 'set-new-todo'
    todo: { title: string, order: number }
}
export const setNewTodoAC = (todo: { title: string, order: number }): setNewTodoACType => ({type: "set-new-todo", todo})

type setNewTaskACType = {
    type: 'set-new-task'
    task: { title: string, order: number, todoId: string }
}
export const setNewTaskAC = (task: { title: string, order: number, todoId: string }): setNewTaskACType => ({type: "set-new-task", task})

type deleteTodoACType = {
    type: 'delete-todo'
    id:string
}
export const deleteTodoAC = (id:string): deleteTodoACType => ({type: "delete-todo", id})

type deleteTaskACType = {
    type: 'delete-task'
    id:string
}
export const deleteTaskAC = (id:string): deleteTaskACType => ({type: "delete-task", id})

type setFetchingACType = {
    type: 'set-fetching'
    fetching:boolean
}
export const setFetchingAC = (fetching:boolean): setFetchingACType => ({type: "set-fetching", fetching})