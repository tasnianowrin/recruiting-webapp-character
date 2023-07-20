import React from "react";

const SelectedClassCard = ({ selectedClass, selectedClassAttributes }) => {
  return (
    <div>
      <h3>{selectedClass} Attributes</h3>
      <ul>
        {Object.entries(selectedClassAttributes).map(
          ([attribute, value], idx) => (
            <li key={idx}>
              {attribute}: <span>{value}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default SelectedClassCard;
