import React, { useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import useUpdateComplaint from "@/hooks/useUpdateComplaint";

const UpdateComplaintForm = ({ complaintID, initialData, onClose }) => {
  const { loading, error, updateComplaint } = useUpdateComplaint();
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateComplaint(complaintID, formData);
    onClose(); // Close the form after submitting
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
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
      <Input
        label="Latitude"
        name="lat"
        type="number"
        value={formData.lat}
        onChange={handleChange}
      />
      <Input
        label="Longitude"
        name="lng"
        type="number"
        value={formData.lng}
        onChange={handleChange}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Complaint"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default UpdateComplaintForm;