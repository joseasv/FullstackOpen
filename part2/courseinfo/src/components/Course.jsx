const Header = ({name}) => {
  return (

      <h1>
        {name}
      </h1>

  )
}

const Part = ({part, exercises}) => {
  //console.log("Part props", props)
  return (

      <p>
        {part} {exercises}
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
      <Header name = {course.name} />
      <Content parts = {course.parts} />
      <Total total={course.parts.reduce((total, part) =>
        total += part.exercises
      , 0)} />
    </div>
  )
}

export default Course