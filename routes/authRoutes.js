const {Router} = require("express");
const authRoutes = Router();
const authControllers = require('../controllers/authController');

authRoutes.get("/",authControllers.getHome);
authRoutes.get("/sign-up",authControllers.getSignUpForm);
authRoutes.post("/sign-up",authControllers.userSignUp);
authRoutes.get("/log-in",authControllers.getLoginForm);
authRoutes.post("/log-in",authControllers.userLogin);
authRoutes.post("/log-out", authControllers.userLogout);
authRoutes.get("/join",authControllers.getJoinForm);
authRoutes.post("/join",authControllers.joinClub);
authRoutes.get("/new-message",authControllers.getNewMessageForm);
authRoutes.post("/new-message",authControllers.createMessage);
authRoutes.post("/messages/:id/delete",authControllers.deleteMessage);
authRoutes.get("/admin", authControllers.getAdminForm);
authRoutes.post("/admin", authControllers.becomeAdmin);

module.exports= authRoutes