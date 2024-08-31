import { CoursePart } from "../types";

interface PartProps {
  partData: CoursePart;
}

const Part = ({ partData }: PartProps) => {
  switch (partData.kind) {
    case "basic":
      return (
        <p>
          <b>
            {partData.name} {partData.exerciseCount}
          </b>
          <div>
            <em>{partData.description}</em>
          </div>
        </p>
      );
    case "group":
      return (
        <p>
          <b>
            {partData.name} {partData.exerciseCount}
          </b>
          <div>project exercises {partData.groupProjectCount}</div>
        </p>
      );

    case "background":
      return (
        <p>
          <b>
            {partData.name} {partData.exerciseCount}
          </b>
          <div>
            <em>{partData.description}</em>
          </div>
          <div>submit to {partData.backgroundMaterial}</div>
        </p>
      );

    case "special":
      return (
        <p>
          <b>
            {partData.name} {partData.exerciseCount}
          </b>
          <div>
            <em>{partData.description}</em>
          </div>
          <div>
            required skills:{" "}
            {partData.requirements.map((skill, id) => (
              <span>{id > 0 ? ", " + skill : skill}</span>
            ))}
          </div>
        </p>
      );
  }
};

export default Part;