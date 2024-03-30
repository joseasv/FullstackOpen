const Header = (props) => {
  return (

      <h1>
        {props.courseName}
      </h1>

  )
}

const Part = (props) => {
  //console.log("Part props", props)
  return (

      <p>
        {props.part} {props.exercises}
      </p>

  )
}

const Content = ({parts}) => {
  //console.log("Content parts", parts)

  return (
    <>
      {parts.map( part => <Part key = {part.id} part = {part.name} exercises = {part.exercises} />)}
    </>
  )
}

const Total = ({total}) => {
  return (
    <b>
      total of {total} exercises
    </b>
  )
}

const Course = ({course}) => {
  //console.log("Course ", course)

  return (
    <div>
      <Header courseName = {course.name} />
      <Content parts = {course.parts} />
      <Total total={course.parts.reduce((total, part) =>
        total += part.exercises
      , 0)} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App