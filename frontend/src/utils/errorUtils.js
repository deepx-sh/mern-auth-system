export const isNetworkError = (error) => {
    return (
        !error.response && error.request && (error.message==='Network Error' || error.code==='ECONNABORTED')
    )
};

export const getErrorMessage = (error) => {
    if (isNetworkError(error)) {
        return 'Network error. Please check your internet connection.'
    }

    if (error.response?.status === 429) {
        return `Too many requests. Please try again later`
    }

    if (error.response?.status === 500) {
        return 'Server error.Please try again later'
    }

    if (error.response?.status === 404) {
        return 'Resource not found.'
    }

    return error.response?.data?.message || error.message || "An unexpected error occurred"
};

export const shouldRetry = (error) => {
    return isNetworkError(error) || (error.response?.status>=500 && error.response?.status<600)
}