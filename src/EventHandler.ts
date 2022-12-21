export interface LrEvent<T> {
    value(): T
}

export type EventHandler<T = never> = (sheet: Sheet) => (event: LrEvent<T>) => void;
