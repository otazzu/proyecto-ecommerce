import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = ({ items }) => {
    const location = useLocation();

    return (
        <nav className="mb-4 animate-fade-in-up" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-1 text-sm font-body">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-1">
                            {index > 0 && (
                                <span className="text-[var(--text-muted)] mx-1">‹</span>
                            )}
                            {isLast ? (
                                <span className="text-[var(--text-primary)] font-medium">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.to}
                                    className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};