"use client";

import { useEffect, useState } from "react";

type AuditData = {
  totalSavings: number;
  breakdown: any[];
};

export default function AuditPage({
  params,
}: any) {
  const [audit, setAudit] =
    useState<AuditData | null>(null);

  useEffect(() => {
    const savedAudit =
      localStorage.getItem(
        "latestAudit"
      );

    if (savedAudit) {
      setAudit(
        JSON.parse(savedAudit)
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white text-black rounded-2xl shadow-2xl p-8">
          
          <h1 className="text-4xl font-bold mb-6">
            Shared Audit Report
          </h1>

          <p className="text-gray-600 mb-6">
            Audit ID:
            <span className="font-semibold">
              {" "}
              {params?.id}
            </span>
          </p>

          {audit ? (
            <>
              {/* Savings Card */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-3xl font-bold">
                  Save $
                  {
                    audit.totalSavings
                  }
                  /month
                </h2>

                <p className="text-lg mt-2">
                  Estimated Annual Savings:
                  $
                  {audit.totalSavings *
                    12}
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                {audit.breakdown.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={index}
                      className="border rounded-2xl p-5 shadow-sm bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                          {item.tool}
                        </h3>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Save $
                          {
                            item.savings
                          }
                        </span>
                      </div>

                      <p className="mt-3 text-gray-700">
                        Current Spend:
                        <span className="font-semibold">
                          {" "}
                          $
                          {
                            item.current
                          }
                        </span>
                      </p>

                      <p className="text-gray-700">
                        Suggested Spend:
                        <span className="font-semibold">
                          {" "}
                          $
                          {
                            item.suggested
                          }
                        </span>
                      </p>

                      <p className="text-gray-500 mt-2">
                        {item.reason}
                      </p>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Loading audit...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}