import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
  Dialog,
} from "@material-tailwind/react";
import useDeleteComplaint from '@/hooks/useDeleteComplaint';
import { ModelEditComplaint } from './model.EditComplaint';

export function ComplaintCard({ complaint, onDelete }) {
  const [customComplaint, setComplaint] = useState(complaint);
  // const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);
  const { handleDeleteComplaint, loading, error } = useDeleteComplaint();

  const handleOpen = () => setOpen(!open);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevents triggering card click event
    await handleDeleteComplaint(complaint.id, complaint.userId);
    // onDelete(complaint?.id); // Call the onDelete function to remove the complaint from the list
    console.log(`Deleting complaint with id: ${complaint.id}`);
    console.log(loading, error);
  };

  return (
    <>
      <Card className="w-full max-w-[26rem] shadow-lg" onClick={handleOpen}>
        <CardHeader floated={false} color="blue-gray">
          <img
            src={complaint.imageUrl}
            alt="complaint"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
          <IconButton
            size="sm"
            color="red"
            variant="text"
            className="!absolute top-4 right-4 rounded-full"
            onClick={handleDelete}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M6 9a1 1 0 011-1h10a1 1 0 011 1v10a3 3 0 01-3 3H9a3 3 0 01-3-3V9z" />
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 011-1h4a1 1 0 011 1v1h3a1 1 0 011 1v2H5V4a1 1 0 011-1h3V2zm3 8a1 1 0 10-2 0v5a1 1 0 102 0v-5z"
                clipRule="evenodd"
              />
            </svg>
          </IconButton>
        </CardHeader>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="font-medium">
            {complaint.title || "No Title"}
          </Typography>
          <Typography color="gray" className="mt-2">
            {complaint.description}
          </Typography>
        </CardBody>
        <CardFooter className="pt-3">
          <Button size="lg" fullWidth onClick={handleOpen}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} handler={handleOpen}>
        <ModelEditComplaint
          open={open}
          handleOpen={handleOpen}
          complaint={customComplaint}
          setComplaint={setComplaint}
        />
      </Dialog>
    </>
  );
}