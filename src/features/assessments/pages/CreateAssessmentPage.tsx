import { CreateAssessmentForm } from "../components/EditAssessmentForm";

export function CreateAssessmentPage() {
  const handleSave = (assessmentData: any) => {
    console.log("Create assessment", assessmentData);
    // navigate("../courses");
  };

  const handleCancel = () => {
    // navigate("../courses");
  };

  return <CreateAssessmentForm onSave={handleSave} onCancel={handleCancel} />;
}
