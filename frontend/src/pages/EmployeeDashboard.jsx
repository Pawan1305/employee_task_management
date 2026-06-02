import { useEffect, useState } from 'react'
import { getTasksApi, updateTaskApi } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_FLOW = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'completed',
}

function EmployeeDashboard() {
  const { auth, clearSession } = useAuth()
  const [tasks, setTasks] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadTasks() {
    try {
      const data = await getTasksApi(auth.token)
      setTasks(data)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function advanceStatus(task) {
    const nextStatus = STATUS_FLOW[task.status]
    if (nextStatus === task.status) {
      return
    }

    try {
      await updateTaskApi(auth.token, task.id, { status: nextStatus })
      setMessage(`Task "${task.title}" updated to ${nextStatus}.`)
      loadTasks()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="dashboard-layout">
      <header className="topbar panel">
        <div>
          <h1>Employee Dashboard</h1>
          <p className="subtitle">Welcome, {auth.user.name}</p>
        </div>
        <button type="button" className="ghost" onClick={clearSession}>Logout</button>
      </header>

      {message ? <p className="message success">{message}</p> : null}
      {error ? <p className="message error">{error}</p> : null}

      <section className="panel table-panel">
        <h2>My Assigned Tasks</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <span className={`chip ${task.status}`}>{task.status}</span>
                  </td>
                  <td>{new Date(task.due_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => advanceStatus(task)}
                      disabled={task.status === 'completed'}
                    >
                      {task.status === 'pending' && 'Start Task'}
                      {task.status === 'in_progress' && 'Mark Completed'}
                      {task.status === 'completed' && 'Completed'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default EmployeeDashboard