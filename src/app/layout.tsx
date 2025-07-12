import type { Metadata } from "next";

import "./globals.css";
import React from 'react';
import ThemeProvider from "./ThemeProvider";



export const metadata: Metadata = {
  title: "RetailHive",
  description: "RetailHive: Rural commerce portal for merchants and users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
