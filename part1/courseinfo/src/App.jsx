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
  console.log("Content props.data", props.data)

  return (
    <>
      <Part part = {props.data[0].name} exercises = {props.data[0].exercises} />
      <Part part = {props.data[1].name} exercises = {props.data[1].exercises} />
      <Part part = {props.data[2].name} exercises = {props.data[2].exercises} />
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
 const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header courseName = {course.name}/>
      <Content data = {course.parts} />
      <Total total = {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  )
}

export default App