import axios, { AxiosResponse } from 'axios';
import { useEffect, useState, SyntheticEvent, FC } from 'react';
import { Button, Input } from 'alphaa-components';

interface TodoData {
  title: string;
  description: string;
  _id: string;
}

const App: FC = () => {
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
      const res: AxiosResponse = await axios.post('/api/todos', {
        title: name,
        description: description,
      });
      const todo = res.data;
      console.log(res.data);
      setTodos([...todos, todo]);
      setName('');
      setDescription('');
    } catch (err) {
      console.log(err);
    }
  };

  const updateTodo = async () => {
    try {
      const res = await axios.put(`/api/todos/${todoId}`, {
        title: name,
        description,
      });
      console.log(res.data);
      const todo = res.data;

      const todosCopy = [...todos];
      const index = todos.findIndex((m: TodoData) => m._id === todoId);
      todosCopy[index] = todo;

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
    <>
      <div className="container">
        <div className="form-container">
          <h1>todos</h1>
          <form onSubmit={submitForm}>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ marginLeft: '35px' }}>
              <Button
                label={updating ? 'Update' : 'Create'}
                type="submit"
              ></Button>
            </div>
          </form>
        </div>
        {todos?.length > 0 ? (
          <div className="todo-container">
            {todos.map(({ _id, title, description }) => (
              <div key={_id} className="todo">
                <div
                  style={{
                    width: '20vw',
                  }}
                >
                  <p>
                    <strong>{title}</strong> - {description}
                  </p>
                </div>
                <div style={{ marginRight: '4px' }}>
                  <Button
                    bg="warning"
                    label="Edit"
                    size="small"
                    onClick={() => setTodoToUpdate(_id)}
                  ></Button>
                </div>
                <Button
                  bg="danger"
                  size="small"
                  label="Delete"
                  onClick={() => deleteTodo(_id)}
                ></Button>
              </div>
            ))}
          </div>
        ) : todos ? (
          <p>No todos</p>
        ) : (
          <p>Loading..</p>
        )}
      </div>
    </>
  );
};

export default App;
