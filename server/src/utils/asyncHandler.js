export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error("🔥 Error:", err); // <-- Add this line
    res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
      data: null,
      errors: [],
    });
  }
};
