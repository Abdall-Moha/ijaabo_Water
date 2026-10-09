import rateLimit from "express-rate-limit";

const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many submissions. Please try again later." }
});

export default publicSubmissionLimiter;
