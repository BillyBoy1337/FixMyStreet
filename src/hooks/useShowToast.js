import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
  const toast = useToast();

  // useCallback is used to prevent infinite loop, by caching the function
  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title: title,
        description: description,
        status: status,
        duration: 3000,
        isClosable: true,
        // position: "top", // Ensure the toast appears at the top
        containerStyle: {
          zIndex: 9999, // Set a high z-index to ensure it appears on top
        },
		portalProps: {
			containerRef: document.body,
			zIndex: 9999, // Set a high z-index to ensure it appears on top
		  },
      });
    },
    [toast]
  );

  return showToast;
};

export default useShowToast;