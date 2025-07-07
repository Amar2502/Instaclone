"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function SearchAccounts() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        console.log("Searching for:", search);
        // Simulate search loading time
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim()) {
                setLoading(true);
                handleSearch();
            } else {
                setLoading(false);
            }
        }, 300); // debounce delay

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <div className="w-96 bg-black border-r border-zinc-800 flex flex-col">
            {/* Top Section */}
            <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold mb-6">Search</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full bg-zinc-800 text-white px-4 py-2.5 rounded-lg border-none outline-none focus:bg-zinc-700 transition-colors text-sm placeholder-zinc-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 px-6">
                {loading ? (
                    <div className="flex flex-col gap-4 justify-center items-center py-16">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full bg-zinc-700" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px] bg-zinc-700" />
                                    <Skeleton className="h-4 w-[200px] bg-zinc-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-t border-zinc-800 pb-4 pt-4">
                        <h3 className="text-base font-semibold mb-4">Recent</h3>
                        <div className="flex justify-center items-center py-16">
                            <p className="text-zinc-500 text-sm">No recent searches.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
