import useComplaintStore from "@/store/useComplaintStore";
import useShowToast from "@/hooks/useShowToast";

const useCreateComplaint = () => {
  const showToast = useShowToast();
  const { addComplaint, loading, error } = useComplaintStore();

  const handleCreateComplaint = async (formData) => {
    try {
      await addComplaint(formData);
      showToast("Success", "Complaint created successfully", "success");
      window.location.reload();
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return { handleCreateComplaint, loading, error };
};

export default useCreateComplaint;