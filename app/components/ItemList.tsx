"use client";
import React, { useState } from "react";

interface Item {
  _id: string;
  name: string;
  icon: string;
  expiryDate: string;
}

interface ItemListProps {
  items: Item[];
  onDelete: (selectedItems: string[]) => Promise<void>;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const toggleSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    await onDelete(selectedItems);
    setSelectedItems([]);
    setShowCheckboxes(false);
  };

  const sortedItems = [...items].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  const currentDate = new Date();

  const categorizeItem = (item: any) => {
    const expiryDate = new Date(item.expiryDate);
    const daysRemaining = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) return { label: "EXPIRED", color: "text-red-600", bgColor: "bg-red-100" };
    if (daysRemaining === 0) return { label: "EAT NOW", color: "text-red-600", bgColor: "bg-red-100" };
    if (daysRemaining <= 2) return { label: "EXPIRING SOON", color: "text-red-600", bgColor: "bg-red-100" };
    return { label: "GOOD", color: "text-green-600", bgColor: "bg-green-100" };
  };

  const expiringSoon = sortedItems.filter((item) => {
    const expiryDate = new Date(item.expiryDate);
    return (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) < 2;
  });

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header with Select Items */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">📋 Items</h2>
        <button
          onClick={() => setShowCheckboxes(!showCheckboxes)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
        >
          {showCheckboxes ? "Cancel Selection" : "Select Items"}
        </button>
      </div>

      {/* Delete Selected Button */}
      {showCheckboxes && (
        <button
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
          className="w-100 mb-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:bg-gray-400"
        >
          Delete Selected
        </button>
      )}

      {/* Expiring Soon Section */}
      {expiringSoon.length > 0 && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-sm">
          <h3 className="text-red-700 font-semibold flex items-center">⚠️ Expiring Soon</h3>
          <ul className="mt-2 space-y-2">
            {expiringSoon.map((item, index) => {
              const { label, color } = categorizeItem(item);
              return (
                <li key={item._id || index} className="flex items-center space-x-4 p-4 border rounded-lg bg-red-50 shadow-sm">
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleSelection(item._id)}
                      className="h-5 w-5 text-red-600 rounded-md"
                    />
                  )}
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <p className="text-sm text-gray-600">Expiring: {new Date(item.expiryDate).toDateString()}</p>
                  </div>
                  <span className={`font-bold ${color}`}>{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* All Items Section */}
      <h3 className="mt-6 text-lg font-semibold text-gray-900">All Items</h3>
      <ul className="mt-2 space-y-2">
        {sortedItems.slice(0, 3).map((item, index) => {
          const { label, color, bgColor } = categorizeItem(item);
          return (
            <li key={item._id || index} className={`flex items-center space-x-4 p-4 border rounded-lg ${bgColor} shadow-sm`}>
              {showCheckboxes && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => toggleSelection(item._id)}
                  className="h-5 w-5 text-blue-600 rounded-md"
                />
              )}
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="font-semibold text-gray-900">{item.name}</span>
                <p className="text-sm text-gray-600">Expiring: {new Date(item.expiryDate).toDateString()}</p>
              </div>
              <span className={`font-bold ${color}`}>{label}</span>
            </li>
          );
        })}
      </ul>

      {/* View All Items Button */}
      {sortedItems.length > 3 && (
        <button
          onClick={() => setShowAllItems(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          View All Items
        </button>
      )}

      {/* Popup for Viewing All Items */}
      {showAllItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Items</h3>
            {showCheckboxes && (
              <button
                onClick={handleDelete}
                disabled={selectedItems.length === 0}
                className="w-100 mb-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:bg-gray-400"
              >
                Delete Selected
              </button>
            )}
            <ul className="space-y-2">
              {sortedItems.map((item, index) => {
                const { label, color, bgColor } = categorizeItem(item);
                return (
                  <li key={item._id || index} className={`flex items-center space-x-4 p-4 border rounded-lg ${bgColor} shadow-sm`}>
                    {showCheckboxes && (
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelection(item._id)}
                        className="h-5 w-5 text-blue-600 rounded-md"
                      />
                    )}
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <p className="text-sm text-gray-600">Expiring: {new Date(item.expiryDate).toDateString()}</p>
                    </div>
                    <span className={`font-bold ${color}`}>{label}</span>
                  </li>
                );
              })}
            </ul>
            <button onClick={() => setShowAllItems(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
