import React, { useEffect, useState } from "react";
import { CreateComplaintDialog } from "@/components/custom/CreateComplaintDialog";
import useComplaintStore from "@/store/useComplaintStore";
import { ComplaintCard } from "@/components/custom/complaintCard";
import Loader from "@/components/custom/Loader";
import { Button, Typography } from "@material-tailwind/react";
import { ErrorPage } from "@/components/custom/ErrorPage";
const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user.role;
  const { complaints, loading, error, fetchComplaints } = useComplaintStore();
  const [open, setOpen] = useState(false);
  const [createComplaintDialogBox, setCreateComplaintDialogBox] = useState(false);
  const handleDialogOpenForComplaintCreation = () => {
    console.log("CLcike")
    setCreateComplaintDialogBox(!createComplaintDialogBox);
  }

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleOpen = () => setOpen(!open);

  if (loading) return  <Loader/>;
  if (error) return <ErrorPage error={error}/>;

  return (
    <div>
      {complaints ? (
        <>
        <div className=" uppercase text-2xl font-bold text-gray-600 mt-4 mb-4 ml-8">
          <div> {role === "admin" ? "All Complaints": "My Complaints"} <span className="text-xs">{role === "admin"? " (Admin Account)": ""}</span></div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreateComplaintDialog open={open} handleOpen={handleOpen} />
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
        </>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center p-4">
  <img 
    src="/no_data.jpg" 
    alt="No complaints found" 
    className="w-96 max-w-md mx-auto mb-8" 
    loading="lazy" 
  />
  <Typography variant="h5" className=" text-gray-600 mb-4 text-center uppercase">
    No complaints found
  </Typography>
  <p className="text-lg text-gray-600 mb-8 text-center font-extralight">
    Create a complaint from the sidebar to get started.
  </p>
  <Button
    className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
    aria-label="Create Complaint"
    onClick={handleDialogOpenForComplaintCreation}
  >
    Create Complaint
  </Button>
  <CreateComplaintDialog open={createComplaintDialogBox} handleOpen={handleDialogOpenForComplaintCreation} />

</div>
      )}
    </div>
  );
};

export default HomePage;