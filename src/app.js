const express = require("express");
const app = express();
const morgan = require("morgan");

const AppError = require("./utils/appError");
const { globalErrorHandler } = require("./controllers/error/error.controllers");
const tourRouter = require("./routes/tours/tours.router");
const userRouter = require("./routes/users/users.router");
const authRouter = require("./routes/auth/auth.router");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("tiny"));
}

// application middlewares

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// application routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1",authRouter)

// if no route is found
app.all("*", function (req, res, next) {
  next(new AppError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
