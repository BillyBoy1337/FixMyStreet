import { SidebarWithLogo } from "@/components/custom/sidebar";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";

// instead of adding the Sidebar component to every page, we can add it only once to the PageLayout component and wrap the children with it. This way, we can have a sidebar on every page except the AuthPage.

const PageLayout = ({ children }) => {
    const { pathname } = useLocation();
    // const [user, loading] = useAuthState(auth);
    const loading = false;
    const user = localStorage.getItem("user");
    const canRenderSidebar =( pathname === "/" ||  pathname === "/stats" || pathname === "/reporting") && user;
    const canRenderNavbar = false
    // const canRenderNavbar = (pathname === "/" || pathname === "/stats") && user;

    // const checkingUserIsAuth = !user && loading;
    // if (checkingUserIsAuth) return <PageLayoutSpinner />;

    return (
        <Flex className="bg-white/90 h-screen">
        {/* <Flex className="bg-white/90 h-screen overflow-hidden"> */}
            {/* sidebar on the left */}
            {canRenderSidebar ? (
                <Box className="fixed mt-4 w-8 md:w-72 z-50">
                    <SidebarWithLogo />
                </Box>
            ) : null}
            {/* Navbar */}
            {canRenderNavbar ? <div>Navbar</div> : null}
            {/* the page content on the right */}
            <Box className={`flex-1 h-full  items-center overflow-y-auto p-4 scroll-smooth mt-20 md:mt-12 ${canRenderSidebar ? "ml-4 md:ml-72" : ""}`}>
                {children || <Outlet />}
            </Box>
        </Flex>
    );
};

export default PageLayout;

const PageLayoutSpinner = () => {
    return (
        <Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
            <Spinner size='xl' />
        </Flex>
    );
};