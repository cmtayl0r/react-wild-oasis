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

// 03 - CREATE A CABIN

export async function createCabin(newCabin) {
  // Generate a random image name
  // This is to avoid conflicts when uploading images
  const imageName = `${Math.random().toString(36).substring(2)}-${
    newCabin.image.name
  }`.replaceAll("/", "");
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create Cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }]);

  if (error) {
    console.error("Error creating cabin", error.message);
    throw new Error(error.message);
  }

  // 2. Upload image
  // https://pgyrwbpvbvtmppfjykfp.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if the image upload fails
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
