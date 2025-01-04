const logger = (req, res, next) => {
    const startTime = Date.now(); // Record the start time
  
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode } = res;
      const responseTime = Date.now() - startTime; // Calculate response time
  
      // Log the details
      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`
      );
    });
  
    next(); // Call the next middleware or route handler
  };
  
module.exports = logger;
  