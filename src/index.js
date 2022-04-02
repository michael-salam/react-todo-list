import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import logo from "./todo-list.png";
import emptyStatePrompt from "./no-data.png";
// localStorage.clear()

document.querySelector("body").style.width = "90%";
document.querySelector("body").style.margin = "0 auto";

function App() {
  const [items, setItems] = useState([]);

  // only run once the first time this component is rendered
  useEffect(() => {
    if (localStorage.getItem("todoData")) {
      setItems(JSON.parse(localStorage.getItem("todoData")));
    }
  }, []);

  // run every time our data state changes
  useEffect(() => {
    localStorage.setItem("todoData", JSON.stringify(items));
  }, [items]);

  if (items.length !== 0) {
    return (
      <>
        <TimeArea />
        <AppHeader />
        <TodoForm setItems={setItems} items={items} />
        {/* <Filter setItems={setItems} items={items} /> */}
        <ul className="list-unstyled">
          {items.map((item) => {
            return (
              <TodoEntries
                setItems={setItems}
                items={items}
                id={item.id}
                task={item.task}
                done={item.done}
                time={item.time}
                key={item.id}
              />
            );
          })}
        </ul>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <TimeArea />
        <AppHeader />
        <TodoForm setItems={setItems} items={items} />
        {/* <Filter setItems={setItems} /> */}
        <EmptyState />
        <Footer />
      </>
    );
  }
}

function TimeArea() {
  const [theTime, setTheTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    setInterval(() => {
      const interval = setTheTime(new Date().toLocaleString());
      return () => clearInterval(interval);
    }, 1000);
  }, []);

  return <span className="text-muted ml-3">{theTime}</span>;
}

function AppHeader() {
  return (
    <div className="d-flex flex-column align-items-center pb-3">
      <h1>The Todo List App</h1>
      <img
        style={{ height: "7rem", width: "7rem" }}
        className="p-2 text-center"
        src={logo}
        alt="Todo logo"
      />
    </div>
  );
}

function TodoForm(props) {
  const [task, setTask] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (document.getElementById("task-input").value.trim() !== "") {
      props.setItems((prev) =>
        prev.concat({
          task: task.trim(),
          id: Date.now(),
          done: false,
          time: new Date().toLocaleString(),
        })
      );
      setTask("");
    } else alert("Please enter a task");
    if (e.key === "Enter") {
      if (document.getElementById("task-input").value.trim() !== "") {
        props.setItems((prev) =>
          prev.concat({
            task: task.trim(),
            id: Date.now(),
            done: false,
            time: new Date().toLocaleString(),
          })
        );
        setTask("");
      }
    }
  }

  function handleReset(e) {
    e.preventDefault();
    props.setItems([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="d-flex justify-content-center align-items-center text-center px-3 rounded bg-dark"
    >
      <input
        id="task-input"
        style={{ appearance: "none", border: "none", outline: "none" }}
        className="flex-grow-1 m-2 p-2 rounded"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What do you want to do today?"
      ></input>
      <button type="submit" className="btn btn-sm btn-info m-2">
        &#x2795;
      </button>
      <button type="reset" className="btn btn-sm btn-warning m-1">
        &#x1f9f9;
      </button>
    </form>
  );
}

/* function Filter() {
  function handleFilterAll() {
  }
  function handleFilterPending() {
  }
  function handleFilterCompleted() {
  }

  const buttonStyles = {
    appearance: 'none',
    border: 'none',
    outline: 'none',
    width: '10rem'
  }

  return (
    <div className="d-flex justify-content-space-around pt-1">
      <button className="bg-dark text-light" style={buttonStyles} onClick={handleFilterAll}>All</button>
      <button className="mx-2" style={buttonStyles} onClick={handleFilterPending}>Pending</button>
      <button className="mx-2" style={buttonStyles} onClick={handleFilterCompleted}>Completed</button>
    </div>
  )
} */

function EmptyState() {
  return (
    <div className="d-flex flex-column align-items-center mt-3">
      <img
        style={{ height: "12rem" }}
        src={emptyStatePrompt}
        alt="No tasks yet"
      />
      <p className="text-muted">
        You currently have no tasks set. Enter a todo in the field above and
        click "+" or press the 'enter' key to add it.
      </p>
    </div>
  );
}

function TodoEntries(props) {
  function handleEdit() {
    const editTask = prompt("Edit task");
    props.setItems((prev) =>
      prev.map((item) => {
        if (item.id === props.id) {
          return { ...item, task: editTask };
        }
        return item;
      })
    );
  }

  function handleDelete() {
    props.setItems((prev) => prev.filter((item) => item.id !== props.id));
  }

  function toggleTaskDone() {
    props.setItems((prev) =>
      prev.map((item) => {
        if (item.id === props.id) {
          return { ...item, done: !props.done };
        }
        return item;
      })
    );
  }

  return (
    <li className="border-bottom d-flex align-items-center py-2">
      <span
        className="flex-grow-1 mx-3"
        style={{
          textDecoration: props.done && "line-through",
        }}
      >
        {props.task}
      </span>
      <span className="d-flex flex-wrap align-items-center">
        {props.time}
        <input
          className="mx-2"
          defaultChecked={props.done}
          onChange={toggleTaskDone}
          type="checkbox"
        />
        <button onClick={handleEdit} className="btn btn-sm m-1">
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger btn-sm m-1">
          Delete
        </button>
      </span>
    </li>
  );
}

function Footer() {
  const [likeCount, setLikeCount] = useState(
    JSON.parse(localStorage.getItem("likes"))
  );
  const [dislikeCount, setDislikeCount] = useState(
    JSON.parse(localStorage.getItem("likes"))
  );

  useEffect(() => {
    if (localStorage.getItem("likes") && localStorage.getItem("dislikes")) {
      setLikeCount(JSON.parse(localStorage.getItem("likes")));
      setDislikeCount(JSON.parse(localStorage.getItem("dislikes")));
    }
  }, []);

  function increaseLikeHandler() {
    setLikeCount((prev) => {
      let likes = likeCount;
      likes = prev + 1;
      localStorage.setItem("likes", JSON.stringify(likes));
      return likes;
    });
  }
  function increaseDislikeHandler() {
    setDislikeCount((prev) => {
      let dislikes = prev + 1;
      localStorage.setItem("dislikes", JSON.stringify(dislikes));
      return dislikes;
    });
  }

  return (
    <div className="absolute-bottom mt-5 mb-3 p-2 bg-dark rounded">
      <button
        onClick={increaseLikeHandler}
        className="btn btn-success btn-sm mx-1"
      >
        Like
      </button>
      <span className="mx-2 text-light">{likeCount}</span>
      <button
        onClick={increaseDislikeHandler}
        className="btn btn-danger btn-sm"
      >
        Dislike
      </button>
      <span className="mx-2 text-light">{dislikeCount}</span>
      <span className="text-light">Made by Michael Salam, Anchor</span>
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
