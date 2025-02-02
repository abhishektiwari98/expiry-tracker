"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Scanner from "./components/Scanner";
import ManualEntry from "./components/ManualEntry";
import ItemList from "./components/ItemList";

export default function Home() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (newItem: any) => {
    await axios.post("/api/items", newItem);
    fetchItems();
  };

  const handleDeleteItems = async (ids: (string | number)[]) => {
    await axios.delete("/api/items", { data: { ids } });
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-center gap-4">
        <ManualEntry onAdd={handleAddItem} />
        <Scanner onScan={(code: string) => console.log("Scanned barcode:", code)} />
      </div>
      <ItemList items={items} onDelete={handleDeleteItems} />
    </div>
  );
}
