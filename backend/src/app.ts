import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ocrRoute from './routes/ocrRoutes'


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/ocr",ocrRoute);

app.listen(5000, () => {
  console.log(" server started at 5000");
});
