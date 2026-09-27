"use client";

import { useEffect, useState } from "react";

type ItemStatus = "in-stock" | "low" | "out";

type Item = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: ItemStatus;
};

const initialItems: Item[] = [
  {
    id: 1,
    name: "Milk",
    category: "Dairy",
    quantity: 2,
    status: "in-stock",
  },
  {
    id: 2,
    name: "Tomatoes",
    category: "Produce",
    quantity: 4,
    status: "low",
  },
  {
    id: 3,
    name: "Rice",
    category: "Pantry",
    quantity: 1,
    status: "in-stock",
  },
];

const categories = [
  "Produce",
  "Dairy",
  "Meat",
  "Pantry",
  "Frozen",
  "Household",
];

export default function Home() {
   const [items, setItems] = useState<Item[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Pantry");
  const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const savedItems = localStorage.getItem("pantryshare-items");

  if (savedItems) {
    setItems(JSON.parse(savedItems));
  }

  setLoaded(true);
}, []);

useEffect(() => {
  if (loaded) {
    localStorage.setItem("pantryshare-items", JSON.stringify(items));
  }
}, [items, loaded]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("Pantry");

  function addItem() {
    if (!name.trim()) return;

    const newItem: Item = {
      id: Date.now(),
      name: name.trim(),
      category,
      quantity,
      status: "in-stock",
    };

    setItems((current) => [...current, newItem]);

    setName("");
    setQuantity(1);
    setCategory("Pantry");
    setShowAddForm(false);
  }

  function changeStatus(id: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const nextStatus: Record<ItemStatus, ItemStatus> = {
          "in-stock": "low",
          low: "out",
          out: "in-stock",
        };

        return {
          ...item,
          status: nextStatus[item.status],
        };
      }),
    );
  }

  const shoppingItems = items.filter(
    (item) => item.status === "low" || item.status === "out",
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-sm">
        <header className="border-b border-slate-200 px-5 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                My Household
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                PantryShare
              </h1>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              S
            </div>
          </div>
        </header>

        <section className="flex-1 px-5 pb-28 pt-5">
          {activeTab === "Pantry" && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Pantry</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {items.length} items in your household
                  </p>
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-lg transition hover:bg-emerald-700"
                  aria-label="Add item"
                >
                  +
                </button>
              </div>

              {showAddForm && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 text-lg font-semibold">Add item</h3>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                    className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                  />

                  <div className="mb-3 flex gap-3">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value)))
                      }
                      className="w-24 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    />

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-medium"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={addItem}
                      className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white"
                    >
                      Add item
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => changeStatus(item.id)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
                        🛒
                      </div>

                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.category} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "in-stock"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "low"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status === "in-stock"
                        ? "In stock"
                        : item.status === "low"
                          ? "Low"
                          : "Out"}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-5 text-center text-xs text-slate-400">
                Tap an item to change its stock status
              </p>
            </>
          )}

          {activeTab === "Shopping List" && (
            <>
              <h2 className="text-xl font-bold">Shopping List</h2>

              <p className="mt-1 text-sm text-slate-500">
                Automatically created from low and out-of-stock items
              </p>

              <div className="mt-5 space-y-3">
                {shoppingItems.length === 0 ? (
                  <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                    <p className="font-semibold text-emerald-700">
                      Shopping list is empty
                    </p>

                    <p className="mt-1 text-sm text-emerald-600">
                      Everything is stocked!
                    </p>
                  </div>
                ) : (
                  shoppingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          {item.category} · Qty {item.quantity}
                        </p>
                      </div>

                      
                      <button
  onClick={() => {
    setItems((current) =>
      current.map((i) =>
        i.id === item.id
          ? { ...i, status: "in-stock" }
          : i
      )
    );
  }}
  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
>
  {item.status === "out" ? "Buy now" : "Running low"}
</button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "Household" && (
            <>
              <h2 className="text-xl font-bold">Household</h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your shared pantry
              </p>

              <div className="mt-5 rounded-2xl border border-slate-100 p-5">
                <p className="text-sm text-slate-500">Household code</p>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-bold tracking-widest">
                    PANTRY24
                  </p>

                  <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">
                    Share
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 p-5">
                <p className="font-semibold">Members</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      S
                    </div>

                    <div>
                      <p className="font-medium">You</p>
                      <p className="text-xs text-slate-500">Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex justify-around">
            {[
              { name: "Pantry", icon: "🥫" },
              { name: "Shopping List", icon: "🛒" },
              { name: "Household", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold ${
                  activeTab === tab.name
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-500"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
}