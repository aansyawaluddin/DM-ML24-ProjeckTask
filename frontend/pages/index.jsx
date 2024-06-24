import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";

const IndexPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = (values) => {
    const errors = {};
    const maxValues = {
      pregnancies: 17,
      glucose: 199,
      bloodPressure: 122,
      skinThickness: 99,
      insulin: 846,
      bmi: 50,
      diabetesPedigreeFunction: 2.42,
    };

    Object.keys(values).forEach((key) => {
      if (key !== "age") {
        if (!values[key]) {
          errors[key] = "Required";
        } else if (isNaN(values[key])) {
          errors[key] = "Must be a number";
        } else if (parseFloat(values[key]) > maxValues[key]) {
          errors[key] = `Must be less than or equal to ${maxValues[key]}`;
        }
      }
    });

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      pregnancies: "",
      glucose: "",
      bloodPressure: "",
      skinThickness: "",
      insulin: "",
      bmi: "",
      diabetesPedigreeFunction: "",
      age: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true before making the prediction request
      try {
        const response = await axios.post("http://localhost:5000/predict", {
          features: Object.values(values).map(Number),
        });

        setPrediction(response.data.prediction);
      } catch (error) {
        console.error("Prediction error:", error.message);
        setError("Failed to predict: " + error.message);
      } finally {
        setLoading(false); // Set loading to false after receiving the prediction or encountering an error
      }
    },
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/bg.jpg')",
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">Diabetes Prediction</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        {Object.keys(formik.values).map((key) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {key === "bloodPressure"
                ? "Blood Pressure"
                : key === "skinThickness"
                ? "Skin Thickness"
                : key === "diabetesPedigreeFunction"
                ? "Diabetes Pedigree Function"
                : key}
            </label>
            <input
              type="text"
              name={key}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[key]}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched[key] && formik.errors[key]
                  ? "border-red-500"
                  : ""
              }`}
            />
            {key === "pregnancies" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter number of pregnancies (0-17).
              </p>
            )}
            {key === "glucose" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter glucose level (0-199).
              </p>
            )}
            {key === "bloodPressure" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter blood pressure (0-122).
              </p>
            )}
            {key === "skinThickness" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter skin thickness (0-99).
              </p>
            )}
            {key === "insulin" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter insulin level (0-846).
              </p>
            )}
            {key === "bmi" && (
              <p className="text-xs text-gray-500 mt-1">Enter BMI (18-50).</p>
            )}
            {key === "diabetesPedigreeFunction" && (
              <p className="text-xs text-gray-500 mt-1">
                Enter diabetes pedigree function (0.08-2.42).
              </p>
            )}
            {key === "age" && (
              <p className="text-xs text-gray-500 mt-1">Enter age (17+).</p>
            )}
            {formik.touched[key] && formik.errors[key] && (
              <p className="text-red-500 text-xs italic">
                {formik.errors[key]}
              </p>
            )}
          </div>
        ))}
        <div className="flex items-center mt-3">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 h-[75%] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
          {prediction !== null && !loading && (
            <div className="ml-4 p-3 bg-white rounded-lg shadow-md">
              <h2 className="text-sm font-bold">
                Prediction: {prediction === 1 ? "Diabetes" : "No Diabetes"}
              </h2>
            </div>
          )}
          {error && prediction === null && (
            <div className="ml-4 p-3 bg-red-100 text-red-500 rounded-lg shadow-md">
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default IndexPage;
