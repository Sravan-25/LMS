const JWT = require("jsonwebtoken");

const secret = "$ravan@123";

// Create token for user with expiration time
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profilePicture: user.profileImageURL,
        role: user.role,
        skills: user.skills,
    };

    // Token expires in 1 hour
    const token = JWT.sign(payload, secret, { expiresIn: '1h' });

    return token;
}

// Validate token if user needs to login with their token
function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload; // Return the payload if valid
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token expired. Please log in again.");
        } else {
            throw new Error("Invalid token. Please log in.");
        }
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};
