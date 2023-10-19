const dotenv = require("dotenv");
dotenv.config({ path: "utils/.env" });
const express = require("express");
const http = require("http");
const app = express();
const socketIo = require("socket.io");
const server = http.createServer(app);
// const io = socketIo(server);
const cors = require("cors");
const socketModel = require("./models/stock");
require("./utils/db");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
      origin: '*', // Replace with your React app's URL
      methods: 'GET,POST',
    };


app.use(cors(corsOptions));


//routes
const indexRouter = require("./routes/index");

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

const io = require('socket.io')(server, {cors: {origin: "*"}});

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
