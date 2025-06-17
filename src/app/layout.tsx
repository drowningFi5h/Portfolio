// src/app/layout.tsx
import './globals.css';
import React from "react";

export const metadata = {
    title: '3D Title',
    description: 'A 3D vertical title scene using Three.js and Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
