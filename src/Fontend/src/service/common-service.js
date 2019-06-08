const isNullOrUndefined = (obj) => {
    return obj == null || obj === undefined || obj.Lenth < 1;
}

const ROW_PER_PAGE = 5;


const getPaginationPageNumber = (total) => {
    return Math.ceil(total / ROW_PER_PAGE);
}

const getPaginationNextPageNumber = (currentPage) => {
    return (currentPage + 1) * ROW_PER_PAGE;
}

const getPaginationCurrentPageNumber = (currentPage) => {
    return currentPage * ROW_PER_PAGE;
}

export { isNullOrUndefined, getPaginationPageNumber, getPaginationNextPageNumber, getPaginationCurrentPageNumber };