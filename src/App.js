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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Détection de Fraude</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
            <select
              name="type_payment"
              value={formik.values.type_payment}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TRANSFER">Transfert</option>
              <option value="CASH_OUT">Cash Out</option>
              <option value="CASH_IN">Cash In</option>
              <option value="PAYMENT">Payment</option>
              <option value="DEBIT">Debit</option>
            </select>
          </div>

          {["step", "amount", "oldbalanceOrg", "newbalanceOrig", "oldbalanceDest", "newbalanceDest"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type="number"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-600 text-sm mt-1">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
              loading || !formik.isValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Chargement..." : "Prédire"}
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center text-lg font-medium">
            Résultat :{" "}
            {prediction === 1 ? (
              <span className="text-red-600">⚠️ Fraude détectée</span>
            ) : (
              <span className="text-green-600">✅ Pas de fraude</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
