import { useState } from "react";

const StaticLine = ({ text, value }) => {
  if (text === "positive") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    );
  }
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  if (good || neutral || bad) {
    return (
      <div>
        <h1>Statistics</h1>
        <table>
          <tbody>
            <StaticLine text="good" value={good} />
            <StaticLine text="neutral" value={neutral} />
            <StaticLine text="bad" value={bad} />
            <StaticLine text="all" value={good + neutral + bad} />
            <StaticLine
              text="average"
              value={(good * 1 + bad * -1) / (good + neutral + bad)}
            />
            <StaticLine
              text="positive"
              value={(good / (good + neutral + bad)) * 100}
            />
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
