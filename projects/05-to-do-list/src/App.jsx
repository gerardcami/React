import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [taskList, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) {
      return [];
    }

    return JSON.parse(storedTasks);
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

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
    event.preventDefault();
  };

  const handleRemoveTask = (item) => {
    const newTaskList = taskList.filter(
      (task) => item.objectID !== task.objectID
    );
    setTasks(newTaskList);
    localStorage.setItem("tasks", JSON.stringify(newTaskList));
  };

  const handleStatusChange = (item, newStatus) => {
    console.log(item);
    const updatedItem = { ...item, currentStatus: newStatus };

    const newTaskList = taskList.map((task) =>
      task.objectID === item.objectID ? updatedItem : task
    );

    setTasks(newTaskList);
  };

  return (
    <>
      <h1>To-do List</h1>

      <TaskForm onTaskSubmit={handleTaskInput} />

      <hr />

      <List
        list={taskList}
        onRemoveTask={handleRemoveTask}
        onSelectorChange={handleStatusChange}
      />
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
      <input id={id} name={name} type={type} />
    </div>
  );
};

const List = ({ list, onRemoveTask, onSelectorChange }) => (
  <table>
    <thead>
      <tr>
        <th>Task</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {list?.map((item) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveTask={onRemoveTask}
          onSelectorChange={onSelectorChange}
        />
      ))}
    </tbody>
  </table>
);

const Item = ({ item, onRemoveTask, onSelectorChange }) => (
  <tr>
    <td>{item.title}</td>
    <td>
      <StatusSelector item={item} onSelectorChange={onSelectorChange} />
    </td>
    <td>
      <button type="button" onClick={() => onRemoveTask(item)}>
        Remove
      </button>
    </td>
  </tr>
);

const StatusSelector = ({ item, onSelectorChange }) => {
  return (
    <select
      value={item.currentStatus}
      onChange={(e) => onSelectorChange(item, e.target.value)}
    >
      <option value="PENDANT">Pendant</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="DONE">Done</option>
    </select>
  );
};

export default App;
