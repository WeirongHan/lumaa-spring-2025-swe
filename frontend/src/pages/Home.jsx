/**
 * Home page related logics
 */
import {useState, useEffect} from "react"
import api from "../api"
import Task from "../components/Task"
import TaskForm from "../components/TaskForm"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const navigate = useNavigate();

    // list tasks when visit the page
    useEffect(() => {
        gettasks();
    }, []);

     // retrieve tasks from backend
    const gettasks = () => {
        api.get("/tasks/")
        .then(res => res.data)
        .then((data) => {setTasks(data); console.log(data)})
        .catch((err) => alert(err));
    }

    // create or update task
    const handleTaskSubmit = (taskData) => {
        if (editTask) {
            // update task with task id
            api.put(`/tasks/${editTask.id}`, taskData)
            .then((res) => {
                if (res.status === 200) {
                    alert("Task updated!");
                    gettasks();
                    // exit edit
                    setEditTask(null);
                    setShowForm(false);
                } else {
                    alert("Failed to update task.");
                }
            })
            .catch((error) => alert(error));
        } else {
            // Create a new task
            api.post("/tasks/", taskData)
            .then((res) => {
                if (res.status === 201) {
                    alert("Task created!");
                    gettasks();
                    setShowForm(false);
                } else {
                    alert("Failed to create task.");
                }
            })
            .catch((err) => alert(err));
        }
    };

    // delete a task with id
    const deleteTask = (id) => {
        api.delete(`/tasks/${id}/`)
        .then((res) => {
            if (res.status === 204) alert("task deleted!");
            else alert("Failed to delete task.");
            gettasks();
        }).catch((error) => alert(error));
    };

    // list every sinlge task in homepage
    return (
        <div>
            <div style={{ display: "flex" }}>
                <button className="logout-button" onClick={() => navigate("/logout")}>
                    Logout
                </button>
            </div>

            <h2>Tasks</h2>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
                <button className="add-task-button" onClick={() => {
                    setShowForm(true);
                    setEditTask(null);
                }}>
                    Add Task
                </button>
            </div>

            <div>
            {tasks.map((task) => (
                <Task 
                    key={task.id} 
                    task={task} 
                    onDelete={deleteTask} 
                    onUpdate={() => {
                        setEditTask(task);
                        setShowForm(true);
                    }}
                />
            ))}
            </div>
            
            {showForm && (
                <TaskForm
                    onSubmit={handleTaskSubmit}
                    existData={editTask}
                    onCancel={() => {
                        setShowForm(false);
                        setEditTask(null);
                    }}
                />
            )}
        </div>
    );
}

export default Home