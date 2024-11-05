import { useState } from "react";
import "./App.css";

function App() {
  const [taskList, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) {
      return [];
    }

    return JSON.parse(storedTasks);
  });

  const handleTaskInput = (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    const newTaskList = [
      ...taskList,
      {
        objectID: crypto.randomUUID(),
        title: data.get("taskTitle"),
        currentStatus: "pendant",
      },
    ];

    setTasks(newTaskList);

    localStorage.setItem("tasks", JSON.stringify(newTaskList));
  };

  return (
    <>
      <h1>To-do List</h1>

      <form className="flex flex-col gap-4" onSubmit={handleTaskInput}>
        <label htmlFor="newTask">New Task: </label>
        <input name="taskTitle" id="newTask" type="text" />

        <button type="submit">Add</button>
      </form>

      <List list={taskList} />
    </>
  );
}

const List = ({ list }) => (
  <ul>
    {list?.map((item) => (
      <li key={item.objectID}>
        <div>
          {item.title} {item.currentStatus}
          <button>remove</button>
        </div>
      </li>
    ))}
  </ul>
);

export default App;
