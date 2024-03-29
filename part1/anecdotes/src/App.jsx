import { useState } from 'react'

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

const Anecdote = ({text, votes}) => (
  <>
    <div>
      {text}
    </div>
    <div>
      has {votes} votes
    </div>
  </>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(new Array(anecdotes.length).fill(0))

  const handleButtonClick = () => setSelected(getRandomInt(0, anecdotes.length))
  const handleVoteClick = () => {
    //console.log("votes", votes)
    const votesCopy = [...votes]
    votesCopy[selected]++
    setVote(votesCopy)
  }

  let anecdoteMaxId = 0
  console.log("votes", votes)
  for (let i = 0; i < anecdotes.length; i++) {
    if (votes[i] > votes[anecdoteMaxId] ) {
      anecdoteMaxId = i
    }
  }
  console.log("anecdoteMaxId", anecdoteMaxId)

  return (
    <>
    <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={handleVoteClick} text={"vote"} />
      <Button handleClick={handleButtonClick} text={"next anecdote"} />
    <h1>Anecdote with most votes</h1>
      <Anecdote text={anecdotes[anecdoteMaxId]} votes={votes[anecdoteMaxId]} />
    </>
  )
}

export default App