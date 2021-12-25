export class Page<T> {
    pageNumber: number;
    pageSize: number;
    totalSize: number;
    list: T[];
}
