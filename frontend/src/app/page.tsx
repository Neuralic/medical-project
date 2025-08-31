"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Moon, Sun } from "lucide-react";

const API_URL = "http://localhost:8000";

type Detected = {
  age?: number;
  gender?: string;
  condition?: {
    text: string;
    display: string;
    icd10: string;
  };
};

type FHIRBundle = {
  total?: number;
  entry?: Array<{
    resource: {
      id: string;
      name: Array<{ given: string[]; family: string }>;
      gender: string;
      birthDate: string;
    };
  }>;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FHIRBundle | null>(null);
  const [detected, setDetected] = useState<Detected>({});
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  /* dark-mode toggle */
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  /* suggestions */
  const suggestions = useMemo(
    () => [
      "Show me all diabetic patients over 50",
      "Female patients with hypertension",
      "Male patients with asthma",
      "Patients with copd",
      "Women with diabetes and age over 40",
    ],
    []
  );

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/parse`, { query });
      setResults(data.results ?? null);
      setDetected(data.detected ?? {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ageChart = useMemo(() => {
    if (!results?.entry?.length) return [];
    const buckets = { "0-19": 0, "20-39": 0, "40-59": 0, "60-79": 0, "80+": 0 };
    for (const e of results.entry) {
      const age = new Date().getFullYear() - new Date(e.resource.birthDate).getFullYear();
      if (age < 20) buckets["0-19"]++;
      else if (age < 40) buckets["20-39"]++;
      else if (age < 60) buckets["40-59"]++;
      else if (age < 80) buckets["60-79"]++;
      else buckets["80+"]++;
    }
    return Object.entries(buckets).map(([k, v]) => ({ range: k, count: v }));
  }, [results]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold tracking-tight">AI on FHIR</h1>
        <button
          onClick={() => setDark(!dark)}
          className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <section className="max-w-2xl mx-auto mt-10 px-4">
        <label className="block mb-2 text-sm font-medium">Natural-language query</label>
        <div className="relative">
          <input
            list="suggestions"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Show me diabetic women over 50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <datalist id="suggestions">
            {suggestions.map((s, i) => (
              <option key={i} value={s} />
            ))}
          </datalist>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </section>

      {detected?.condition && (
        <section className="max-w-2xl mx-auto mt-6 px-4">
          <p className="text-sm">
            Detected: <span className="font-semibold">{detected.condition.display}</span> •
            {detected?.gender && ` Gender: ${detected.gender} •`}
            {detected?.age && ` Age ≥ ${detected.age}`}
          </p>
        </section>
      )}

      {results?.entry?.length && (
        <>
          <section className="max-w-4xl mx-auto mt-8 px-4">
            <h2 className="text-lg font-semibold mb-4">Age distribution</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageChart}>
                  <XAxis dataKey="range" tick={{ fill: dark ? "#cbd5e1" : "#475569" }} />
                  <YAxis allowDecimals={false} tick={{ fill: dark ? "#cbd5e1" : "#475569" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: dark ? "#1e293b" : "#fff",
                      border: "none",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="max-w-4xl mx-auto mt-8 mb-12 px-4">
            <h2 className="text-lg font-semibold mb-4">Patient list</h2>
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-left">Birth Date</th>
                    <th className="px-4 py-3 text-left">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {results.entry.map((e) => {
                    const age = new Date().getFullYear() - new Date(e.resource.birthDate).getFullYear();
                    return (
                      <tr key={e.resource.id} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-3">
                          {e.resource.name[0]?.given?.join(" ")} {e.resource.name[0]?.family}
                        </td>
                        <td className="px-4 py-3 capitalize">{e.resource.gender}</td>
                        <td className="px-4 py-3">{e.resource.birthDate}</td>
                        <td className="px-4 py-3">{age}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
