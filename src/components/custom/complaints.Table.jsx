import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

// const TABS = [
//   {
//     label: "All",
//     value: "all",
//   },
//   {
//     label: "Pending",
//     value: "pending",
//   },
//   {
//     label: "In Progress",
//     value: "in progress",
//   },
//   {
//     label: "Resolved",
//     value: "resolved",
//   },
//   {
//     label: "Closed",
//     value: "closed",
//   }
// ];

const TABLE_HEAD = ["Image", "Title", "Description", "Status", "Reported At", "Category", "Village", "Street"];

export function ComplaintsTable({ complaints }) {
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const complaintsPerPage = 10;

  useEffect(() => {
    filterComplaints();
  }, [activeTab, searchQuery, complaints]);

  const filterComplaints = () => {
    let filtered = complaints;

    // if (activeTab !== "all") {
    //   filtered = filtered.filter(complaint => complaint.status.toLowerCase().replace(" ", "-") === activeTab);
    // }

    if (searchQuery) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.street.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Complaints list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all complaints
            </Typography>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentComplaints.map((complaint, index) => {
              const isLast = index === currentComplaints.length - 1;
              const classes = isLast
                ? "p-4 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
                : "p-4 border-b border-blue-gray-50 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap";

              return (
                <tr key={complaint.id} onClick={() => handleRowClick(complaint)} className="cursor-pointer">
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Avatar src={complaint.imageUrl} size="sm" />
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {complaint.title}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {complaint.description}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={complaint.status}
                      color={
                        complaint.status === "Pending"
                          ? "amber"
                          : complaint.status === "In Progress"
                          ? "blue"
                          : complaint.status === "Resolved"
                          ? "green"
                          : "red"
                      }
                    />
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {new Date(complaint.reportedAt).toLocaleString()}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {complaint.category}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {complaint.village}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {complaint.street}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </CardFooter>

      <Dialog open={isModalOpen} handler={handleCloseModal} >
        <DialogHeader>Complaint Details</DialogHeader>
        <DialogBody divider>
          {selectedComplaint && (
            <div>
              <Typography variant="h6" color="blue-gray">
                {selectedComplaint.title}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Description:</strong> {selectedComplaint.description}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Status:</strong> {selectedComplaint.status}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Reported At:</strong> {new Date(selectedComplaint.reportedAt).toLocaleString()}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Category:</strong> {selectedComplaint.category}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Village:</strong> {selectedComplaint.village}
              </Typography>
              <Typography color="gray" className="mt-2">
                <strong>Street:</strong> {selectedComplaint.street}
              </Typography>
              {selectedComplaint.imageUrl && (
                <img src={selectedComplaint.imageUrl} alt={selectedComplaint.title} className="mt-4 max-w-60" />
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseModal}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}