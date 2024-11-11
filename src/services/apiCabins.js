import supabase, { supabaseUrl } from "./supabase";

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

// 03 - CREATE and EDIT A CABIN

export async function createEditCabin(newCabin, id) {
  // A. Check if the image is empty
  // Check if the image path is already a supabase URL
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // B. If the image is empty, we generate a random name for the image
  // This is to avoid conflicts when uploading images
  const imageName = `${Math.random().toString(36).substring(2)}-${
    newCabin.image.name
  }`.replaceAll("/", "");

  // C. If image path is already a supabase URL, we don't need to upload it
  // Used when we duplicate a cabin
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // D. Create/edit Cabin
  let query = supabase.from("cabins");
  // D1 CREATE
  // id prop determines if we are creating or editing a cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  // D2) EDIT
  // If we are editing, we need to update the cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error("Error creating cabin", error.message);
    throw new Error(error.message);
  }

  // E. Upload the image if it's not already uploaded
  if (hasImagePath) return data; // If the image is already uploaded, we don't need to upload it
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // F. If there is an error uploading the image, we delete the cabin
  if (storageError) {
    console.error("Error uploading image", storageError.message);
    await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error(storageError.message);
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
