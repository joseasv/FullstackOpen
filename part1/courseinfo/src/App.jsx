/*Header takes care of rendering the name of the course,
Content renders the parts and their number of exercises and
Total renders the total number of exercises.
*/

const Header = (props) => {
  return (
    <>
      <h1>
        {props.courseName}
      </h1>
    </>
  )
}

const Part = (props) => {
  //console.log("Part props", props)
  return (
    <>
      <p>
        {props.part} {props.exercises}
      </p>
    </>
  )
}

const Content = (props) => {
  //console.log("Content props.data", props.data)

  return (
    <>
      <Part part = {props.data[0].part} exercises = {props.data[0].exercises} />
      <Part part = {props.data[1].part} exercises = {props.data[1].exercises} />
      <Part part = {props.data[2].part} exercises = {props.data[2].exercises} />
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>
        Number of exercises {props.total}
      </p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  const contentData = [
    {
      part: part1,
      exercises: exercises1
    },
    {
      part: part2,
      exercises: exercises2
    },
    {
      part: part3,
      exercises: exercises3
    }
  ]

  return (
    <div>
      <Header courseName = {course}/>
      <Content data = {contentData} />
      <Total total = {exercises1 + exercises2 + exercises3} />
    </div>
  )
}

export default App