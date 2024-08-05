import { useState, useEffect } from "react";

export default function Avatar({ username, userId }) {
    const [colorAssigned, setColorAssigned] = useState(null);

    const colors = [
        'bg-red-300',     // Light red
        'bg-orange-300',  // Light orange
        'bg-yellow-300',  // Light yellow
        'bg-green-300',   // Light green
        'bg-teal-300',    // Light teal
        'bg-blue-300',    // Light blue
        'bg-indigo-300',  // Light indigo
        'bg-purple-300',  // Light purple
        'bg-pink-300',    // Light pink
        'bg-gray-300',    // Light gray
    ];

    useEffect(() => {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * colors.length);
        // Get the color at the random index
        const randomColor = colors[randomIndex];
        setColorAssigned(randomColor);
    }, []); // Empty dependency array means this effect runs once

    return (
        <div className={`w-8 h-8 rounded-full flex items-center ${colorAssigned}`}>
            <div className="text-center w-full font-bold">
                {username[0]}
            </div>
        </div>
    );
}
