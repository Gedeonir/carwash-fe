import { useState } from "react";
import { Card, Badge } from "../../components/UI";
import { useCustomers } from "./useAdminData";

const TIER_STYLE = {
  platinum: "text-info border-info/20 bg-info/10",
  gold:     "text-accent-500 border-accent-400/20 bg-accent-400/10",
  silver:   "text-surface-400 border-surface-200 bg-surface-100",
  bronze:   "text-warning border-warning/20 bg-warning/10",
};

function CustomerSkeleton() {
  return (
    <div className="bg-surface-50 border border-surface-200 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-surface-200 rounded w-1/3" />
          <div className="h-3 bg-surface-200 rounded w-1/2" />
        </div>
        <div className="text-right space-y-1.5">
          <div className="h-3.5 bg-surface-200 rounded w-16" />
          <div className="h-3 bg-surface-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [searchTimer, setSearchTimer] = useState(null);

  const { data: customersRes, loading } = useCustomers({
    search: debouncedSearch,
    page,
    limit: 20,
  });

  const customers = customersRes?.data || [];
  const meta      = customersRes?.meta || {};

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
    if (searchTimer) clearTimeout(searchTimer);
    const t = setTimeout(() => setDebouncedSearch(val), 400);
    setSearchTimer(t);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl text-surface-900">Customer Accounts</h1>
          {!loading && meta.total !== undefined && (
            <p className="text-sm text-surface-400 mt-0.5">
              {meta.total} customer{meta.total !== 1 ? "s" : ""} total
              {debouncedSearch && ` · searching "${debouncedSearch}"`}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
            className="absolute left-3 top-3 -translate-y-1/2 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white border border-surface-200 rounded-xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500 w-full sm:w-64 transition-all"
          />
          {search && (
            <button onClick={() => { handleSearch(""); }} className="absolute right-3 top-1.5 -translate-y-1/2 text-surface-400 hover:text-surface-600">✕</button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <CustomerSkeleton key={i} />)}</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-surface-400 text-sm">{debouncedSearch ? `No customers matching "${debouncedSearch}"` : "No customers yet"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  {["Customer", "Email", "Phone", "Tier", "Loyalty Pts", "Cars", "Joined"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-surface-500 pb-3 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {customers.map(c => (
                  <tr key={c._id} className="hover:bg-surface-50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-600 text-xs font-medium flex-shrink-0">
                          {(c.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-surface-900 whitespace-nowrap">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-surface-500">{c.email || <span className="text-surface-300">—</span>}</td>
                    <td className="py-3.5 pr-4 text-sm text-surface-500">{c.phone || <span className="text-surface-300">—</span>}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${TIER_STYLE[c.loyaltyTier] || TIER_STYLE.bronze}`}>
                        {c.loyaltyTier || "bronze"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-surface-600 font-medium">{c.loyaltyPoints || 0} pts</td>
                    <td className="py-3.5 pr-4 text-sm text-surface-500">{(c.savedCars || []).length} saved</td>
                    <td className="py-3.5 pr-4 text-xs text-surface-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {loading
          ? [1,2,3,4].map(i => <CustomerSkeleton key={i} />)
          : customers.length === 0
          ? <p className="text-center text-surface-400 text-sm py-12">{debouncedSearch ? `No results for "${debouncedSearch}"` : "No customers yet"}</p>
          : customers.map(c => (
              <Card key={c._id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/15 flex items-center justify-center text-primary-600 text-sm font-medium flex-shrink-0">
                    {(c.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-surface-900 text-sm">{c.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${TIER_STYLE[c.loyaltyTier] || TIER_STYLE.bronze}`}>
                        {c.loyaltyTier || "bronze"}
                      </span>
                    </div>
                    <div className="text-xs text-surface-400 truncate">{c.email || c.phone || "—"}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-surface-700">{c.loyaltyPoints || 0} pts</div>
                    <div className="text-xs text-surface-400">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </Card>
            ))
        }
      </div>

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200">
          <p className="text-xs text-surface-400">Page {meta.page} of {meta.pages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 bg-surface-50 text-surface-600 disabled:opacity-40 hover:bg-surface-100 transition-colors">
              ← Prev
            </button>
            <button disabled={page >= meta.pages} onClick={() => setPage(p => p + 1)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-200 bg-surface-50 text-surface-600 disabled:opacity-40 hover:bg-surface-100 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}