enum TodoStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}
interface Todo {
    id: number;
    name: string;
    description: string;
    status: TodoStatus;
    reminderTimestamp: number;
    updatedBy: string;
    providerId?: number;
    createdAt: number;
    updatedAt: number;
}

export { TodoStatus };
export type { Todo };