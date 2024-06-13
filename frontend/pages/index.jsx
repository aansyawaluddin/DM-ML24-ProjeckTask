import React, { useState } from 'react';
import { useFormik } from 'formik'
import axios from 'axios'

const IndexPage = () => {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = (values) => {
    const errors = {};
    if (!values.pregnancies) {
      errors.pregnancies = 'Required';
    } else if (isNaN(values.pregnancies)) {
      errors.pregnancies = 'Must be a number';
    }
    if (!values.glucose) {
      errors.glucose = 'Required';
    } else if (isNaN(values.glucose)) {
      errors.glucose = 'Must be a number';
    }
    if (!values.bloodPressure) {
      errors.bloodPressure = 'Required';
    } else if (isNaN(values.bloodPressure)) {
      errors.bloodPressure = 'Must be a number';
    }
    if (!values.skinThickness) {
      errors.skinThickness = 'Required';
    } else if (isNaN(values.skinThickness)) {
      errors.skinThickness = 'Must be a number';
    }
    if (!values.insulin) {
      errors.insulin = 'Required';
    } else if (isNaN(values.insulin)) {
      errors.insulin = 'Must be a number';
    }
    if (!values.bmi) {
      errors.bmi = 'Required';
    } else if (isNaN(values.bmi)) {
      errors.bmi = 'Must be a number';
    }
    if (!values.diabetesPedigreeFunction) {
      errors.diabetesPedigreeFunction = 'Required';
    } else if (isNaN(values.diabetesPedigreeFunction)) {
      errors.diabetesPedigreeFunction = 'Must be a number';
    }
    if (!values.age) {
      errors.age = 'Required';
    } else if (isNaN(values.age)) {
      errors.age = 'Must be a number';
    }
    return errors;
  };
  

  const formik = useFormik({
    initialValues: {
      pregnancies: '',
      glucose: '',
      bloodPressure: '',
      skinThickness: '',
      insulin: '',
      bmi: '',
      diabetesPedigreeFunction: '',
      age: ''
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true); // Set loading to true before making the prediction request
      try {
        const response = await axios.post('http://localhost:5000/predict', {
          features: Object.values(values).map(Number)
        });

        setPrediction(response.data.prediction);
      } catch (error) {
        console.error('Prediction error:', error.message);
        setError('Failed to predict: ' + error.message);
      } finally {
        setLoading(false); // Set loading to false after receiving the prediction or encountering an error
      }
    }
  })

  return (
    <div className="m-10 min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Diabetes Prediction</h1>
      <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {Object.keys(formik.values).map((key) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {key === 'bloodPressure' ? 'Blood Pressure' : key === 'skinThickness' ? 'Skin Thickness' : key === 'diabetesPedigreeFunction' ? 'Diabetes Pedigree Function' : key}
            </label>
            <input 
              type="text" 
              name={key} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              value={formik.values[key]} 
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched[key] && formik.errors[key] ? 'border-red-500' : ''}`} 
            />
            {formik.touched[key] && formik.errors[key] ? (
              <p className="text-red-500 text-xs italic">{formik.errors[key]}</p>
            ) : null}
          </div>
        ))}
        <div className="flex items-center mt-3">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 h-[75%] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Predicting...' : 'Predict'}
          </button>
          {prediction !== null && !loading && (
            <div className="ml-4 p-3 bg-white rounded-lg shadow-md">
              <h2 className="text-sm font-bold">
                Prediction: {prediction === 1 ? 'Diabetes' : 'No Diabetes'}
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
  )
}

export default IndexPage
