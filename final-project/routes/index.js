const userRoutes = require("./users");
const chatRoutes = require("./chats");
const pdfRoutes = require("./pdfs");

const constructorMethod = app => {
  app.use("/api/users", userRoutes);
  app.use("/api/chatrooms", chatRoutes);
  app.use("/api/pdfs", pdfRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;