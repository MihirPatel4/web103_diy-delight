import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCars } from "../services/CarsAPI";
import "../css/ViewCars.css";

const ViewCars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const result = await getAllCars();
        setCars(result);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadCars();
  }, []);

  return (
    <main className="custom-cars-page">
      <header className="custom-cars-header">
        <div>
          <h2>Custom cars</h2>
        </div>
      </header>

      <section className="custom-car-grid" aria-label="Created cars">
        {cars.length === 0 ? (
          <p className="empty-cars">No custom cars yet</p>
        ) : (
          cars.map((car) => (
            <article className="custom-car-card" key={car.id}>
              <header>
                <h3>{car.name || "Custom Car"}</h3>
                <strong>${car.price}</strong>
              </header>
              <dl>
                <div>
                  <dt>Car Type</dt>
                  <dd>
                    {car.is_convertible === true ? "Convertible" : "Coupe"}
                  </dd>
                </div>
                {["exterior", "roof", "wheels", "interior"].map((attribute) => (
                  <div key={attribute}>
                    <dt>{attribute[0].toUpperCase() + attribute.slice(1)}</dt>
                    <dd>{car[attribute]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default ViewCars;
