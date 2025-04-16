import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    step: 0,
    type_payment: "TRANSFER",
    amount: 0,
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Ajouter les indicateurs binaires basés sur le type de paiement
    const updatedFormData = {
      ...formData,
      type_CASH_OUT: formData.type_payment === "CASH_OUT" ? 1 : 0,
      type_CASH_IN: formData.type_payment === "CASH_IN" ? 1 : 0,
      type_DEBIT: formData.type_payment === "DEBIT" ? 1 : 0,
      type_PAYMENT: formData.type_payment === "PAYMENT" ? 1 : 0,
      type_TRANSFER: formData.type_payment === "TRANSFER" ? 1 : 0,
    };

    const response = await fetch("https://projet-infonuagique-1.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFormData),
    });

    const result = await response.json();
    setPrediction(result.prediction);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Détection de Fraude</h1>
      <div>
        <label>Type de paiement:</label>
        <select name="type_payment" value={formData.type_payment} onChange={handleChange}>
          <option value="TRANSFER">Transfert</option>
          <option value="CASH_OUT">Cash Out</option>
          <option value="CASH_IN">Cash In</option>
          <option value="PAYMENT">Payment</option>
          <option value="DEBIT">Debit</option>
        </select>

        {Object.keys(formData).map((key) =>
          key !== "type_payment" ? (
            <div key={key}>
              <label>{key}:</label>
              <input name={key} value={formData[key]} onChange={handleChange} />
            </div>
          ) : null
        )}
        <button onClick={handleSubmit}>Prédire</button>
      </div>
      {prediction !== null && <h2>Résultat: {prediction === 1 ? "Fraude" : "Non Fraude"}</h2>}
    </div>
  );
}

export default App;
