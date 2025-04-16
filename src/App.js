import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import './App.css'; // Importation du fichier CSS classique

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
      amount: Yup.number().min(0).required("Obligatoire"),
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
    <div className="app-container">
      <div className="form-container">
        <h1>Détection de Fraude</h1>

        <form onSubmit={formik.handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Type de paiement</label>
            <select
              name="type_payment"
              value={formik.values.type_payment}
              onChange={formik.handleChange}
              className="input"
            >
              <option value="TRANSFER">Transfert</option>
              <option value="CASH_OUT">Cash Out</option>
              <option value="CASH_IN">Cash In</option>
              <option value="PAYMENT">Payment</option>
              <option value="DEBIT">Debit</option>
            </select>
          </div>

          {["step", "amount", "oldbalanceOrg", "newbalanceOrig", "oldbalanceDest", "newbalanceDest"].map((field) => (
            <div key={field} className="form-group">
              <label className="label">{field}</label>
              <input
                type="number"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                className="input"
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="error-message">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className={`submit-button ${loading || !formik.isValid ? "disabled" : ""}`}
          >
            {loading ? "Chargement..." : "Prédire"}
          </button>
        </form>

        {prediction !== null && (
          <div className="result">
            Résultat :{" "}
            {prediction === 1 ? (
              <span className="fraud">⚠️ Fraude détectée</span>
            ) : (
              <span className="no-fraud">✅ Pas de fraude</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
