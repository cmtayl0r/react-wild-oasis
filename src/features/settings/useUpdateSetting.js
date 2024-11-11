import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

export function useUpdateSetting() {
  // React Query hook to get access to the query client
  const queryClient = useQueryClient();

  // useMutation hook to edit a cabin
  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    // We need to pass the id of the cabin we are editing
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Setting edited successfully"); // This will show a success message
      queryClient.invalidateQueries(["settings"]); // This will refetch the data
    },
    onError: (error) => {
      console.error("Error editing settings", error.message);
      toast.error("Error editing settings");
    },
  });

  // Return the function and a boolean to indicate if we are editing a cabin
  return { updateSetting, isUpdating };
}
