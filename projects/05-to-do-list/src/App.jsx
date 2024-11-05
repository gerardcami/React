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

    event.preventDefault();
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

      <TaskForm onTaskSubmit={handleTaskInput} />

      <hr />

      <List list={taskList} onRemoveTask={handleRemoveTask} />
    </>
  );
}

const TaskForm = ({ onTaskSubmit }) => (
  <form className="flex flex-col gap-4" onSubmit={onTaskSubmit}>
    <InputWithLabel id="addTask" name="taskTitle">
      New task:{" "}
    </InputWithLabel>
    <button type="submit">Add</button>
  </form>
);

const InputWithLabel = ({ id, name, type = "text", children }) => {
  return (
    <div>
      <label htmlFor={id}>{children}</label>
      <input className="rounded" id={id} name={name} type={type} />
    </div>
  );
};

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
