import supabase from "./supabase";

export async function getCabins() {
  // select means we want to get all the data`
  let { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("Error fetching cabins", error.message);
    throw new Error(error.message);
  }

  return cabins;
}
