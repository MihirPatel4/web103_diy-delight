import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCars, deleteCar } from "../services/CarsAPI";
import "../css/ViewCars.css";

const ViewCars = () => {
  const [cars, setCars] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

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

  useEffect(() => {
    if (openMenuId === null) {
      return undefined;
    }

    const closeMenuOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("pointerdown", closeMenuOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, [openMenuId]);

  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
      setOpenMenuId(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="custom-cars-page">
      <header className="custom-cars-header">
        <div>
          <h2>Custom cars</h2>
        </div>
      </header>

      <section className="custom-car-grid">
        {cars.length === 0 ? (
          <p className="empty-cars">No custom cars yet</p>
        ) : (
          cars.map((car) => (
            <article
              className={`custom-car-card ${
                openMenuId === car.id ? "custom-car-card-menu-open" : ""
              }`}
              key={car.id}
            >
              <header>
                <h4>{car.name || "Custom Car"}</h4>
                <strong>${car.price}</strong>
              </header>
              <p>{car.is_convertible ? "🏎️" : "🚗"}</p>
              <footer>
                <div className="custom-car-actions" ref={openMenuId === car.id ? menuRef : null}>
                  <button
                    className="custom-car-more-button"
                    onClick={() =>
                      setOpenMenuId((currentId) =>
                        currentId === car.id ? null : car.id
                      )
                    }
                  >
                    More
                  </button>
                  <div className="custom-car-menu" id={`car-menu-${car.id}`} role="group" hidden={openMenuId !== car.id}>
                    <Link role="button" to={`/customcars/${car.id}`}>View details</Link>
                    <Link role="button" to={`/edit/${car.id}`}>Edit</Link>
                    <button onClick={() => handleDelete(car.id)}>Delete</button>
                  </div>
                </div>
              </footer>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default ViewCars;
