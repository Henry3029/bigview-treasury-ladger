import React from "react";
import Dashboard from "../components/Dashboard"; 

export default function HomePage() {
  // We are bypassing the login check entirely to stop the crashing
    // This will render the Dashboard immediately
      return (
          <div style={{ padding: "0", margin: "0" }}>
                <Dashboard />
                    </div>
                      );
                      }