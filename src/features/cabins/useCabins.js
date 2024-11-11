import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

// This function is a custom hook that fetches the cabins from the API using the useQuery hook from React Query.
// It returns the loading state, the cabins data, and any error that might occur during the fetch.
// The useQuery hook takes an object as an argument with the queryKey and queryFn properties.
// The queryKey is an array with a string identifier for the query, in this case, "cabins".
// The queryFn is the function that fetches the data, in this case, the getCabins function from the apiCabins service.
// The useQuery hook returns an object with isLoading, data, and error properties

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, cabins, error };
}
