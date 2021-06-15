import { useEffect, useState, SyntheticEvent } from 'react';
interface TodoData {
  title: string;
  description: string;
  _id: string;
}

function App() {
  const [todos, setTodos] = useState<TodoData[] | []>([]);
  const [todoId, setTodoId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean | null>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetch('/api/todos')
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setTodos(json);
      })
      .catch((err) => console.log(err));
  }, []);

  const createTodo = async () => {
    try {
      console.log(name, description);
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
      const { todo } = await res.json();

      setTodos([...todos, todo]);
      setName('');
      setDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  const updateTodo = async () => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description, todoId }),
      });
      const json = await res.json();

      const todosCopy = [...todos];
      const index = todos.findIndex((m: TodoData) => m._id === todoId);
      todosCopy[index] = json.todo;

      setTodos(todosCopy);
      setName('');
      setDescription('');
      setUpdating(false);
      setTodoId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const submitForm = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (updating) {
      updateTodo();
    } else {
      createTodo();
    }
  };

  const deleteTodo = async (_id: string) => {
    try {
      await fetch(`/api/todos/${_id}`, { method: 'DELETE' });

      setTodos(todos.filter((m: TodoData) => m._id !== _id));
    } catch (err) {
      console.log(err);
    }
  };

  const setTodoToUpdate = (_id: string) => {
    const todo = todos.find((m: TodoData) => m._id === _id);
    if (!todo) return;
    setUpdating(true);
    setTodoId(todo._id);
    setName(todo.title);
    setDescription(todo.description);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          <h1 className="fw-normal text-center my-3">todos</h1>
          <div className="my-4">
            <form onSubmit={submitForm}>
              <div className="row">
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button type="submit" className="btn btn-success">
                    {updating ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {todos?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>_id</th>
                  <th>title</th>
                  <th>description</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(({ _id, title, description }) => (
                  <tr key={_id}>
                    <td>{_id}</td>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>
                      <button
                        className="btn btn-warning me-3"
                        onClick={() => setTodoToUpdate(_id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteTodo(_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : todos ? (
            <p>No todos</p>
          ) : (
            <p>Loading..</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
