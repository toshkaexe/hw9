export type APIErrorResult = {
    errorsMessages: FieldError
}
export type FieldError = {
    message: string
    field: string
}

export function getPageOptions(query: any) {
    const pageNumber = query.pageNumber ? Number(query.pageNumber) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    const sortBy: string = query.sortBy ? query.sortBy.toString() : 'createdAt';
    const sortDirection = query.sortDirection === 'asc' ? 'asc' : 'desc';

    return { pageNumber, pageSize, sortBy, sortDirection };
}