/**
 * Single task related logics
 */
import React from "react";
import "../styles/task.css"

function Task({ task, onDelete, onUpdate }) {

    return (
        <div className="task-container">
            <p className="task-title"><strong>Task Title: </strong>{task.title}</p>
            <p className="task-description"><strong>Task Description: </strong>{task.description}</p>
            <p className="task-complete">
                <strong>Task Complete: </strong> {task.iscomplete ? "True" : "False"}
            </p>
            <button 
                className="update-button" 
                onClick={() => onUpdate()}
            >
                Edit Task
            </button>
            <button className="delete-button" onClick={() => onDelete(task.id)}>
                Delete
            </button>

        </div>
    );
}

export default Task