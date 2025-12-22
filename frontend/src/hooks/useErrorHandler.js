import { useCallback } from "react";
import { toast } from "react-toastify";

export const useErrorHandler = () => {
    const handleError = useCallback((error, customMessage) => {
        // console.error('Error caught', error)
        
        let message = customMessage
        
        if (!message) {
            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.message) {
                message=error.message
            } else {
                message='An unexpected error occurred'
            }
        }

        toast.error(message, {
            toastId:`error-${Date.now()}`
        })

        return message
    }, [])
    return {handleError}
}