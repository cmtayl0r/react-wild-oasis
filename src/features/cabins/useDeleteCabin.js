import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

// This is the function that will be called when we want to delete a cabin
export function useDeleteCabin() {
  // queryClient is a hook that gives us access to the query client
  // This is defined in src/App.jsx
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Cabin deleted successfully");
      // When mutation is successful, invalidate the cache
      queryClient.invalidateQueries(["cabins"]); // This will refetch the data
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isDeleting, deleteCabin };
}
