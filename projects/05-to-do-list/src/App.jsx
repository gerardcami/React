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

  const handleRemoveTask = (item) => {
    const newTaskList = taskList.filter(
      (task) => item.objectID !== task.objectID
    );
    setTasks(newTaskList);
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
  };

  return (
    <>
      <h1>To-do List</h1>

      <form className="flex flex-col gap-4" onSubmit={handleTaskInput}>
        <label htmlFor="newTask">New Task: </label>
        <input className="rounded" name="taskTitle" id="newTask" type="text" />

        <button type="submit">Add</button>
      </form>

      <List list={taskList} onRemoveTask={handleRemoveTask} />
    </>
  );
}

const List = ({ list, onRemoveTask }) => (
  <ul>
    {list?.map((item) => (
      <li key={item.objectID}>
        <div>
          {item.title} {item.currentStatus}
          <button onClick={() => onRemoveTask(item)}>Remove</button>
        </div>
      </li>
    ))}
  </ul>
);

export default App;
