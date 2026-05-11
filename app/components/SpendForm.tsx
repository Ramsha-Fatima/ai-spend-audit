"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


import { pricing } from "./lib/pricing";
import { supabase } from "./lib/supabase";

const toolOptions = {
  ChatGPT: ["Plus", "Team", "Enterprise"],
  Claude: ["Pro", "Team", "Enterprise"],
  Copilot: ["Individual", "Business", "Enterprise"],
  Gemini: ["Pro", "Ultra"],
};

export default function SpendForm() {
  const router = useRouter();

  const [tool, setTool] = useState("");
  const [plan, setPlan] = useState("");
  const [cost, setCost] = useState("");
  const [users, setUsers] = useState("");
  const [email, setEmail] = useState("");

  const [tools, setTools] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState("");

  // Load saved tools
  useEffect(() => {
    const savedTools =
      localStorage.getItem("tools");

    if (savedTools) {
      setTools(JSON.parse(savedTools));
    }
  }, []);

  // Save tools
  useEffect(() => {
    localStorage.setItem(
      "tools",
      JSON.stringify(tools)
    );
  }, [tools]);

  // Add Tool
  const addTool = () => {
    if (!tool || !cost || !users) return;

    const newTool = {
      tool,
      plan,
      cost: Number(cost),
      users: Number(users),
    };

    setTools((prev) => [
      ...prev,
      newTool,
    ]);

    setTool("");
    setPlan("");
    setCost("");
    setUsers("");
  };

  // Audit
  const handleSubmit = async () => {
    let totalCurrent = 0;
    let totalSuggested = 0;

    let breakdown: any[] = [];

    tools.forEach((t) => {
      const toolName =
        t.tool.toLowerCase();

      const planName =
        t.plan.toLowerCase();

      let suggested = t.cost;

      let reason =
        "Already optimized";

      // ChatGPT optimization
      if (
        toolName.includes("chat") &&
        planName.includes("team") &&
        t.users <= 2
      ) {
        suggested = pricing.chatgpt.plus;

        reason =
          "Small teams can use Plus plan";
      }

      // Claude optimization
      if (
        toolName.includes("claude") &&
        planName.includes("team") &&
        t.users <= 2
      ) {
        suggested = pricing.claude.pro;

        reason =
          "Claude Pro is enough";
      }

      // Copilot optimization
      if (
        toolName.includes("copilot") &&
        planName.includes(
          "business"
        ) &&
        t.users <= 1
      ) {
        suggested =
          pricing.copilot.individual;

        reason =
          "Individual plan is enough";
      }

      totalCurrent += t.cost;
      totalSuggested += suggested;

      breakdown.push({
        tool: t.tool,
        current: t.cost,
        suggested,
        savings:
          t.cost - suggested,
        reason,
      });
    });

    const totalSavings =
      totalCurrent -
      totalSuggested;

    const auditId = crypto.randomUUID();

    // Frontend result
    setResult({
      totalCurrent,
      totalSuggested,
      totalSavings,
      breakdown,
    });

    // AI Summary
    try {
      const response = await fetch(
        "/api/summary",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            tools,
            totalSavings,
          }),
        }
      );

      const data =
        await response.json();

      setAiSummary(data.summary);
    } catch (error) {
      console.log(error);

      setAiSummary(
        "Your AI stack has optimization opportunities."
      );
    }

    // Save to localStorage for share page
    localStorage.setItem(
      "latestAudit",
      JSON.stringify({
        totalSavings,
        breakdown,
      })
    );

    // Optional Supabase save
    try {
      const { error } =
        await supabase
          .from("audits")
          .insert([
            {
              id: auditId,
              email,
              data: {
                tools,
                totalSavings,
                breakdown,
              },
            },
          ]);

      console.log(
        "Supabase Error:",
        error
      );
    } catch (err) {
      console.log(err);
    }

    // Redirect
    router.push(
      `/audit/${auditId}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Tool */}
      <select
        className="border p-3 w-full rounded-xl"
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
          setPlan("");
        }}
      >
        <option value="">
          Select Tool
        </option>

        {Object.keys(toolOptions).map(
          (toolName) => (
            <option
              key={toolName}
              value={toolName}
            >
              {toolName}
            </option>
          )
        )}
      </select>

      {/* Plan */}
      <select
        className="border p-3 w-full rounded-xl"
        value={plan}
        onChange={(e) =>
          setPlan(e.target.value)
        }
      >
        <option value="">
          Select Plan
        </option>

        {tool &&
          toolOptions[
            tool as keyof typeof toolOptions
          ].map((planName) => (
            <option
              key={planName}
              value={planName}
            >
              {planName}
            </option>
          ))}
      </select>

      {/* Cost */}
      <input
        type="number"
        placeholder="Monthly Cost ($)"
        className="border p-3 w-full rounded-xl"
        value={cost}
        onChange={(e) =>
          setCost(e.target.value)
        }
      />

      {/* Users */}
      <input
        type="number"
        placeholder="Number of Users"
        className="border p-3 w-full rounded-xl"
        value={users}
        onChange={(e) =>
          setUsers(e.target.value)
        }
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Enter your email"
        className="border p-3 w-full rounded-xl"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      {/* Add Tool */}
      <button
        onClick={addTool}
        className="bg-black hover:bg-gray-800 text-white p-3 rounded-xl w-full transition"
      >
        + Add Tool
      </button>

      {/* Added Tools */}
      {tools.length > 0 && (
        <div className="space-y-3">
          {tools.map(
            (t, index) => (
              <div
                key={index}
                className="border p-4 rounded-xl bg-gray-50"
              >
                <p className="font-semibold">
                  {t.tool} (
                  {t.plan})
                </p>

                <p className="text-gray-600">
                  ${t.cost} —{" "}
                  {t.users} users
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl w-full font-semibold transition"
      >
        Audit All Tools
      </button>

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-5">
          {/* Savings */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold">
              Save $
              {
                result.totalSavings
              }
              /month
            </h2>

            <p className="mt-2 text-lg">
              Annual Savings: $
              {result.totalSavings *
                12}
            </p>
          </div>

          {/* AI Summary */}
          <div className="border p-5 rounded-2xl shadow-sm bg-white">
            <h3 className="text-xl font-semibold mb-3">
              AI Audit Summary
            </h3>

            <p className="text-gray-700">
              {aiSummary}
            </p>
          </div>

          {/* Breakdown */}
          {result.breakdown.map(
            (
              item: any,
              index: number
            ) => (
              <div
                key={index}
                className="border p-5 rounded-2xl shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {item.tool}
                  </h3>

                  <span className="text-green-600 font-semibold">
                    Save $
                    {
                      item.savings
                    }
                  </span>
                </div>

                <p className="mt-2">
                  Current: $
                  {item.current}
                </p>

                <p>
                  Suggested: $
                  {item.suggested}
                </p>

                <p className="text-gray-500 mt-2">
                  {item.reason}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}