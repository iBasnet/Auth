
export type ToDoT = {
    _id?: string;
    dueBy: Date,
    task: string,
    category: string
    isComplete?: boolean,
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDateT = {
    joined: string;
    logged: string;
}