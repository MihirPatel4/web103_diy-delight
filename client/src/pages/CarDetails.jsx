import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCar, deleteCar } from "../services/CarsAPI";
import "../App.css";
import "../css/CarDetails.css";

const CarDetails = () => {
  const [car, setCar] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCar = async () => {
      try {
        const result = await getCar(id);
        setCar(result);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadCar();
  }, [id]);

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      await deleteCar(id);
      navigate("/customcars");
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <main className="car-detail-page">
      {car ?
        <article className="car-detail-card" key={car.id}>
          <header>
            <h3>{car.name || "Custom Car"}</h3>
            <strong>${car.price}</strong>
          </header>
          <dl>
            <div>
              <dt>Car Type</dt>
              <dd>{car.is_convertible ? "Convertible" : "Coupe"}</dd>
            </div>
            {["exterior", "roof", "wheels", "interior"].map((attribute) => (
              <div key={attribute}>
                <dt>{attribute[0].toUpperCase() + attribute.slice(1)}</dt>
                <dd>{car[attribute]}</dd>
              </div>
            ))}
          </dl>
          <footer>
            <Link to={`/edit/${car.id}`} role="button">Edit</Link>
            <button onClick={handleDelete}>Delete</button>
          </footer>
        </article>
      : 
        <article className="car-detail-card">
          <header><h4>Loading...</h4></header>
        </article>
      }
    </main>
  );
};

export default CarDetails;