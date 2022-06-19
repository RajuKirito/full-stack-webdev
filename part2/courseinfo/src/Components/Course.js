const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => <b>Total of {sum} exercises </b>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => {
      return <Part key={part.id} part={part} />;
    })}
  </>
);

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        sum={course.parts.reduce((a, b) => {
          if (!isNaN(a)) {
            return a + b.exercises;
          }
          return a.exercises + b.exercises;
        })}
      />
    </>
  );
};

export default Course;
