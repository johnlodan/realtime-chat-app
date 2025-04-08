// components/LoadingButton.tsx
"use client";
import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export default function Button({ loading = false, children, ...props }: LoadingButtonProps) {
    return (
        <button
            disabled={loading || props.disabled}
            {...props}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold transition
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
        text-white ${props.className}`}
        >
            {loading && (
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {loading ? '' : children}
        </button>
    );
}
