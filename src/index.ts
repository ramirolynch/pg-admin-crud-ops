// require the express module
import express from "express";
import pg from "pg-promise";
// require the cors module
import cors from "cors";
import backendroutes from "./routes/backroutes";

// creates an instance of an Express server
const app = express();

const db = pg()({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "casapuerta",
  database: "Sneakers",
});

db.many("select * from sneakers")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

// enable Cross Origin Resource Sharing so this API can be used from web-apps on other domains
app.use(cors());

// allow POST and PUT requests to use JSON bodies
app.use(express.json());

app.use("/", backendroutes);

// define the port
const port = 3000;

// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));
