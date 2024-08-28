import { exerciseCalcParseArguments } from "./parsers";

export interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

const calculateExercise = (
  dailyExerciseHours: number[],
  target: number,
): Result => {
  const periodLength: number = dailyExerciseHours.length;
  const trainingDays: number = dailyExerciseHours.reduce((days, day) => {
    if (day > 0) {
      return days + 1;
    } else {
      return days;
    }
  }, 0);

  const average: number =
    dailyExerciseHours.reduce((hours, day) => hours + day) /
    dailyExerciseHours.length;
  const success: boolean = average >= target;
  let ratingDescription: string = "bad";
  let rating: number = 1;
  if (success) {
    rating = 3;
    ratingDescription = "good job!";
  } else {
    if (target - average < 0.5) {
      rating = 2;
      ratingDescription = "not too bad but could be better";
    }
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { period, target } = exerciseCalcParseArguments(process.argv);
    console.log(calculateExercise(period, target));
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}

export { calculateExercise };