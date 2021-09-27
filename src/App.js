
import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const App = () => {

  const [tasks, setTasks] = useState([])

  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {

    const getTasks = async () => {

      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)

    }

    getTasks()

  }, []) // Dependency value for something like user

  const fetchTasks = async () => {

    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    console.log(data)
    return data

  }

  const fetchSpecificTask = async (id) => {

    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data

  }

  // Add a specific task
  const addTask = async (task) => {

    // json-server automatically assigns an id value
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ ...task })
    })

    const data = await res.json()

    setTasks([...tasks, data])

  }

  // Delete a specific task
  const deleteTask = async (id) => {

    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
    // No catch, no error handling
    setTasks(tasks.filter(task => task.id !== id))

  }

  // Toggle a specific task's reminder

  const toggleReminder = async (id) => {

    const taskToToggle = await fetchSpecificTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
    const data = await res.json()

    setTasks(tasks.map(task => task.id === id ? { ...task, reminder: data.reminder } : task))

  }

  // Toggle showAddTask state
  const toggleShowAddTask = () => {

    setShowAddTask(!showAddTask)

  }

  return (
    <Router>
      <div className='container'>

        <Header
          title='Task Tracker'
          toggleShowAddTask={toggleShowAddTask}
          showAdd={showAddTask}
        />

        <Route path='/' exact render={(props) =>
          <div>
            {showAddTask && <AddTask onAdd={addTask} />}
            {
              tasks.length
                ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
                : 'No current tasks'
            }
          </div>
        } />
        <Route path='/about' component={About} />
        <Footer />
      </div >
    </Router>
  )

}

export default App
