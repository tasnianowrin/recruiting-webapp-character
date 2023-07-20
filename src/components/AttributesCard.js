import React from "react";

const AttributesCard = ({
  attributesState,
  modifiersState,
  handleIncrement,
  handleDecrement,
}) => {
  return (
    <div>
      <h3>Attributes</h3>
      <ul>
        {Object.entries(attributesState).map(([attribute, value], index) => (
          <li key={index}>
            {attribute}: <span>{value}</span> (Modifier{" "}
            {modifiersState[attribute]})
            <button onClick={() => handleDecrement("attributes", attribute)}>
              -
            </button>
            <button onClick={() => handleIncrement("attributes", attribute)}>
              +
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributesCard;
