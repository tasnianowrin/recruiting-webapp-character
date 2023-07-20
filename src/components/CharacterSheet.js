import React, { useCallback, useEffect, useState } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "../consts";
import "./CharacterSheet.css";
import AttributesCard from "./AttributesCard";
import ClassesCard from "./ClassesCard";
import SelectedClassCard from "./SelectedClassCard";
import SkillsCard from "./SkillsCard";

export const apiUrl =
  "https://recruiting.verylongdomaintotestwith.ca/api/{tasnianowrin}/character";

const CharacterSheet = () => {
  const MAX_ATTRIBUTE_VALUE = 70;
  const [attributesState, setAttributesState] = useState(
    ATTRIBUTE_LIST.reduce((att, attribute) => ({ ...att, [attribute]: 10 }), {})
  );

  const [classesState, setClassesState] = useState(CLASS_LIST);

  const [skillsState, setSkillsState] = useState(
    SKILL_LIST.reduce((att, skill) => ({ ...att, [skill.name]: 0 }), {})
  );

  // State for modifiers
  const [modifiersState, setModifiersState] = useState(
    ATTRIBUTE_LIST.reduce((att, attribute) => ({ ...att, [attribute]: 0 }), {})
  );

  const [selectedClass, setSelectedClass] = useState(null);

  const [selectedClassAttributes, setSelectedClassAttributes] = useState({});

  // calculate the sum of all attributes
  const calculateTotalAttributes = (attributes) => {
    return Object.values(attributes).reduce(
      (sum, attribute) => sum + attribute,
      0
    );
  };

  const handleIncrement = (category, key) => {
    switch (category) {
      case "attributes":
        // Check the maximum limit
        if (
          calculateTotalAttributes(attributesState) + 1 <=
          MAX_ATTRIBUTE_VALUE
        ) {
          setAttributesState((prevState) => ({
            ...prevState,
            [key]: prevState[key] + 1,
          }));
        } else {
          window.alert(
            "Cannot increase attribute. It has reached the maximum limit."
          );
        }
        break;
      case "classes":
        setClassesState((prevState) => ({
          ...prevState,
          [key]: { ...prevState[key], [key]: prevState[key][key] + 1 },
        }));
        break;
      case "skills":
        setSkillsState((prevState) => ({
          ...prevState,
          [key]: prevState[key] + 1,
        }));
        break;
      default:
        break;
    }
  };

  const handleDecrement = (category, key) => {
    switch (category) {
      case "attributes":
        setAttributesState((prevState) => ({
          ...prevState,
          [key]: prevState[key] - 1,
        }));
        break;
      case "classes":
        setClassesState((prevState) => ({
          ...prevState,
          [key]: { ...prevState[key], [key]: prevState[key][key] - 1 },
        }));
        break;
      case "skills":
        setSkillsState((prevState) => ({
          ...prevState,
          [key]: prevState[key] - 1,
        }));
        break;
      default:
        break;
    }
  };

  const handleClassClick = (className) => {
    if (Object.keys(CLASS_LIST).includes(className)) {
      setSelectedClass(className === selectedClass ? null : className);
      setSelectedClassAttributes(CLASS_LIST[className]);
    }
  };

  const calculateModifier = (value) => {
    return Math.floor((value - 10) / 2);
  };

  // Update modifiers when attributes change
  useEffect(() => {
    setModifiersState((prevState) =>
      ATTRIBUTE_LIST.reduce(
        (att, attribute) => ({
          ...att,
          [attribute]: calculateModifier(attributesState[attribute]),
        }),
        {}
      )
    );
  }, [attributesState]);

  // State for skill points - for handling limit of total skill points - incomplete/not working as expected
  const [skillPointsState, setSkillPointsState] = useState(
    SKILL_LIST.reduce((att, skill) => ({ ...att, [skill.name]: 0 }), {})
  );
  const [skillPoints, setSkillPoints] = useState(0);

  // Calculate total available skill points based on overall modifiers
  const calculateTotalSkillPoints = (modifiers) => {
    const totalModifiers = Object.values(modifiers).reduce(
      (sum, modifier) => sum + modifier,
      0
    );
    return 10 + 4 * totalModifiers;
  };

  // Update skill points when attributes change - incomplete/not working as expected
  useEffect(() => {
    const availableSkillPoints = calculateTotalSkillPoints(modifiersState);
    setSkillPoints(availableSkillPoints);
    setSkillPointsState((prevState) =>
      SKILL_LIST.reduce(
        (att, skill) => ({
          ...att,
          [skill.name]: Math.min(prevState[skill.name], availableSkillPoints),
        }),
        {}
      )
    );
  }, [modifiersState]);

  // Function to handle skill points allocation - incomplete/not working as expected
  const handleAllocateSkillPoints = (skillName, incrementing) => {
    if (skillPointsState[skillName] < skillPoints) {
      incrementing &&
        setSkillPointsState((prevState) => ({
          ...prevState,
          [skillName]: prevState[skillName] + 1,
        }));

      !incrementing &&
        setSkillPointsState((prevState) => ({
          ...prevState,
          [skillName]: prevState[skillName] - 1,
        }));
    }
  };

  // save to API

  const saveCharactersToAPI = useCallback(async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attributes: attributesState,
          classes: classesState,
          skills: skillsState,
        }),
      });

      if (response.ok) {
        console.log("Character data saved successfully!");
      } else {
        console.error("Failed to save character data.");
      }
    } catch (error) {
      console.error("Error saving character data:", error);
    }
  }, [attributesState, classesState, skillsState]);

  useEffect(() => {
    return () => {
      saveCharactersToAPI();
    };
  }, [saveCharactersToAPI]);

  return (
    <>
      <h2>Character Sheet</h2>
      <div className="character-sheet">
        {/* Attributes Card */}
        <AttributesCard
          attributesState={attributesState}
          modifiersState={modifiersState}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
        />

        {/* Classes Card */}
        <ClassesCard
          classesState={classesState}
          handleClassClick={handleClassClick}
        />

        {/* Selected Class Card */}
        {selectedClass && (
          <SelectedClassCard
            selectedClass={selectedClass}
            selectedClassAttributes={selectedClassAttributes}
          />
        )}

        {/* Skills Card */}
        <SkillsCard
          skillsState={skillsState}
          modifiersState={modifiersState}
          skillPointsState={skillPointsState}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          handleAllocateSkillPoints={handleAllocateSkillPoints}
          skillPoints={skillPoints}
        />
      </div>
    </>
  );
};

export default CharacterSheet;
