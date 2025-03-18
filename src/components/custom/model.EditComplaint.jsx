import React, { useState } from "react";
import {
  Input,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useUpdateComplaint from "@/hooks/useUpdateComplaint";
import { SelectStatus } from "./status.select";
import { SelectCategory } from "./category.select";

export function ModelEditComplaint({ open, handleOpen, complaint, setComplaint }) {
  const [editMode, setEditMode] = useState(false);
  const user = localStorage.getItem('user');
  const userRole = user ? JSON.parse(user).role : 'user';
  const { loading, error, updateComplaint } = useUpdateComplaint();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusUpdate = async () => {
    const formData = {
      title: complaint.title,
      category: complaint.category,
      description: complaint.description,
      village: complaint.village,
      street: complaint.street,
      lat: parseFloat(complaint.location.lat),
      lng: parseFloat(complaint.location.lng),
      status: complaint.status,
    };

    if (userRole === 'admin') {
      formData.userID = complaint.userId;
    }

    await updateComplaint(complaint.id, formData);
    setEditMode(false); // Exit edit mode after updating
    handleOpen(); // Close the dialog
  };

  return (
    <>
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4 ">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Complaint Details
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6 h-[42rem] overflow-scroll">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Title
            </Typography>
            <Input
              value={complaint.title}
              onChange={handleChange}
              name="title"
              color="gray"
              size="lg"
              placeholder="Title"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
              disabled={!editMode}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Category
            </Typography>
            <SelectCategory
              value={complaint.category}
              setValue={(value) => {
                console.log("Selected Category ", value);
                setComplaint((prev) => ({ ...prev, category: value }));
              }}
              disabled={!editMode}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Description
            </Typography>
            <Textarea
              value={complaint.description}
              onChange={handleChange}
              name="description"
              rows={7}
              placeholder="Description"
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
              labelProps={{
                className: "hidden",
              }}
              disabled={!editMode}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Village
            </Typography>
            <Input
              value={complaint.village}
              onChange={handleChange}
              name="village"
              color="gray"
              size="lg"
              placeholder="Village"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
              disabled={!editMode}
            />
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Street
            </Typography>
            <Input
              value={complaint.street}
              onChange={handleChange}
              name="street"
              color="gray"
              size="lg"
              placeholder="Street"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
              disabled={!editMode}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Latitude
              </Typography>
              <Input
                value={complaint.location.lat}
                onChange={handleChange}
                name="lat"
                type="number"
                color="gray"
                size="lg"
                placeholder="Latitude"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                disabled={!editMode}
              />
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Longitude
              </Typography>
              <Input
                value={complaint.location.lng}
                onChange={handleChange}
                name="lng"
                type="number"
                color="gray"
                size="lg"
                placeholder="Longitude"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                disabled={!editMode}
              />
            </div>
          </div>
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Status
            </Typography>
            <SelectStatus
              value={complaint.status}
              setValue={(value) => {
                console.log("Selected Status ", value);
                setComplaint((prev) => ({ ...prev, status: value }));
              }}
              disabled={!editMode || userRole === 'user'}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          {editMode ? (
            <div className="flex gap-4">
              <Button 
                className="ml-auto" 
                onClick={handleStatusUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save"}
              </Button>
              {error && <Typography color="red" className="mt-2">{error}</Typography>}
              <Button className="ml-auto" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button className="ml-auto" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
}