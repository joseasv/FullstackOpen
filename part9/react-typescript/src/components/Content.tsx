import Part from "./Part";
import { CoursePart } from "../types";

interface ContentProps {
  courseArray: CoursePart[];
}

const Content = (props: ContentProps) => {
  return props.courseArray.map((course) => <Part partData={course} />);
};

export default Content;