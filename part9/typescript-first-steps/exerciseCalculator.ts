interface Result {
    periodLength: number,
    trainingDays: number,
    target: number,
    average: number,
    success: boolean,
    rating: number,
    ratingDescription: string
}

const calculateExercise = (dailyExerciseHours: number[], target: number): Result => {

    const periodLength = dailyExerciseHours.length
    const trainingDays = dailyExerciseHours.reduce((days, day) => {if (day > 0) {
        return days + 1
    } else {
        return days
    }}, 0)

    const average = dailyExerciseHours.reduce((hours, day) => hours + day) / dailyExerciseHours.length
    const success = average >= target
    let ratingDescription = "try to do more exercise!"
    let rating = 1
    if (success) {
        rating = 3
        ratingDescription = "good job!"
    } else {
        if (target - average < 0.5) {
            rating = 2
            ratingDescription = "not too bad but could be better"
        }
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    }

}



console.log(calculateExercise([3, 0, 2, 4.5, 0, 3, 1], 2))