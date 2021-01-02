const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const { createServer } = require("http");

const app = express();

//1. middlewares
app.use(morgan("dev")); //check morgan github page for details
app.use(express.json()); //middleware; stands between request and response
app.use((req, res, next) => {
  console.log("hello from the middleware");
  next();
});
//key
// middleware func should put before app.router in js code!
// js req res cycle is based on orders! otherwise middleware won't response at all
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2 route handlers
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}\\starter\\dev-data\\data\\tours-simple.json`)
  //   window slash \\
);
//tours is an array

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  // ? means optional; otherwise users must follow the exact route format defined above
  console.log(req.params);
  //   print out the parameter in the routes
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: "fail", mesaage: "invalid Id" });
  }
  const tour = tours.find((el) => el.id === id);
  //   find specific element in tour array given the index
  //   or we can check the id by using !tour
  res.status(200).json({
    status: "succe  s",
    results: tours.length,
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}\\starter\\dev-data\\data\\tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", mesaage: "invalid Id" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated your tour here...>",
    },
  });
}; //data update
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", mesaage: "invalid Id" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
  //   no content status code 204
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};
// route handlers refactoring
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour); //data update
// app.delete("/api/v1/tours/:id", deleteTour);

// 3. routes
// further refactoring based on above code
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
//key mounting of routers

//  4. start the server
//add item in server, and client should see the item content; at the same time
// server print done
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
