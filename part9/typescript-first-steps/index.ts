import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercise, Result } from "./exerciseCalculator";
const app = express();

app.use(express.json());

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

app.post("/exercise", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target } = req.body;
  if (daily_exercises !== undefined && target !== undefined) {
    if (!isNaN(Number(target)) && Array.isArray(daily_exercises)) {
      const result: Result = calculateExercise(daily_exercises, Number(target));
      res.send(result);
    } else {
      res.send({
        error: "malformatted parameters",
      });
    }
  } else {
    res.send({ error: "parameters missing" });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});