import express from "express";
import { calculateBmi } from "./bmiCalculator";
const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  console.log(req.query);
  const { height, weight } = req.query;
  if (height === undefined || weight === undefined) {
    res.send({ error: "malformed parameters" });
  } else {
    if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
      const bmi = calculateBmi(Number(height), Number(weight));

      res.send({ height, weight, bmi });
    } else {
      res.send({ error: "parameters are not numbers" });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});