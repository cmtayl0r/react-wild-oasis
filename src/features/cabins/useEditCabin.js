import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditCabin() {
  // React Query hook to get access to the query client
  const queryClient = useQueryClient();

  // useMutation hook to edit a cabin
  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    // We need to pass the id of the cabin we are editing
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin edited successfully"); // This will show a success message
      queryClient.invalidateQueries(["cabins"]); // This will refetch the data
    },
    onError: (error) => {
      console.error("Error editing cabin", error.message);
      toast.error("Error editing cabin");
    },
  });

  // Return the function and a boolean to indicate if we are editing a cabin
  return { editCabin, isEditing };
}
