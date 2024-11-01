import supabase from "./supabase";

// 01 - GET ALL CABINS

export async function getCabins() {
  // select means we want to get all the data`
  let { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("Error fetching cabins", error.message);
    throw new Error(error.message);
  }

  return cabins;
}

// 02 - DELETE A CABIN

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error("Error deleting cabin", error.message);
    throw new Error(error.message);
  }

  return data;
}
