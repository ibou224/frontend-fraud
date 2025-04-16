import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      step: 0.0,
      type_payment: "TRANSFER",
      amount: 0.0,
      oldbalanceOrg: 0.0,
      newbalanceOrig: 0.0,
      oldbalanceDest: 0.0,
      newbalanceDest: 0.0,
    },
    validationSchema: Yup.object({
      step: Yup.number().min(0).required("Obligatoire"),
      amount: Yup.number().min(0, "Doit être ≥ 0").required("Obligatoire"),
      oldbalanceOrg: Yup.number().min(0).required("Obligatoire"),
      newbalanceOrig: Yup.number().min(0).required("Obligatoire"),
      oldbalanceDest: Yup.number().min(0).required("Obligatoire"),
      newbalanceDest: Yup.number().min(0).required("Obligatoire"),
      type_payment: Yup.string().oneOf(["TRANSFER", "CASH_OUT", "CASH_IN", "PAYMENT", "DEBIT"]).required(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const updatedFormData = {
        ...values,
        type_CASH_OUT: values.type_payment === "CASH_OUT" ? 1 : 0,
        type_CASH_IN: values.type_payment === "CASH_IN" ? 1 : 0,
        type_DEBIT: values.type_payment === "DEBIT" ? 1 : 0,
        type_PAYMENT: values.type_payment === "PAYMENT" ? 1 : 0,
        type_TRANSFER: values.type_payment === "TRANSFER" ? 1 : 0,
      };

      try {
        const response = await fetch("https://projet-infonuagique-1.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        });

        const result = await response.json();
        setPrediction(result.prediction);
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Détection de Fraude</h1>
      <form onSubmit={formik.handleSubmit}>
        <label>Type de paiement:</label>
        <select
          name="type_payment"
          value={formik.values.type_payment}
          onChange={formik.handleChange}
        >
          <option value="TRANSFER">Transfert</option>
          <option value="CASH_OUT">Cash Out</option>
          <option value="CASH_IN">Cash In</option>
          <option value="PAYMENT">Payment</option>
          <option value="DEBIT">Debit</option>
        </select>

        {"step", "amount", "oldbalanceOrg", "newbalanceOrig", "oldbalanceDest", "newbalanceDest"].map((field) => (
          <div key={field} style={{ marginTop: "1rem" }}>
            <label style={{ display: "block" }}>{field}:</label>
            <input
              type="number"
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              style={{ padding: "0.5rem", width: "100%" }}
            />
            {formik.touched[field] && formik.errors[field] && (
              <div style={{ color: "red", marginTop: "0.25rem" }}>{formik.errors[field]}</div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading || !formik.isValid}
          style={{ marginTop: "1rem", padding: "0.75rem", background: "#2C3E50", color: "#fff" }}
        >
          {loading ? "Chargement..." : "Prédire"}
        </button>
      </form>

      {prediction !== null && (
        <h2 style={{ marginTop: "2rem" }}>
          Résultat : {prediction === 1 ? "⚠️ Fraude" : "✅ Pas de fraude"}
        </h2>
      )}
    </div>
  );
}

export default App;
