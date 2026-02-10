export const getErrorMessage = (err: unknown): string => {
    if (err instanceof TypeError) {
        return "Network error occurred.";
    }
    
    if (err instanceof Error) {
        if (err.message === "BAD_REQUEST") {
            return "Bad request.";
        } else if (err.message === "INTERNAL_SERVER_ERROR") {
            return "Internal server error occurred.";
        } else {
            return "An unexpected error occurred.";
        }
    }

    return "Something went wrong."
};