import React from "react";

const ClassesCard = ({ classesState, handleClassClick }) => {
  return (
    <div>
      <h3>Classes</h3>
      <ul>
        {Object.keys(classesState).map((className, index) => (
          <li key={index}>
            <button onClick={() => handleClassClick(className)}>
              {className}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassesCard;
