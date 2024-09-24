class Unautharized extends Error{
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

const authenticationMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    if(req.header.authorization !== 'Bearer ') {
        throw new Unautharized("Unauthorized")
    }

     // If the user is authenticated, move on to the next middleware or controller
    next()
}

export default authenticationMiddleware