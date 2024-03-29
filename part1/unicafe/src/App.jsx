import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticsLine = ({text, value, isPercentage}) => {
  if (isPercentage) {
   return (
      <tr>
        <td>
          {text}
        </td>
        <td>
          {value} %
        </td>
      </tr>
    )
  } else {
      return (
        <tr>
          <td>
            {text}
          </td>
          <td>
            {value}
          </td>
        </tr>
      )
  }
}

const Statistics = ({good, neutral, bad}) =>{
  const allCalc = good + neutral + bad

  if (allCalc !== 0) {
      const averageCalc = allCalc !== 0 ? (good - bad) / allCalc : 0
      const positiveCalc = allCalc !== 0 ? (good * 100) / allCalc : 0

      return (
      <>
        <h1>
          statistics
        </h1>
        <table>
          <StatisticsLine text="good" value={good} isPercentage={false}/>
          <StatisticsLine text="neutral" value={neutral} isPercentage={false}/>
          <StatisticsLine text="bad" value={bad} isPercentage={false}/>
          <StatisticsLine text="all" value={allCalc} isPercentage={false}/>
          <StatisticsLine text="average" value={averageCalc} isPercentage={false}/>
          <StatisticsLine text="positive" value={positiveCalc} isPercentage={true}/>
        </table>
      </>
    )
  } else {
    return (
      <>
        <h1>
            statistics
        </h1>
        No feedback given
      </>
    )
  }
}



const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)

  const handleNeutralClick = () => setNeutral(neutral + 1)

  const handleBadClick = () => setBad(bad + 1)

  return (
    <>
      <h1>
        give feedback
      </h1>
      <div>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App