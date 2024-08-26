interface BMIValues {
  height: number;
  mass: number;
}

interface Input {
  target: number;
  period: number[];
}

const bmiParseArguments = (args: string[]): BMIValues => {
  //console.log("args.length ", args.length )

  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      mass: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const exerciseCalcParseArguments = (args: string[]): Input => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (!isNaN(Number(args[2]))) {
    let period: number[] = args.map((hours, index): number => {
      console.log(`${index}: ${hours} `);
      if (index > 2) {
        if (!isNaN(Number(hours))) {
          return Number(hours);
        } else {
          throw new Error("Provided values were not numbers!");
        }
      } else return -1;
    });

    period = period.filter(
      (element) => element !== undefined || element !== -1,
    );

    console.log("period", period);

    return {
      target: Number(args[2]),
      period,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export { bmiParseArguments, exerciseCalcParseArguments };