import express from "express";
import {
  getAllUser,
  createUser,
  updatedUser,
  deleteAllUser,
  authentication,
  profileUser,
} from "../controllers/userController";

import {
  verifyAddUser,
  verifyAuthentication,
  verifyEditUser,
} from "../middlewares/verifyUser";

import uploadFile from "../middlewares/userUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express();
app.use(express.json());

app.get(`/`, [verifyToken, verifyRole(["MANAGER"])], getAllUser);
app.post(
  `/`,
  [verifyToken, verifyRole(["MANAGER"]), verifyAddUser],
  createUser
);
app.put(`/:id`, [verifyToken, verifyRole(["MANAGER"]), verifyEditUser], updatedUser);
app.delete(`/:id`,[verifyToken, verifyRole(["MANAGER"])], deleteAllUser);
app.put(`/pic/:id`, [verifyToken, verifyRole(["MANAGER"]), uploadFile.single("profile_picture")], profileUser);

// khusus login tidak boleh ditambah token
app.post(`/login`, verifyAuthentication, authentication);

export default app;
