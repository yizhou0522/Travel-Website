const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const { createServer } = require('http');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
if (process.env.NODE_DEV === 'development') {
  app.use(morgan('dev')); //check morgan github page for details
}
//1. middlewares
app.use(express.json()); //middleware; stands between request and response
app.use(express.static(`${__dirname}/public`));
// allow access to static file
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
//key
// middleware func should put before app.router in js code!
// js req res cycle is based on orders! otherwise middleware won't response at all
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// route handlers refactoring
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour); //data update
// app.delete("/api/v1/tours/:id", deleteTour);

// 3. routes
// further refactoring based on above code

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//key mounting of routers

module.exports = app;
