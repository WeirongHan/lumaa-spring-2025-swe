/**
 * Add/Update Task related logics
 */
import React, { useState, useEffect } from "react";

function TaskForm({ onSubmit, existData, onCancel }) {
    // Initialize state with either default values for new tasks or existData for updates
    const [title, setTitle] = useState(existData?.title || "");
    const [description, setDescription] = useState(existData?.description || "");
    const [isComplete, setIsComplete] = useState(existData?.isComplete || false);

    // Update state when existData changes for update
    useEffect(() => {
        if (existData) {
            setTitle(existData.title || "");
            setDescription(existData.description || "");
            setIsComplete(existData.isComplete || false);
        }
    }, [existData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, isComplete });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <br />

            <label htmlFor="description">Description:</label>
            <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />

            <label htmlFor="isComplete">Is Complete:</label>
            <select
                id="isComplete"
                name="isComplete"
                value={isComplete}
                onChange={(e) => setIsComplete(e.target.value === "true")}
            >
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select>
            <br />

            <input type="submit" value={existData ? "Update Task" : "Add Task"} />
            <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
                Cancel
            </button>
        </form>
    );
}

export default TaskForm;