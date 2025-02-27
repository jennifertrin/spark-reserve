"use client"

import React, { useState } from 'react';

const AIAgentInterface = () => {
    const [response, setResponse] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Function to simulate AI generating a response
    const generateResponse = () => {
        if (isGenerating) return;

        setIsGenerating(true);
        setIsComplete(false);
        setResponse('');

        // Simulate typing effect
        const fullResponse = "To determine an appropriate interest rate for USBTC, we need to consider the price appreciation from $50,000 to $70,000 (40% increase) and standard monetary policy principles. Given this appreciation, an interest rate between 10-15% would allow the government to capture some upside while keeping the loan attractive to banks. The exact rate would depend on loan duration, risk assessment, and broader economic policy goals.";
        let index = 0;

        const interval = setInterval(() => {
            setResponse(prevResponse => prevResponse + fullResponse[index]);
            index++;

            if (index >= fullResponse.length) {
                clearInterval(interval);
                setIsGenerating(false);
                setIsComplete(true);
            }
        }, 30);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold">FinanceAI Assistant</h1>
                    </div>
                    <div className="bg-blue-600 text-xs px-2 py-1 rounded-full">BETA</div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
                {/* Question card */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <div className="flex items-start mb-4">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-sm font-bold">Q</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-200">USBTC Interest Rate Inquiry</h2>
                            <p className="mt-2 text-gray-300">
                                The US government loaned 20,000 USBTC to 7 banks yesterday at $50,000 per BTC. Now the BTC is $70,000. What should be the interest rate for USBTC?
                            </p>
                        </div>
                    </div>
                </div>

                {/* Response area */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="flex items-start p-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-sm font-bold">AI</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-gray-200 font-medium">Response</h3>

                            <div className="mt-3 min-h-32 text-gray-300">
                                {response}
                                {isGenerating && <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse">|</span>}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-750 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-400">
                                {isComplete && 'Response complete'}
                                {isGenerating && 'Generating response...'}
                                {!isGenerating && !isComplete && 'Ready to analyze'}
                            </div>
                            <button
                                onClick={generateResponse}
                                disabled={isGenerating}
                                className={`px-4 py-2 rounded-md font-medium ${isGenerating
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                                    }`}
                            >
                                {isGenerating ? 'Generating...' : isComplete ? 'Regenerate' : 'Generate Response'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 py-3 border-t border-gray-700">
                <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-xs">
                    Financial analysis powered by advanced AI models • Not financial advice
                </div>
            </footer>
        </div>
    );
};

export default AIAgentInterface;