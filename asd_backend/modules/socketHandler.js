// 아직 기능 X
const { Server } = require("socket.io");

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  let user = {};

  io.on("connection", (socket) => {


    // 특정 이미지를 요청하는 이벤트 ( fe에서 에밋 ) 
    socket.on("sendImage", (imgName) => { // imgNAme은 ex) 1-1.jpg
      // 이미지 경로
      const imgPath = `/asd_backend/img/${imgName}.jpg`
      // FE로 이미지 경로 전송 ( fe에서 on)
      socket.emit("sendImagepath", imgPath);
  });
  });
};
module.exports = socketHandler;
