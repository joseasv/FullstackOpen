const calculateBmi = (height: number, mass: number): string => {

    //console.log(`mass ${mass} height ${height}`)
    const bmi:number = mass/((height/100)^2)
    //console.log(`bmi ${bmi}`)

    if (bmi < 16.0) {
        return "Underweight (Severe thinness)"
    }

    if (bmi <= 16.9) {
        return "Underweight (Moderate thinness)"
    }

    if (bmi <= 18.4) {
        return "Underweight (Mild thinness)"
    }

    if (bmi <= 24.90) {
        return "Normal range"
    }

    if (bmi <= 29.9) {
        return "Overweight (Pre-obese)"
    }

    if (bmi <= 34.9) {
        return "Obese (Class I)"
    }

    if (bmi <= 39.9) {
        return "Obese (Class II)"
    }

    if (bmi >= 40) {
        return "Obese (Class III)"
    }
}

const height: number = Number(process.argv[2])
const mass: number = Number(process.argv[3])

console.log(calculateBmi(height, mass))