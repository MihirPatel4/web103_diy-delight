import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editCar, getCar } from "../services/CarsAPI";
import { getRoofAvailability, isRoofCompatible } from "../utilities/roofValidation";
import { calcPrice } from "../utilities/calcPrice";
import { stages } from "../data/stages";
import "../css/EditCar.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selections, setSelections] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCar = async () => {
      try {
        const car = await getCar(id);
        if (isMounted) {
          setSelections({
            ...car,
            is_convertible: car.is_convertible === true || car.is_convertible === "Yes"
              ? "Yes"
              : "No",
            name: car.name ?? "",
          });
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setLoadError("Unable to load this car. Please try again.");
        }
      }
    };

    loadCar();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const price = calcPrice(selections ?? {});

  const selectOption = (stage, value) => {
    setValidationError("");
    setSelections((current) => {
      if (stage.key !== "is_convertible") {
        return { ...current, [stage.key]: value };
      }

      return {
        ...current,
        is_convertible: value,
        roof: isRoofCompatible(current.roof, value) ? current.roof : "",
      };
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const hasMissingSelection = stages.some((stage) => {
      return !selections[stage.key];
    });

    if (hasMissingSelection) {
      setValidationError("All options must be selected before updating.");
      return;
    }

    try {
      await editCar({
        ...selections,
        id,
        price,
        name: selections.name.trim(),
      });
      navigate(`/customcars/${id}`);
    } catch (error) {
      console.error(error);
      setValidationError("Unable to update this car. Please try again.");
    }
  };

  if (!selections) {
    return (
      <main className="customizer">
        <section className="customizer-panel">
          <h2>{loadError || "Loading..."}</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="customizer">
      <section className="customizer-panel">
        <header className="customizer-header">
          <div>
            <h2>Edit your car</h2>
          </div>
          <div className="price-display">
            <span>Current price</span>
            <strong>${price}</strong>
          </div>
        </header>

        <form onSubmit={handleUpdate}>
          {stages.map((stage) => (
            <fieldset className="customizer-options" key={stage.key}>
              <legend>{stage.label}</legend>
              {stage.key === "name" ? (
                <label className="customizer-name">
                  <span>Choose a name</span>
                  <input type="text" name="name" value={selections.name} onChange={(event) => selectOption(stage, event.target.value)}/>
                </label>
              ) : (
                stage.options.map((option) => {
                  const availability = stage.key === "roof" ? getRoofAvailability(option.value, selections.is_convertible) : { disabled: false, message: "" };

                  return (
                    <label className="customizer-option" key={option.value}>
                      <input
                        type="radio"
                        name={stage.key}
                        value={String(option.value)}
                        checked={selections[stage.key] === option.value}
                        disabled={availability.disabled}
                        onChange={() => selectOption(stage, option.value)}
                      />
                      <span>
                        {option.value}
                        {option.priceAdjustment !== 0 &&
                          ` (+$${option.priceAdjustment})`}
                      </span>
                      {availability.message && (<small className="option-availability" role="note">{availability.message}</small>)}
                    </label>
                  );
                })
              )}
            </fieldset>
          ))}

          {validationError && (
            <p className="form-error" role="alert">{validationError}</p>
          )}

          <footer className="customizer-actions">
            <button type="button" className="secondary" onClick={() => navigate(`/customcars/${id}`)}>Cancel</button>
            <button type="submit">Update</button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditCar;
