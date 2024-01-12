import jwt from "jsonwebtoken";

// Middleware function to verify the authenticity of a JWT token
export const verifyToken = (requiredRole) => (req, res, next) => {
	// Retrieve the JWT token from the request's cookies
	const token = req.cookies.access_token;

	// Check if a token is present
	if (!token) {
		// No token provided, return unauthorized status
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	// Verify the token using the secret key
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		// Check for errors during verification
		if (err) {
			// Invalid token, return unauthorized status
			return res.status(401).json({ success: false, message: "Invalid token" });
		}

		// Token is valid, add the decoded user data to the request
		req.user = decoded;

		// Check if a required role is specified
		if (requiredRole && req.user.role !== requiredRole) {
			// User does not have the required role, return forbidden
			return res.status(403).json({ success: false, message: "Forbidden" });
		}
		// Continue to the next middleware or route handler
		next();
	});
};
