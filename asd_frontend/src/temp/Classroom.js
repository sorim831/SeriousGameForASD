import "./classroom.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";

function Classroom() {
  return (
    <div className="classroom-container">
      <div className="component-container">
        <QuestionSelect />
      </div>
      <div className="component-container">
        <SelectedQuestion />
      </div>
    </div>
  );
}

export default Classroom;
