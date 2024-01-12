// Custom error handler function to create an error object with a specific status code and message
export const errorHandler = (statusCode, message) => {
	// Create a new Error object
	const error = new Error();
	// Set the status code for the error
	error.statusCode = statusCode;
	// Set the error message
	error.message = message;
	// Return the created error object
	return error;
};
