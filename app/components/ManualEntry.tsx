"use client";
import React, { useState } from "react";

interface ManualEntryProps {
    onAdd: (item: { name: string; expiryDate: string; icon: string }) => Promise<void>;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onAdd }) => {
    const [item, setItem] = useState({ name: "", expiryDate: "", icon: "" });
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const icons = ["🍎", "🥩", "🍞", "🧀", "🥕", "🥛", "🍗", "🥚", "🍚", "🍫", "🛒"];

    const handleSubmit = async () => {
        if (!item.name || !item.expiryDate || !item.icon) {
            setError("Please select an icon and enter both name and expiry date.");
            return;
        }

        const selectedDate = new Date(item.expiryDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            setError("Expiry date must be today or in the future.");
            return;
        }

        setError("");
        await onAdd(item);
        setItem({ name: "", expiryDate: "", icon: "" });
        setShowModal(false);
    };

    return (
        <div className="flex justify-center mt-4">
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
            >
                ➕ Add Item
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h3>
                        {error && <p className="text-red-500 text-sm">{error}</p>}


                        <div className="flex flex-wrap gap-2 mb-4">
                            {icons.map((icon, index) => (
                                <button
                                    key={index}
                                    onClick={() => setItem({ ...item, icon })}
                                    className={`px-3 py-2 text-lg border rounded-md ${item.icon === icon ? "bg-blue-500 text-white" : "bg-gray-100"
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            className="w-full px-4 py-3 border rounded-md"
                        />
                        <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => setItem({ ...item, expiryDate: e.target.value })}
                            className="w-full px-4 py-3 border rounded-md mt-3"
                        />

                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Add Item
                        </button>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManualEntry;
