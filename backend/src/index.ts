import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import'express-async-errors';
import cookieParser from "cookie-parser";
import loginRoute from "./routes/login"

//import routes
import userController from "./controller/user"

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

//error handler; must be last
app.use((err: Error, req: express.Request, res: express.Response, next: express.RequestHandler) => {
    console.error(err.stack);
    res.status(500).json(err)
});

app.post('/login', loginRoute);


const PORT = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})