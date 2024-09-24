const errorHandler = (err, req, res, next) => {
    // Handle validation errors
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
  
    // Handle authentication errors
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ error: err.message });
    }
  
    // Handle other errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };

  export default errorHandler;
  