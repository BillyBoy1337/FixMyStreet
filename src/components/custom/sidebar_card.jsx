import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { CreateComplaintDialog } from "./CreateComplaintDialog";
import useLogout from "@/hooks/useLogout";

export function SidebarCard({ open, handleOpen, largeScreen }) {
  const { pathname } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { handleLogout, error } = useLogout();
  const navigate = useNavigate();

  const handleDialogOpen = () => setDialogOpen(!dialogOpen);

  return (
    <Card
      color={largeScreen ? "" : "transparent"}
      shadow={largeScreen ? false : true}
      className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5"
    >
      <div className="mb-2 flex items-center gap-4 p-4">
       <a href="/">
       <img
          src="/logo.png"
          alt="brand"
          className="h-14"
        />
       </a>
      </div>
      <List>
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 1 ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray"
               className="mr-auto font-normal">
                Dashboard
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List 
            className="p-0"
             >
              <ListItem 
               onClick={() => navigate('/stats')}
               className={`${pathname === "/stats" ? "bg-gray-200" : ""}`}
               >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Analytics
              </ListItem>
              <ListItem 
              onClick={() => navigate('/reporting')}
              className={`${pathname === "/reporting" ? "bg-gray-200" : ""}`}

              >
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Reporting
              </ListItem>
              {/* <ListItem onClick={() => navigate('/projects')}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Projects
              </ListItem> */}
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
        </Accordion>
        <ListItem 
        onClick={()=> navigate("/")}
        className={`${pathname === "/" ? "bg-gray-200" : ""}`}

        
        >
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Your Complaints
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
      <Button onClick={handleDialogOpen} className="mt-4">
        Create Complaint
      </Button>
      <CreateComplaintDialog open={dialogOpen} handleOpen={handleDialogOpen} />
      <Card className="p-4 shadow-md rounded-lg mt-auto">
        <Typography variant="h6" className="mb-2">
          How to Use
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          - 📌 Submit a new pothole complaint with location details. <br />
          - 📊 Track the status of your submitted complaints. <br />
          - 🔍 Filter complaints by village or category.
        </Typography>
        <div className="mt-4 flex justify-end">
          <Typography
            as="a"
            href="/terms"
            variant="small"
            className="font-medium text-blue-500"
          >
            Terms & Conditions
          </Typography>
        </div>
      </Card>
    </Card>
  );
}