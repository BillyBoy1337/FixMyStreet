import React from "react";
import {
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SidebarCard } from "./sidebar_card";
import useLogout from "@/hooks/useLogout";

export function SidebarWithLogo() {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Show the button only on mobile screens */}
      <div className="block md:hidden z-50">
        <IconButton variant="text" size="lg" onClick={openDrawer}>
          {isDrawerOpen ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
          )}
        </IconButton>
      </div>
      <div className="hidden md:block">
        <SidebarCard open={open} handleOpen={handleOpen} openAlert={openAlert} largeScreen={true} />
      </div>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <SidebarCard open={open} handleOpen={handleOpen} openAlert={openAlert} largeScreen={false} />
      </Drawer>
    </>
  );
}