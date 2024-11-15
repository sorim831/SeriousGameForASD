const express = require("express");
const { verifyToken } = require("./middlewares");
const { rooms } = require("../modules/socket_handler");

const app = express();

app.get("/room/:roomId", verifyToken, (req, res) => {
  console.log("in server rooms:", rooms);
  console.log("get get /room/:roomId");
  const roomId = req.params.roomId;
  const user = req.decoded.id;

  console.log("roomid:", roomId);
  console.log("userid:", user);

  res.json({
    roomId: roomId,
    userId: user,
  });
});

module.exports = app;
