import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Stepper,
  Step,
  Button,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import FileUpload from "./fileUpload";
import useShowToast from "@/hooks/useShowToast";
import useCreateComplaint from "@/hooks/useCreateComplaint";
import { SelectCategory } from "./category.select";

export function CreateComplaintDialog({ open, handleOpen }) {
  const { handleCreateComplaint, loading, error: createError } = useCreateComplaint();
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    lat: null,
    lng: null,
    image: null, // To store the uploaded image file
    village: "",
    street: "",
  });

  const handleNext = () => {
    setError(null); // Clear error when moving to the next step

    // Validation logic for each step
    if (activeStep === 0) {
      if (!formData.title || !formData.description || !formData.category) {
        setError("Please fill all the fields");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.lat || !formData.lng || !formData.village || !formData.street) {
        setError("Please fill all the fields");
        return;
      }
    } else if (activeStep === 2) {
      if (!formData.image) {
        setError("Please upload an image");
        return;
      }
    }

    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };

  const handlePrev = () => {
    setError(null); // Clear error when moving to the previous step
    !isFirstStep && setActiveStep((cur) => cur - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when input changes
  };

  const handleImageUpload = (image) => {
    setFormData((prev) => ({ ...prev, image })); // Update formData with the uploaded image
    setError(null); // Clear error when an image is uploaded
  };

  const handleSubmit = async () => {
    // Convert lat and lng to numbers before submitting
    const dataToSubmit = new FormData();
    dataToSubmit.append("title", formData.title);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("category", formData.category);
    dataToSubmit.append("lat", parseFloat(formData.lat));
    dataToSubmit.append("lng", parseFloat(formData.lng));
    dataToSubmit.append("village", formData.village);
    dataToSubmit.append("street", formData.street);
    dataToSubmit.append("image", formData.image);

    await handleCreateComplaint(dataToSubmit);
    handleOpen(); // Close the dialog after submitting
    setFormData({
      title: "",
      description: "",
      category: "",
      lat: null,
      lng: null,
      image: null,
      village: "",
      street: "",
    });
    activeStep !== 0 && setActiveStep(0); // Reset the active step to the first step

  };

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Create Complaint</DialogHeader>
      <DialogBody divider>
        <div className="w-full py-4 px-8">
          <Stepper
            activeStep={activeStep}
            isLastStep={(value) => setIsLastStep(value)}
            isFirstStep={(value) => setIsFirstStep(value)}
          >
            <Step onClick={() => setActiveStep(0)}>1</Step>
            <Step onClick={() => setActiveStep(1)}>2</Step>
            <Step onClick={() => setActiveStep(2)}>3</Step>
          </Stepper>

          <div className="mt-8">
            {activeStep === 0 && (
              <div className="space-y-4">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <SelectCategory
                  value={formData.category}
                  setValue={(value) => {
                    console.log("Selected Category ", value);
                    setFormData((prev) => ({ ...prev, category: value }));
                  }}
                  disabled={false}
                />
                {error && (
                  <Typography color="red" className="mt-2 text-center font-extralight">
                    {error}
                  </Typography>
                )}
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Latitude"
                  name="lat"
                  value={formData.lat}
                  type="number"
                  onChange={handleChange}
                  placeholder="eg: 6.5244"
                />
                <Input
                  label="Longitude"
                  name="lng"
                  value={formData.lng}
                  type="number"
                  onChange={handleChange}
                  placeholder="eg: 3.3792"
                />
                <Input
                  label="Village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                />
                <Input
                  label="Street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
                {error && (
                  <Typography color="red" className="mt-2 text-center font-extralight">
                    {error}
                  </Typography>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <FileUpload onFileSelect={handleImageUpload} />
                {formData.image && <p>Selected: {formData.image.name}</p>}
                {error && (
                  <Typography color="red" className="mt-2 text-center font-extralight">
                    {error}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        {isLastStep ? (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}