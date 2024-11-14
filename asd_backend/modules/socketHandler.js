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
    // 접속 시 서버에서 실행되는 코드
    const req = socket.request;
    const socket_id = socket.id;
    const client_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("connection!");
    console.log("socket ID : ", socket_id);
    console.log("client IP : ", client_ip);

    user[socket.id] = { nickname: "users nickname", point: 0 };

    socket.on("disconnect", () => {
      // 사전 정의 된 callback (disconnect, error)
      //console.log(socket.id, " client disconnected");
      delete user[socket.id];
    });
    socket.on("event1", (msg) => {
      // 생성한 이벤트 이름 event1 호출 시 실행되는 callback
      console.log(msg);
      socket.emit("getID", socket.id);
    });

    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      console.log("join_room에서 roomName은", roomName);
      socket.to(roomName).emit("welcome");
    });

    socket.on("offer", (offer, roomName) => {
      console.log("offer에서 roomName은", roomName);
      socket.to(roomName).emit("offer", offer);
    });

    socket.on("answer", (answer, roomName) => {
      console.log("answer에서 roomName은", roomName);
      socket.to(roomName).emit("answer", answer);
    });

    socket.on("ice", (ice, roomName) => {
      console.log("ice에서 roomName은", roomName);
      socket.to(roomName).emit("ice", ice);
    });

    // 모두에게
    socket.on("input", (data) => {
      const { id: user_id, data: message } = data;
      const time = new Date().toLocaleTimeString(); // 입력 시간
      //io.emit("msg", { id: socket.id, message: data });
      io.emit("msg", { id: user_id, message, time });
      //console.log(socket.id, " 가 보낸 메시지 : ", data);
      console.log(user);
    });
  });
};
module.exports = socketHandler;
