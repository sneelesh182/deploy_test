const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: accessLogStream,
  })
);
const cors = require("cors");
app.use(cors());
const swaggerUi = require('swagger-ui-express');
const swaggerSpec=require('./src/swagger')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const connectDB = require("./src/configs/mongoose");
const auth = require("./src/middleware/auth");
const userRouter = require("./src/routes/userRouter");
const eventRouter = require("./src/routes/eventRoutes");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const port = 3000;
const url =
  "mongodb+srv://test:test@cluster0.co3xz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
app.use("/user", userRouter);
app.use("/userEvent", auth, eventRouter);
app.listen(port, async () => {
  try {
    await connectDB(url);
    console.log(`server is running on http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
