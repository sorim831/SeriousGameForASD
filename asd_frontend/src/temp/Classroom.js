import "./classroom.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";

function Classroom() {
  return (
    <div className="classroom-container">
      {/*상단 화면*/}
      <div className="top">
        <div className="QuestionSelect">
          <QuestionSelect />
        </div>
      </div>

      {/*하단 화면*/}
      <div className="bottom">
        <div className="SelectedQuestion">
          <SelectedQuestion />
        </div>
        <div>
          <ScoreAndFeedBack />
        </div>
        <div className="ClassData">
          <ClassData />
        </div>
      </div>
    </div>
  );
}

export default Classroom;
