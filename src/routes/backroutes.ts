// require the express module
import express, { json } from "express";
import pg from "pg-promise";

const db = pg()({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "Sneakers",
});

db.many("select * from sneakers")
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

// create a new Router object
const routes = express.Router();

routes.get("/sneakers", (req, res) => {
  db.many("select * from sneakers")
    .then((data) => res.json(data))
    .catch((error) => console.log(error));
});

routes.get("/sneakers/:id", (req, res) => {
  db.oneOrNone("SELECT * FROM sneakers WHERE id = ${id}", { id: req.params.id })
    .then((sneakers) => res.json(sneakers))
    .catch((error) => console.log(error));
});

routes.post("/add-sneaker", (req, res) => {
  db.one(
    "INSERT INTO sneakers(name, manufacturer, price,inventory) VALUES(${name}, ${manufacturer}, ${price}, ${inventory}) returning id",
    {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      price: req.body.price,
      inventory: req.body.inventory,
    }
  )
    // .then((id) => {
    //   db.oneOrNone("SELECT * FROM sneakers WHERE id = ${id}", { id: id.id });
    // })
    .then((data) => res.json(data))

    .catch((error) => console.log(error));
});

routes.put("/sneakers/:id", (req, res) => {
  db.many("select * from sneakers")
    .then((sneakers) => {
      let sneaker: any = sneakers.find((s) => s.id === +req.params.id);

      if (!sneaker) {
        res.status(404).json({ error: "Sneaker not found" });
      } else {
        db.none(
          "update sneakers set id=${id}, name=${name}, manufacturer=${manufacturer}, price=${price}, inventory=${inventory} where id = ${id}",
          {
            id: +req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            price: req.body.price,
            inventory: req.body.inventory,
          }
        );

        res.send(req.body);
      }
    })

    .catch((error) => console.log(error));
});

routes.delete("/sneakers/:id", (req, res) => {
  db.many("select * from sneakers")
    .then((sneakers) => {
      let sneaker: any = sneakers.find((s) => s.id === +req.params.id);

      if (!sneaker) {
        res.status(404).json({ error: "Sneaker not found" });
      } else {
        db.none("delete from sneakers where id = ${id}", {
          id: +req.params.id,
        });

        res
          .status(200)
          .json({ message: `Sneaker with id ${+req.params.id} deleted` });
      }
    })

    .catch((error) => console.log(error));
});

export default routes;
