import React, { useState } from 'react'
import axios from 'axios'

const IndexPage = () => {
  const [features, setFeatures] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigreeFunction: '',
    age: ''
  })
  const [prediction, setPrediction] = useState(null)

  const handleChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await axios.post('http://localhost:5000/predict', {
      features: Object.values(features).map(Number)
    })
    setPrediction(response.data.prediction)
  }

  return (
    <div>
      <h1>Diabetes Prediction</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(features).map((key) => (
          <div key={key}>
            <label>{key}</label>
            <input type="number" name={key} value={features[key]} onChange={handleChange} />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>
      {prediction !== null && (
        <div>
          <h2>Prediction: {prediction === 1 ? 'Diabetes' : 'No Diabetes'}</h2>
        </div>
      )}
    </div>
  )
}

export default IndexPage
