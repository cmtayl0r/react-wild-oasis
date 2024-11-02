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

// 03 - CREATE A CABIN

export async function createCabin(newCabin) {
  const { data, error } = await supabase.from("cabins").insert([newCabin]);

  // const { data, error } = await supabase;
  //   .from("cabins")
  //   .insert([{ some_column: "someValue", other_column: "otherValue" }])
  //   .select();

  if (error) {
    console.error("Error creating cabin", error.message);
    throw new Error(error.message);
  }

  return data;
}

// 04 - UPDATE A CABIN
export async function updateCabin(updatedCabin) {
  const { data, error } = await supabase
    .from("cabins")
    .update(updatedCabin)
    .eq("id", updatedCabin.id);

  if (error) {
    console.error("Error updating cabin", error.message);
    throw new Error(error.message);
  }

  return data;
}
