import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  // React Query hook to get access to the query client
  const queryClient = useQueryClient();

  // useMutation hook to create a cabin
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("Cabin created successfully"); // This will show a success message
      queryClient.invalidateQueries(["cabins"]); // This will refetch the data
    },
    onError: (error) => {
      console.error("Error creating cabin", error.message);
      toast.error("Error creating cabin");
    },
  });

  // Return the function and a boolean to indicate if we are creating a cabin
  return { createCabin, isCreating };
}
