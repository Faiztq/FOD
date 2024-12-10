import express from "express";
import cors from "cors";
import MenuRoute from "./routers/menuRoute";
import userRoute from "./routers/userRoute";
import OrderRoute from "./routers/orderRoute";

const PORT: number = 8000;
const app = express();
app.use(cors());

app.use(`/menu`, MenuRoute);
app.use(`/user`, userRoute);
app.use(`/order`, OrderRoute);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
