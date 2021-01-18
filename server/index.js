const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const stripe = require("stripe")(process.env.API_KEY);

const app = express();

app.use(cors());

app.use(express.json());

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { token, number } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotency_key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: number * 100,
        currency: "CAD",
        customer: customer.id,
        receipt_email: token.email,
        description: "LuxBux",
      },
      {
        idempotency_key,
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log("Listening on port 8080"));
