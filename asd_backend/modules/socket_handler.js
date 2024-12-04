const { Server } = require("socket.io");

const rooms = new Map();

const fs = require("fs");
const path = require("path");

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
      let imgPath;

      imgPath = `/images/teacher/${imageName}.jpg`;

      const overlay_image = imgPath;
      // FE로 이미지 경로 전송 ( fe에서 on)
      socket.to(roomName).emit("overlay_image", overlay_image);
    });

    // 요청된 특정 이미지를 출력 요청하는 이벤트 ( fe에서 에밋 )
    socket.on("selectedimagePath", (imageName, roomName) => {
      const filePath = path.join(
        "../asd_frontend/src/game_page/problemData.json"
      );
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.error("json없음", err);
          return;
        }
        const problemData = JSON.parse(data);
        const selectedData = problemData[imageName];

        const res = {
          text: selectedData.text,
          image:
            selectedData.student_image || `/images/student/${imageName}.png`,
        };

        io.to(roomName).emit("overlay_selected_image", res.image, res);
      });
    });

    // 애니메이션 이벤트 처리
    io.on("connection", (socket) => {
      socket.on("playAnimation", (roomId) => {
        console.log(`애니메이션 이벤트: ${roomId}`);
        socket.to(roomId).emit("playAnimation");
      });
    });

    // 수업 종료 처리
    socket.on("end_class", (roomId) => {
      socket.to(roomId).emit("alert_end");
    });
  });
};

module.exports = { socketHandler, rooms };
