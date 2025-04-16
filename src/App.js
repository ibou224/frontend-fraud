// src/App.js
import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    step: 1,
    type_payment: "TRANSFER",
    amount: 1000,
    oldbalanceOrg: 5000,
    newbalanceOrig: 4000,
    oldbalanceDest: 1000,
    newbalanceDest: 2000
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch("https://projet-infonuagique-1.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    setPrediction(result.prediction);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Détection de Fraude</h1>
      <div>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input name={key} value={formData[key]} onChange={handleChange} />
          </div>
        ))}
        <button onClick={handleSubmit}>Prédire</button>
      </div>
      {prediction !== null && <h2>Résultat: {prediction === 1 ? "Fraude" : "Non Fraude"}</h2>}
    </div>
  );
}

export default App;
