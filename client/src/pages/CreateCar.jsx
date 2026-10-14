import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCar } from "../services/CarsAPI";
import { getRoofAvailability, isRoofCompatible, } from "../utilities/roofValidation";
import { calcPrice } from "../utilities/calcPrice";
import { stages } from "../data/stages"
import "../css/CreateCar.css";

const CreateCar = () => {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);
  const [selections, setSelections] = useState({ is_convertible: null, exterior: "", roof: "", wheels: "", interior: "", name: "" });
  const [validationError, setValidationError] = useState("");
  const currentStage = stages[stageIndex];

  const price = calcPrice(selections);

  const selectOption = (stage, value) => {
    setValidationError("");
    setSelections((current) => {
      if (stage.key !== "is_convertible") {
        return { ...current, [stage.key]: value };
      }

      return {
        ...current,
        is_convertible: value,
        roof: isRoofCompatible(current.roof, value)
          ? current.roof
          : "",
      };
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const hasMissingSelection = stages.some((stage) => {
      const value = selections[stage.key];
      return !value;
    });

    if (hasMissingSelection) {
      setValidationError("All options must be selected before creating.");
      return;
    }

    try {
      await createCar({
        ...selections,
        price,
        name: selections.name.trim(),
      });
      navigate("/customcars");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="customizer">
      <section className="customizer-panel">
        <header className="customizer-header">
          <div>
            <h2>Customize your car</h2>
          </div>
          <div className="price-display">
            <span>Current price</span>
            <strong>${price}</strong>
          </div>
        </header>

        <div className="customizer-progress">
          <span>
            Step {stageIndex + 1} of {stages.length}
          </span>
        </div>

        <form onSubmit={handleCreate}>
          <fieldset className="customizer-options">
            <legend>{currentStage.label}</legend>
            {currentStage.key === "name" ? (
              <label className="customizer-name">
                <span>Choose a name for your custom car</span>
                <input
                  type="text"
                  name="name"
                  value={selections.name}
                  onChange={(event) => selectOption(currentStage, event.target.value)}
                />
              </label>
            ) : currentStage.options.length > 0 ? (
              currentStage.options.map((option) => {
                const availability = currentStage.key === "roof" ? getRoofAvailability(option.value, selections.is_convertible) : { disabled: false, message: "" };

                return (
                  <label className="customizer-option" key={option.value}>
                    <input
                      type="radio"
                      name={currentStage.key}
                      value={String(option.value)}
                      checked={selections[currentStage.key] === option.value}
                      disabled={availability.disabled}
                      onChange={() => selectOption(currentStage, option.value)}
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
            ) : (
              <p className="empty-options">No options present</p>
            )}
          </fieldset>

          {stageIndex === stages.length - 1 && (
            <section className="customizer-review">
              <h3>Your build</h3>
              <dl>
                {stages.filter((stage) => stage.key !== "name").map((stage) => {
                  const selection = selections[stage.key];
                  const option = stage.options.find(
                    (item) => item.value === selection,
                  );

                  return (
                    <div key={stage.key}>
                      <dt>{stage.label}</dt>
                      <dd>{option?.label ?? (selection === null || selection === "" ? "Not selected" : String(selection))}</dd>
                    </div>
                  );
                })}
                <div>
                  <dt>Name</dt>
                  <dd>{selections.name.trim() || "Not entered"}</dd>
                </div>
              </dl>
            </section>
          )}

          {validationError && (<p className="form-error" role="alert">{validationError}</p>)}

          <footer className="customizer-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => { 
                setValidationError("");
                setStageIndex((index) => index - 1);
              }}
              disabled={stageIndex === 0}
            >Back</button>
            {stageIndex < stages.length - 1 ? (
              <button type="button" onClick={() => setStageIndex((index) => index + 1)}>Next</button>
            ) : (
              <button type="submit">Create Car</button>
            )}
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateCar;
