const { Server } = require("socket.io");

const rooms = new Map();

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3000/",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3000/",
        "http://localhost:8000",
        "http://localhost:8000/",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8000/",
      ],
      methods: ["GET", "POST"],
    },
  });

  let user = {};

  io.on("connection", (socket) => {
    const req = socket.request;
    const socket_id = socket.id;
    const client_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userId = req._query.userId;

    console.log("connection!");
    console.log("socket ID : ", socket_id);
    console.log("client IP : ", client_ip);
    console.log("user ID : ", userId);

    const users = {};
    users[socket_id] = { userId };

    socket.on("disconnect", () => {
      delete users[socket_id];
    });

    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });

    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });

    // 특정 이미지를 요청하는 이벤트 ( fe에서 에밋 )
    socket.on("imagePath", (imageName, roomName) => {
      // imgNAme은 ex) 1-1.jpg
      // 이미지 경로
      const imgPath = `/img/${imageName}.jpg`;
      const overlay_image = imgPath;
      // FE로 이미지 경로 전송 ( fe에서 on)
      socket.to(roomName).emit("overlay_image", overlay_image);
    });

    // 수업 종료 처리
    socket.on("end_class", (roomName) => {
      // 해당 방(roomId)에 있는 모든 클라이언트에게 종료 메시지 전송
      socket.to(roomName).emit("alert_end");
    });

    socket.on("EffectData", (DropAnimation, roomName) => {
      // 뭐가 와야되지?
      io.to(roomName).emit("showDropAnimation", DropAnimation);
    });
  });
};

module.exports = { socketHandler, rooms };
