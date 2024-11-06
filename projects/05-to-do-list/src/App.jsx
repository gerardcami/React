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
        currentStatus: "PENDANT",
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

  const handleTitleChange = (item, newTitle) => {
    const updatedItem = { ...item, title: newTitle };

    // Cambia solo el elemento que coincide con el ID que buscamos
    const newTaskList = taskList.map((task) =>
      task.objectID === item.objectID ? updatedItem : task
    );

    setTasks(newTaskList);
  };

  const handleStatusChange = (item, newStatus) => {
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

      <Table
        list={taskList}
        onRemoveTask={handleRemoveTask}
        onTitleChange={handleTitleChange}
        onSelectorChange={handleStatusChange}
      />
    </>
  );
}

const TaskForm = ({ onTaskSubmit }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleInputChange = (event) => {
    setTaskTitle(event.target.value);
  };
  return (
    <form className="flex gap-4" onSubmit={onTaskSubmit}>
      <InputWithLabel
        id="addTask"
        name="taskTitle"
        onChange={handleInputChange}
      >
        New task:{" "}
      </InputWithLabel>
      <button type="submit" disabled={!taskTitle}>
        Add
      </button>
    </form>
  );
};

const InputWithLabel = ({ id, name, type = "text", children, onChange }) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} name={name} type={type} onChange={onChange} />
    </>
  );
};

const Table = ({ list, onRemoveTask, onTitleChange, onSelectorChange }) => {
  const getFilteredTasks = (filter) => {
    return list.filter((task) => task.currentStatus === filter);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {getFilteredTasks("PENDANT").length > 0 && (
          <TaskSection
            title="Pendant"
            tasks={getFilteredTasks("PENDANT")}
            onTitleChange={onTitleChange}
            onSelectorChange={onSelectorChange}
            onRemoveTask={onRemoveTask}
          />
        )}
        {getFilteredTasks("IN_PROGRESS").length > 0 && (
          <TaskSection
            title="In progress"
            tasks={getFilteredTasks("IN_PROGRESS")}
            onTitleChange={onTitleChange}
            onSelectorChange={onSelectorChange}
            onRemoveTask={onRemoveTask}
          />
        )}
        {getFilteredTasks("DONE").length > 0 && (
          <TaskSection
            title="Done"
            tasks={getFilteredTasks("DONE")}
            onTitleChange={onTitleChange}
            onSelectorChange={onSelectorChange}
            onRemoveTask={onRemoveTask}
          />
        )}
      </tbody>
    </table>
  );
};

const TaskSection = ({
  title,
  tasks,
  onTitleChange,
  onSelectorChange,
  onRemoveTask,
}) => (
  <>
    <tr className="bg-[#393939]">
      <th>{title}</th>
    </tr>

    {tasks.map((task) => (
      <TaskRow
        key={task.objectID}
        item={task}
        onTitleChange={onTitleChange}
        onSelectorChange={onSelectorChange}
        onRemoveTask={onRemoveTask}
      />
    ))}
  </>
);

const TaskRow = ({ item, onTitleChange, onSelectorChange, onRemoveTask }) => (
  <tr>
    <td>
      <input
        type="text"
        value={item.title}
        onChange={(event) => onTitleChange(item, event.target.value)}
      />
    </td>
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
      onChange={(event) => onSelectorChange(item, event.target.value)}
    >
      <option value="PENDANT">Pendant</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="DONE">Done</option>
    </select>
  );
};

export default App;
