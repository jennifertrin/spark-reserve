"use client"

import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriceDataPoint {
    date: string;
    price: number;
}

interface ReserveDataPoint {
    date: string;
    amount: number;
}

interface RemainingDataPoint {
    date: string;
    amount: number;
}

interface ReserveBank {
    name: string;
    ticker: string;
    issuer: string;
    reserveRatio: string;
    website: string;
    priceData?: PriceDataPoint[];
    reserveData?: ReserveDataPoint[];
    remainingData?: RemainingDataPoint[];
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatBitcoin = (value: number, ticker: string): string => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value) + ` ${ticker}`;
};

const BitcoinDashboard: React.FC = () => {
    const reserveBanks: ReserveBank[] = [
        {
            name: "Internet Computer Federal Reserve Bank",
            ticker: "ckBTC",
            issuer: "DFINITY Foundation",
            reserveRatio: "33%",
            website: "https://internetcomputer.org/docs/defi/chain-key-tokens/ckbtc/overview",
            priceData: [
                { date: 'Jan', price: 42000 },
                { date: 'Feb', price: 38000 },
                { date: 'Mar', price: 44000 },
                { date: 'Apr', price: 51000 },
                { date: 'May', price: 58000 },
                { date: 'Jun', price: 63000 },
                { date: 'Jul', price: 67000 },
                { date: 'Aug', price: 70000 },
            ],
            reserveData: [
                { date: 'Jan', amount: 1200 },
                { date: 'Feb', amount: 1350 },
                { date: 'Mar', amount: 1450 },
                { date: 'Apr', amount: 1600 },
                { date: 'May', amount: 1750 },
                { date: 'Jun', amount: 1900 },
                { date: 'Jul', amount: 2050 },
                { date: 'Aug', amount: 2200 },
            ],
            remainingData: [
                { date: 'Jan', amount: 5000 },
                { date: 'Feb', amount: 4850 },
                { date: 'Mar', amount: 4750 },
                { date: 'Apr', amount: 4600 },
                { date: 'May', amount: 4450 },
                { date: 'Jun', amount: 4300 },
                { date: 'Jul', amount: 4150 },
                { date: 'Aug', amount: 4000 },
            ]
        },
        {
            name: "Wrapped Bitcoin Federal Reserve Bank",
            ticker: "WBTC",
            issuer: "BitGo",
            reserveRatio: "33%",
            website: "https://wbtc.network",
            priceData: [
                { date: 'Jan', price: 41800 },
                { date: 'Feb', price: 37900 },
                { date: 'Mar', price: 43800 },
                { date: 'Apr', price: 50800 },
                { date: 'May', price: 57900 },
                { date: 'Jun', price: 62800 },
                { date: 'Jul', price: 66800 },
                { date: 'Aug', price: 69800 },
            ],
            reserveData: [
                { date: 'Jan', amount: 1300 },
                { date: 'Feb', amount: 1450 },
                { date: 'Mar', amount: 1550 },
                { date: 'Apr', amount: 1700 },
                { date: 'May', amount: 1850 },
                { date: 'Jun', amount: 2000 },
                { date: 'Jul', amount: 2150 },
                { date: 'Aug', amount: 2300 },
            ],
            remainingData: [
                { date: 'Jan', amount: 4700 },
                { date: 'Feb', amount: 4550 },
                { date: 'Mar', amount: 4450 },
                { date: 'Apr', amount: 4300 },
                { date: 'May', amount: 4150 },
                { date: 'Jun', amount: 4000 },
                { date: 'Jul', amount: 3850 },
                { date: 'Aug', amount: 3700 },
            ]
        },
        {
            name: "Spark Federal Reserve Bank",
            ticker: "USBTC",
            issuer: "Spark",
            reserveRatio: "34%",
            website: "https://www.spark.info",
            priceData: [
                { date: 'Jan', price: 42100 },
                { date: 'Feb', price: 38100 },
                { date: 'Mar', price: 44100 },
                { date: 'Apr', price: 51100 },
                { date: 'May', price: 58100 },
                { date: 'Jun', price: 63100 },
                { date: 'Jul', price: 67100 },
                { date: 'Aug', price: 70100 },
            ],
            reserveData: [
                { date: 'Jan', amount: 1100 },
                { date: 'Feb', amount: 1250 },
                { date: 'Mar', amount: 1350 },
                { date: 'Apr', amount: 1500 },
                { date: 'May', amount: 1650 },
                { date: 'Jun', amount: 1800 },
                { date: 'Jul', amount: 1950 },
                { date: 'Aug', amount: 2100 },
            ],
            remainingData: [
                { date: 'Jan', amount: 5100 },
                { date: 'Feb', amount: 4950 },
                { date: 'Mar', amount: 4850 },
                { date: 'Apr', amount: 4700 },
                { date: 'May', amount: 4550 },
                { date: 'Jun', amount: 4400 },
                { date: 'Jul', amount: 4250 },
                { date: 'Aug', amount: 4100 },
            ]
        }
    ];

    // State for selected reserve bank
    const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'individual' | 'combined'>('individual');

    // Get the selected bank
    const selectedBank = reserveBanks[selectedBankIndex];

    // Current stats based on selected bank
    const currentPrice: number = selectedBank.priceData![selectedBank.priceData!.length - 1].price;
    const currentReserve: number = selectedBank.reserveData![selectedBank.reserveData!.length - 1].amount;
    const currentRemaining: number = selectedBank.remainingData![selectedBank.remainingData!.length - 1].amount;
    const totalTarget: number = currentReserve + currentRemaining;
    const percentComplete: string = (currentReserve / totalTarget * 100).toFixed(1);

    // Calculate price changes
    const previousPrice: number = selectedBank.priceData![selectedBank.priceData!.length - 2].price;
    const priceChange: number = currentPrice - previousPrice;
    const priceChangePercent: string = ((priceChange / previousPrice) * 100).toFixed(2);
    const isPriceUp: boolean = priceChange >= 0;

    // Function to get consolidated data for combined view
    const getCombinedReserveData = () => {
        const result: any[] = [];
        selectedBank.reserveData!.forEach((item, index) => {
            const combinedItem: any = { date: item.date };

            reserveBanks.forEach(bank => {
                combinedItem[bank.ticker] = bank.reserveData![index].amount;
            });

            result.push(combinedItem);
        });
        return result;
    };

    // Consolidated reserve data for combined view
    const combinedReserveData = getCombinedReserveData();

    // Function to get the total reserve value across all banks
    const getTotalReserveValue = () => {
        return reserveBanks.reduce((total, bank) => {
            const currentBankReserve = bank.reserveData![bank.reserveData!.length - 1].amount;
            return total + (currentBankReserve * bank.priceData![bank.priceData!.length - 1].price);
        }, 0);
    };

    // Total reserve value
    const totalReserveValue = getTotalReserveValue();

    return (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Live Price */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-800 flex items-center">
                            <span className="text-4xl mr-2">₿</span>
                            Bitcoin Strategic Reserve
                        </h1>
                        <p className="text-indigo-600 mt-1 font-medium">Real-time monitoring dashboard</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <div className="flex items-center bg-indigo-50 p-3 rounded-lg">
                            <img src="/bitcoin-logo.png" alt="Bitcoin logo" className="mr-2 w-6 h-6" />
                            <span className="text-3xl font-bold text-indigo-700">{formatCurrency(currentPrice)}</span>
                        </div>
                        <div className={`text-sm mt-1 flex items-center font-bold px-3 py-1 rounded-full ${isPriceUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            <span className="mr-1">{isPriceUp ? '↑' : '↓'}</span>
                            <span>{isPriceUp ? '+' : ''}{formatCurrency(priceChange)} ({priceChangePercent}%)</span>
                        </div>
                    </div>
                </div>

                {/* Dropdown Selector and View Mode Toggle */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-md">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0">
                        <label htmlFor="bank-select" className="block text-sm font-medium text-indigo-700 mb-2">Select Reserve Bank:</label>
                        <select
                            id="bank-select"
                            className="w-full p-3 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50 text-indigo-800"
                            value={selectedBankIndex}
                            onChange={(e) => setSelectedBankIndex(parseInt(e.target.value))}
                        >
                            {reserveBanks.map((bank, index) => (
                                <option key={index} value={index}>
                                    {bank.name} ({bank.ticker}) - {bank.reserveRatio}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-auto flex flex-col">
                        <p className="text-sm text-indigo-600 mb-2">Issued by: <a href={selectedBank.website} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-indigo-800 underline">{selectedBank.issuer}</a></p>
                        <div className="flex space-x-2">
                            <button
                                className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'individual' ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-800'}`}
                                onClick={() => setViewMode('individual')}
                            >
                                Individual View
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'combined' ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-800'}`}
                                onClick={() => setViewMode('combined')}
                            >
                                Combined View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-500">
                            <h2 className="text-white text-sm uppercase font-bold tracking-wider">Current Reserve</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="text-3xl font-bold text-indigo-800">{formatBitcoin(currentReserve, selectedBank.ticker)}</div>
                                <div className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                    {percentComplete}% Complete
                                </div>
                            </div>
                            <div className="mt-4 text-sm font-medium text-indigo-500">
                                Current value: {formatCurrency(currentReserve * currentPrice)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-500">
                            <h2 className="text-white text-sm uppercase font-bold tracking-wider">Remaining to Purchase</h2>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold text-indigo-800">{formatBitcoin(currentRemaining, selectedBank.ticker)}</div>
                            <div className="mt-4 text-sm font-medium text-indigo-500">
                                Estimated cost: {formatCurrency(currentRemaining * currentPrice)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500">
                            <h2 className="text-white text-sm uppercase font-bold tracking-wider">
                                {viewMode === 'individual' ? 'Total Reserve Value' : 'Combined Reserve Value'}
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold text-indigo-800">
                                {viewMode === 'individual'
                                    ? formatCurrency(currentReserve * currentPrice)
                                    : formatCurrency(totalReserveValue)
                                }
                            </div>
                            <div className="mt-4 text-sm font-medium text-indigo-500">
                                {viewMode === 'individual'
                                    ? `Target value: ${formatCurrency(totalTarget * currentPrice)}`
                                    : `Combined across all reserve banks`
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-indigo-800">Reserve Acquisition Progress</h2>
                        <div className="text-indigo-500 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-full">
                            Target: {formatBitcoin(totalTarget, selectedBank.ticker)}
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2 text-xs font-bold text-white"
                            style={{ width: `${percentComplete}%` }}
                        >
                            {percentComplete}%
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm font-medium">
                        <div className="text-blue-600">{formatBitcoin(currentReserve, selectedBank.ticker)} Acquired</div>
                        <div className="text-purple-600">{formatBitcoin(currentRemaining, selectedBank.ticker)} Remaining</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-yellow-400 to-amber-500">
                            <h2 className="font-bold text-white">{selectedBank.ticker} Price (USD)</h2>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={selectedBank.priceData}
                                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                        <XAxis dataKey="date" stroke="#666" />
                                        <YAxis domain={['auto', 'auto']} stroke="#666" tickFormatter={(value: number) => `$${value.toLocaleString()}`} />
                                        <Tooltip
                                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                                            contentStyle={{ backgroundColor: "#FEF3C7", borderRadius: "8px", border: "none" }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#F59E0B"
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2, fill: '#F59E0B' }}
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#FCD34D' }}
                                            fillOpacity={1}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-400 to-blue-500">
                            <h2 className="font-bold text-white">
                                {viewMode === 'individual'
                                    ? `Current ${selectedBank.ticker} Holdings`
                                    : 'Combined Reserve Holdings'
                                }
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    {viewMode === 'individual' ? (
                                        <AreaChart
                                            data={selectedBank.reserveData}
                                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                        >
                                            <defs>
                                                <linearGradient id="reserveGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="#666" />
                                            <YAxis stroke="#666" tickFormatter={(value: number) => `${value} ${selectedBank.ticker}`} />
                                            <Tooltip
                                                formatter={(value: number) => [`${value.toLocaleString()} ${selectedBank.ticker}`, 'Reserve']}
                                                contentStyle={{ backgroundColor: "#E0F2FE", borderRadius: "8px", border: "none" }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#0EA5E9"
                                                fill="url(#reserveGradient)"
                                                strokeWidth={3}
                                            />
                                        </AreaChart>
                                    ) : (
                                        <AreaChart
                                            data={combinedReserveData}
                                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                        >
                                            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="#666" />
                                            <YAxis stroke="#666" />
                                            <Tooltip contentStyle={{ backgroundColor: "#E0F2FE", borderRadius: "8px", border: "none" }} />
                                            <Legend />
                                            {reserveBanks.map((bank, index) => {
                                                const colors = ["#0EA5E9", "#6366F1", "#8B5CF6"];
                                                return (
                                                    <Area
                                                        key={bank.ticker}
                                                        type="monotone"
                                                        dataKey={bank.ticker}
                                                        stroke={colors[index % colors.length]}
                                                        fill={colors[index % colors.length]}
                                                        fillOpacity={0.3}
                                                        stackId="1"
                                                    />
                                                );
                                            })}
                                        </AreaChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {viewMode === 'individual' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-500 to-purple-500">
                            <h2 className="font-bold text-white">Remaining {selectedBank.ticker} to Purchase</h2>
                        </div>
                        <div className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={selectedBank.remainingData}
                                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#6366F1" stopOpacity={1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                                        <XAxis dataKey="date" stroke="#666" />
                                        <YAxis stroke="#666" tickFormatter={(value: number) => `${value} ${selectedBank.ticker}`} />
                                        <Tooltip
                                            formatter={(value: number) => [`${value.toLocaleString()} ${selectedBank.ticker}`, 'Remaining']}
                                            contentStyle={{ backgroundColor: "#EDE9FE", borderRadius: "8px", border: "none" }}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            fill="url(#barGradient)"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reserve Distribution (Pie Chart) for Combined View */}
                {viewMode === 'combined' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-500 to-purple-500">
                            <h2 className="font-bold text-white">Reserve Distribution</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
                                {reserveBanks.map((bank, index) => {
                                    const colors = ["#0EA5E9", "#6366F1", "#8B5CF6"];
                                    const currentBankReserve = bank.reserveData![bank.reserveData!.length - 1].amount;
                                    const bankValue = currentBankReserve * bank.priceData![bank.priceData!.length - 1].price;
                                    const percentOfTotal = ((bankValue / totalReserveValue) * 100).toFixed(1);

                                    return (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: colors[index % colors.length] }}>
                                                {percentOfTotal}%
                                            </div>
                                            <div className="mt-4 text-center">
                                                <p className="font-bold text-indigo-800">{bank.ticker}</p>
                                                <p className="text-sm text-indigo-600">{formatBitcoin(currentBankReserve, bank.ticker)}</p>
                                                <p className="text-sm font-medium text-indigo-500">{formatCurrency(bankValue)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-center mt-8 text-indigo-700 text-sm bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <p>Data last updated: <span className="font-bold">February 27, 2025</span> | Strategic Reserve Analytics Dashboard</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitcoinDashboard;