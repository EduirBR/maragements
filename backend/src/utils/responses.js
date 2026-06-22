const response = (
    res,
    data,
    { message = "no message", error = false, statusCode = 200 } = {},
) => {
    if (error && statusCode >= 200 && statusCode < 300) {
        statusCode = 400;
    }
    if (statusCode < 200 || statusCode >= 300) {
        error = true;
    }
    res.status(statusCode).json({
        error: error,
        message: message,
        data: data,
    });
};

export const paginatedResponse = (
    res,
    data,
    fetchedItems,
    totalItems,
    {
        page = 1,
        pageSize = 10,
        message = "no message",
        error = true,
        statusCode = 200,
    },
) => {
    res.status(statusCode).json({
        error: error,
        message: message,
        data: {
            page: page,
            page_size: pageSize,
            fetched_items: fetchedItems,
            total_items: totalItems,
            items: data,
        },
    });
};

export default response;
