import 'dotenv/config'
import express from 'express'
import cors from 'cors' 
import helmet from 'helmet'

const app = express(); 

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());

app.get("/", (req: any, res:any) => {
  res.send("hello world");
});

const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
   console.log(`listening on port ${PORT}`)
});