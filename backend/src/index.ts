import 'dotenv/config'
import express from 'express'
import cors from 'cors' 
import helmet from 'helmet'

//import routes
import userRoute from "./routes/user"

const app = express(); 

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());

//routes
app.use('/user', userRoute);

const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
   console.log(`listening on port ${PORT}`)
});