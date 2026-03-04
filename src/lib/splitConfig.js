export const SPLIT_TYPES = [
  {
    id: "PPL",
    label: "PPL",
    sublabel: "Push / Pull / Leg",
    desc: "3 days/week · Chest+Shoulders+Tri · Back+Bi · Legs",
    sections: ["Push", "Pull", "Leg"],
  },
  {
    id: "Upper/Lower",
    label: "UPPER / LOWER",
    sublabel: "Upper body + Lower body",
    desc: "4 days/week · 2× Upper · 2× Lower",
    sections: ["Upper", "Lower"],
  },
  {
    id: "Full Body",
    label: "FULL BODY",
    sublabel: "Everything every session",
    desc: "3 days/week · All muscle groups each workout",
    sections: ["Full Body"],
  },
  {
    id: "Bro Split",
    label: "BRO SPLIT",
    sublabel: "One muscle group per day",
    desc: "5 days/week · Chest · Back · Shoulders · Arms · Legs",
    sections: ["Chest", "Back", "Shoulders", "Arms", "Legs"],
  },
  {
    id: "PPLUL",
    label: "PPLUL — ADVANCED",
    sublabel: "Push / Pull / Leg / Upper / Lower",
    desc: "5 days/week · High volume · For serious lifters",
    sections: ["Push", "Pull", "Leg", "Upper", "Lower"],
  },
  {
    id: "Custom",
    label: "CUSTOM",
    sublabel: "Build your own split",
    desc: "Name your own training days · Full flexibility",
    sections: null,
  },
  {
    id: "Day Split",
    label: "DAY SPLIT",
    sublabel: "Assign by day of the week",
    desc: "Mon–Sun schedule · Assign exercises to specific days",
    sections: null,
  },
];

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_SHORT = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Map muscle group → suggested category for a given split
export function suggestCategory(splitId, muscleGroup) {
  if (splitId === "Full Body") return "Full Body";
  const MAP = {
    PPL: {
      Chest: "Push", Shoulders: "Push", Triceps: "Push", Arms: "Push",
      Back: "Pull", Biceps: "Pull",
      Legs: "Leg", Glutes: "Leg", Core: "Push",
    },
    "Upper/Lower": {
      Chest: "Upper", Back: "Upper", Shoulders: "Upper",
      Arms: "Upper", Biceps: "Upper", Triceps: "Upper", Core: "Upper",
      Legs: "Lower", Glutes: "Lower",
    },
    "Bro Split": {
      Chest: "Chest", Back: "Back", Shoulders: "Shoulders",
      Arms: "Arms", Biceps: "Arms", Triceps: "Arms",
      Legs: "Legs", Glutes: "Legs", Core: "Core",
    },
    PPLUL: {
      Chest: "Push", Shoulders: "Push", Triceps: "Push", Arms: "Push",
      Back: "Pull", Biceps: "Pull",
      Legs: "Leg", Glutes: "Leg", Core: "Upper",
    },
  };
  return MAP[splitId]?.[muscleGroup] || muscleGroup;
}
