const dotenv = require("dotenv");
dotenv.config({ path: "utils/.env" });
const express = require("express");
const http = require("http");
const app = express();
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const cors = require("cors");
const socketModel = require("./models/stock");
require("./utils/db");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const corsOptions = {
//       origin: 'https://6530cc32ea419971e9e43381--starlit-cendol-dea8f5.netlify.app', // Replace with your React app's URL
//       methods: 'GET,POST',
//     };
app.use(cors());

app.use(function (req, res, next) {
  // Mentioning content types;
  res.setHeader("Content-Type", "application/json; charset=UTF-8");

  // Website you wish to allow to connect;
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow;
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow;
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent;
  // to the API (e.g. in case you use sessions);
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//routes
const indexRouter = require("./routes/index");

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Example: Send updated stock prices to clients
  socket.on("updateStockPrice", async (data) => {
    // Handle the data and broadcast the updated price to all connected clients and individual
    if (data.ID) {
      let Id = { _id: data.ID };
      let Update = {
        $set: {
          Price: Math.ceil(Math.random() * 5000),
        },
      };
      let option = { new: true };
      var getSingleSocket = await socketModel.findByIdAndUpdate(
        Id,
        Update,
        option
      );
    }
    socket.emit("stockPriceUpdated", { response: getSingleSocket });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

//starting route
app.use("/api", indexRouter);

server.listen(PORT, () => console.log(`Server Running on Port:${PORT}`));
