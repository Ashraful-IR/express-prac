function requireApiKey(req, res, next) {
  const expectedApiKey = process.env.API_KEY;
  const apiKey = req.header("x-api-key");

  if (!expectedApiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return next();
}

export default requireApiKey;
