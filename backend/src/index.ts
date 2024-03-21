import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import cookieParser from "cookie-parser";
import userController from "./controller/user"
import loginController from "./controller/login"
import authController from "./controller/authorize"
import recipeController from "./controller/recipe"
import postController from "./controller/post"
import searchController from "./controller/search";
import s3Controller from "./controller/s3"
import populateES from './scripts/populateES';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:19006',
  credentials: true,
}));

//routes
app.use('/user', userController);
app.use('/login', loginController);
app.use('/authorize', authController);
app.use('/recipe', recipeController);
app.use('/post', postController);
app.use('/search', searchController);
app.use('/s3', s3Controller);

//error handler; must be last
app.use((err: Error, req: express.Request, res: express.Response, next: express.RequestHandler) => {
  console.error(err.stack);
  res.status(500).json(err)
});

const PORT = process.env.PORT || 8080

if (process.argv[2] == "-scripts") {
  populateES();
} else {
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
  })
}

