import { useEffect, useMemo, useState } from 'react'
import {
  createTaskApi,
  getTasksApi,
  getUserTasksApi,
  getUsersApi,
  updateTaskApi,
} from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const INITIAL_TASK = {
  title: '',
  description: '',
  assigned_to: '',
  due_date: '',
  status: 'pending',
}

function AdminDashboard() {
  const { auth, clearSession } = useAuth()
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [taskForm, setTaskForm] = useState(INITIAL_TASK)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingPayload, setEditingPayload] = useState({})
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [employeeTasks, setEmployeeTasks] = useState([])

  const employees = useMemo(
    () => users.filter((user) => user.role === 'employee'),
    [users]
  )

  async function loadData() {
    try {
      const [usersData, tasksData] = await Promise.all([
        getUsersApi(auth.token),
        getTasksApi(auth.token),
      ])
      setUsers(usersData)
      setTasks(tasksData)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreateTask(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await createTaskApi(auth.token, taskForm)
      setTaskForm(INITIAL_TASK)
      setMessage('Task created successfully.')
      loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function startEdit(task) {
    setEditingTaskId(task.id)
    setEditingPayload({
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date?.slice(0, 10) || '',
    })
  }

  async function handleLoadEmployeeTasks(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!selectedEmployeeId) {
      setEmployeeTasks([])
      return
    }

    try {
      const data = await getUserTasksApi(auth.token, selectedEmployeeId)
      setEmployeeTasks(data)
      setMessage('Employee tasks loaded successfully.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function saveEdit() {
    if (!editingTaskId) {
      return
    }

    try {
      await updateTaskApi(auth.token, editingTaskId, editingPayload)
      setMessage('Task updated successfully.')
      setEditingTaskId(null)
      setEditingPayload({})
      loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="dashboard-layout">
      <header className="topbar panel">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Welcome, {auth.user.name}</p>
        </div>
        <button type="button" className="ghost" onClick={clearSession}>Logout</button>
      </header>

      {message ? <p className="message success">{message}</p> : null}
      {error ? <p className="message error">{error}</p> : null}

      <section className="split-grid">
        <article className="panel">
          <h2>Employees</h2>
          <ul className="employee-list">
            {employees.map((employee) => (
              <li key={employee.id}>
                <strong>{employee.name}</strong>
                <span>{employee.email}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Create Task</h2>
          <form className="form-grid" onSubmit={handleCreateTask}>
            <label>
              <span>Title</span>
              <input
                value={taskForm.title}
                onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, description: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>Assign Employee</span>
              <select
                value={taskForm.assigned_to}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, assigned_to: Number(event.target.value) })
                }
                required
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Status</span>
              <select
                value={taskForm.status}
                onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label>
              <span>Due Date</span>
              <input
                type="date"
                value={taskForm.due_date}
                onChange={(event) => setTaskForm({ ...taskForm, due_date: event.target.value })}
                required
              />
            </label>
            <button type="submit">Create Task</button>
          </form>
        </article>
      </section>

      <section className="panel table-panel">
        <h2>Tasks By Employee</h2>
        <form className="inline-form" onSubmit={handleLoadEmployeeTasks}>
          <select
            value={selectedEmployeeId}
            onChange={(event) => setSelectedEmployeeId(event.target.value)}
          >
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          <button type="submit">Load Tasks</button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {employeeTasks.length === 0 ? (
                <tr>
                  <td colSpan="3">No tasks loaded.</td>
                </tr>
              ) : (
                employeeTasks.map((task) => (
                  <tr key={`employee-task-${task.id}`}>
                    <td>{task.title}</td>
                    <td>
                      <span className={`chip ${task.status}`}>{task.status}</span>
                    </td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel table-panel">
        <h2>All Tasks</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const inEdit = editingTaskId === task.id
                return (
                  <tr key={task.id}>
                    <td>
                      {inEdit ? (
                        <input
                          value={editingPayload.title}
                          onChange={(event) =>
                            setEditingPayload({ ...editingPayload, title: event.target.value })
                          }
                        />
                      ) : (
                        task.title
                      )}
                    </td>
                    <td>{task.assigned_to_name}</td>
                    <td>
                      {inEdit ? (
                        <select
                          value={editingPayload.status}
                          onChange={(event) =>
                            setEditingPayload({ ...editingPayload, status: event.target.value })
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`chip ${task.status}`}>{task.status}</span>
                      )}
                    </td>
                    <td>
                      {inEdit ? (
                        <input
                          type="date"
                          value={editingPayload.due_date}
                          onChange={(event) =>
                            setEditingPayload({ ...editingPayload, due_date: event.target.value })
                          }
                        />
                      ) : (
                        new Date(task.due_date).toLocaleDateString()
                      )}
                    </td>
                    <td>
                      {inEdit ? (
                        <div className="action-group">
                          <button type="button" onClick={saveEdit}>Save</button>
                          <button
                            type="button"
                            className="ghost"
                            onClick={() => setEditingTaskId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="ghost" onClick={() => startEdit(task)}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard