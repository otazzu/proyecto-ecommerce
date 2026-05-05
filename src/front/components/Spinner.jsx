import React from "react";

export const Spinner = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-solid border-[var(--bg-elevated)] border-r-[var(--accent-primary)] animate-spin"></div>
                <div className="absolute inset-0 h-12 w-12 rounded-full glow-accent-subtle opacity-50"></div>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm font-body">
                <span>Cargando</span>
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
        </div>
    );
};