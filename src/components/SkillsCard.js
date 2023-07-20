import React from "react";
import { SKILL_LIST } from "../consts";

const SkillsCard = ({
  skillsState,
  modifiersState,
  skillPointsState,
  handleIncrement,
  handleDecrement,
  handleAllocateSkillPoints,
  skillPoints,
}) => {
  return (
    <div>
      <h3>Skills</h3>
      <ul>
        {SKILL_LIST.map((skill, index) => (
          <li key={index}>
            {skill.name}: <span>{skillsState[skill.name]}</span>(Attribute:{" "}
            {skill.attributeModifier}):{" "}
            {modifiersState[skill.attributeModifier]}
            <button
              onClick={() => {
                handleDecrement("skills", skill.name);
                handleAllocateSkillPoints(skill.name, false);
              }}
            >
              -
            </button>
            <button
              onClick={() => {
                handleIncrement("skills", skill.name);
                handleAllocateSkillPoints(skill.name, true);
              }}
            >
              +
            </button>
            <span>total: </span>{" "}
            {skillPointsState[skill.name] +
              modifiersState[skill.attributeModifier]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsCard;
