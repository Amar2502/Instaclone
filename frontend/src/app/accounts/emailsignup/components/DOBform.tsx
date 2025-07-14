"use client";

import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import axios from 'axios';
import { UserData } from '../page';

interface User {
    email: string;  
    fullName: string;
    username: string;
    password: string;
    auth_source: string;
    date_of_birth?: string;
}

interface DOBFormProps {
    data: UserData;
    setData: React.Dispatch<React.SetStateAction<UserData>>;
    onSuccess: () => void;
}

export default function DOBForm({ onSuccess, data, setData }: DOBFormProps) {
    const [selectedMonth, setSelectedMonth] = useState('February');
    const [selectedDay, setSelectedDay] = useState('25');
    const [selectedYear, setSelectedYear] = useState('2005');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (month: string, year: number) => {
        const index = months.indexOf(month); // 0-based index
        return new Date(year, index + 1, 0).getDate();
    };

    const days = Array.from(
        { length: getDaysInMonth(selectedMonth, parseInt(selectedYear)) },
        (_, i) => (i + 1).toString()
    );

    const years = Array.from({ length: 100 }, (_, i) => (2024 - i).toString());

    const handleSubmit = async () => {
        const dob = `${selectedYear}-${String(months.indexOf(selectedMonth) + 1).padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;

        // Store DOB in shared user state
        setData(prev => ({ ...prev, date_of_birth: dob }));

        try {
            setLoading(true);
            await axios.post("http://localhost:8080/otp/send-otp", { email: data.email }, { withCredentials: true });
            onSuccess(); // proceed to next step (OTP)
        } catch (err) {
            console.error(err);
            setError("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            {/* Main Form Card */}
            <div className="bg-black border border-gray-600 rounded-lg p-8 w-full max-w-sm mb-4">
                {/* Birthday Icon */}
                <div className="flex justify-center items-center mb-6 relative">
                    {/* Left Balloon */}
                    <div className="absolute left-12">
                        <div className="w-3 h-4 rounded-full border-2 border-yellow-500"></div>
                        <div className="w-px h-6 bg-white ml-1.5"></div>
                    </div>

                    {/* Cake */}
                    <div className="relative">
                        {/* Cake base */}
                        <div className="w-12 h-6 border-2 border-white rounded-sm relative bg-black">
                            {/* Cake layer line */}
                            <div className="absolute top-2 left-0 right-0 h-0.5 bg-white"></div>

                            {/* Candles */}
                            <div className="absolute -top-2 left-1.5 w-px h-2 bg-white"></div>
                            <div className="absolute -top-2 left-3.5 w-px h-2 bg-white"></div>
                            <div className="absolute -top-2 left-5.5 w-px h-2 bg-white"></div>
                            <div className="absolute -top-2 left-7.5 w-px h-2 bg-white"></div>

                            {/* Candle flames */}
                            <div className="absolute -top-3 left-1 w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <div className="absolute -top-3 left-3 w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <div className="absolute -top-3 left-5 w-1 h-1 bg-yellow-400 rounded-full"></div>
                            <div className="absolute -top-3 left-7 w-1 h-1 bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* Right Balloon */}
                    <div className="absolute right-12">
                        <div className="w-3 h-4 rounded-full border-2 border-pink-500"></div>
                        <div className="w-px h-6 bg-white ml-1.5"></div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-normal text-center mb-6 text-white">Add Your Birthday</h2>

                {/* Description */}
                <p className="text-gray-400 text-center text-sm mb-1">
                    This won't be a part of your public profile.
                </p>
                <p className="text-blue-400 text-center text-sm mb-6 cursor-pointer">
                    Why do I need to provide my birthday?
                </p>

                {/* Date Selectors */}
                <div className="flex gap-2 mb-6">
                    {/* Month Selector */}
                    <div className="flex-1 relative">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full bg-black border border-gray-600 rounded px-3 py-2.5 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-500"
                        >
                            {months.map(month => (
                                <option key={month} value={month} className="bg-black text-white">{month}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Day Selector */}
                    <div className="w-16 relative">
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="w-full bg-black border border-gray-600 rounded px-2 py-2.5 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-500"
                        >
                            {days.map(day => (
                                <option key={day} value={day} className="bg-black text-white">{day}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    {/* Year Selector */}
                    <div className="w-20 relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full bg-black border border-gray-600 rounded px-2 py-2.5 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-gray-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year} className="bg-black text-white">{year}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Birth Date Requirement */}
                <p className="text-gray-500 text-center text-sm mb-6">
                    You need to enter the date you were born
                </p>

                {error && (
                    <p className="text-red-500 text-sm pl-1">{error}</p>
                )}

                {/* Additional Info */}
                <p className="text-gray-500 text-center text-xs mb-8 leading-relaxed">
                    Use your own birthday, even if this account is for a business, a pet, or something else
                </p>

                {/* Next Button */}
                <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-full transition-colors mb-6 text-sm"
                    onClick={handleSubmit}>
                    Next
                    {loading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Go Back Link */}
                <p className="text-blue-400 text-center text-sm cursor-pointer">
                    Go back
                </p>
            </div>

            {/* Login Card */}
            <div className="bg-black border border-gray-600 rounded-lg p-6 w-full max-w-sm text-center">
                <span className="text-gray-300 text-sm">Have an account? </span>
                <span className="text-blue-400 cursor-pointer text-sm">Log in</span>
            </div>

        </div>
    );
}
