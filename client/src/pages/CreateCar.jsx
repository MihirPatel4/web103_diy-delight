import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCar } from "../services/CarsAPI";
import "../css/CreateCar.css";

const BASE_PRICE = 65000;

const stages = [
  {
    key: "exterior",
    label: "Exterior",
    options: [
      {
        value: "Black",
        priceAdjustment: 500,
      },
      {
        value: "Red",
        priceAdjustment: 1000,
      },
      {
        value: "White",
        priceAdjustment: 500,
      },
      {
        value: "Silver",
        priceAdjustment: 500,
      },
      {
        value: "Blue",
        priceAdjustment: 1000,
      },
      {
        value: "Purple",
        priceAdjustment: 1000,
      },
      {
        value: "Pink",
        priceAdjustment: 1000,
      },
    ],
  },
  {
    key: "roof",
    label: "Roof",
    options: [
      {
        value: "Body Color",
        priceAdjustment: 500,
      },
      {
        value: "Carbon Flash Nacelles",
        priceAdjustment: 1000,
      },
      {
        value: "Visible Carbon Fiber",
        priceAdjustment: 1000,
      },
    ],
  },
  {
    key: "wheels",
    label: "Wheels",
    options: [
      {
        value: "Carbon Flash",
        priceAdjustment: 500,
      },
      {
        value: "Visible Carbon Fiber",
        priceAdjustment: 600,
      },
      {
        value: "Bronze Forged",
        priceAdjustment: 1200,
      },
      {
        value: "Satin Graphite",
        priceAdjustment: 700,
      },
      {
        value: "Sterling Silver",
        priceAdjustment: 500,
      },
    ],
  },
  {
    key: "interior",
    label: "Interior",
    options: [
      {
        value: "Jet Black",
        priceAdjustment: 1000,
      },
      {
        value: "Natural Dipped",
        priceAdjustment: 1000,
      },
      {
        value: "Red",
        priceAdjustment: 1000,
      },
      {
        value: "Cool Gray",
        priceAdjustment: 1000,
      },
      {
        value: "Red and Black",
        priceAdjustment: 2000,
      },
    ],
  },
  {
    key: "name",
    label: "Name your car",
    options: [],
  },
];

const CreateCar = () => {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);
  const [selections, setSelections] = useState({
    is_convertible: null,
    exterior: "",
    roof: "",
    wheels: "",
    interior: "",
    name: "",
  });
  const currentStage = stages[stageIndex];

  const price =
    BASE_PRICE +
    stages.reduce((total, stage) => {
      const selectedOption = stage.options.find(
        (option) => option.value === selections[stage.key],
      );
      return total + (selectedOption?.priceAdjustment ?? 0);
    }, 0);

  const selectOption = (stage, value) => {
    setSelections((current) => ({ ...current, [stage.key]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

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
                  required
                />
              </label>
            ) : currentStage.options.length > 0 ? (
              currentStage.options.map((option) => (
                <label className="customizer-option" key={option.value}>
                  <input
                    type="radio"
                    name={currentStage.key}
                    value={String(option.value)}
                    checked={selections[currentStage.key] === option.value}
                    onChange={() => selectOption(currentStage, option.value)}
                  />
                  <span>
                    {option.value}
                    {option.priceAdjustment !== 0 &&
                      ` (+$${option.priceAdjustment})`}
                  </span>
                </label>
              ))
            ) : (
              <p className="empty-options">Options for this feature will be added soon. You can continue with no selection.</p>
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

          <footer className="customizer-actions">
            <button type="button" className="secondary" onClick={() => setStageIndex((index) => index - 1)}>Back</button>
            {stageIndex < stages.length - 1 ? (
              <button 
                type="button" 
                onClick={() => setStageIndex((index) => index + 1)}
              >Next</button>
            ) : (
              <button
                type="submit"
                disabled={!selections.name.trim()}
              >Create Car</button>
            )}
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateCar;
