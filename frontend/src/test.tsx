import React from "react";

const TestSentry: React.FC = () => {
    return <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>;
};

export default TestSentry;