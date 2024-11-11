import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { createEditCabin } from "../../services/apiCabins";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

const Label = styled.label`
  font-weight: 500;
`;

function CreateCabinForm({ cabinToEdit = {} }) {
  // We need to extract the id from the cabinToEdit object
  // And then we can use the rest operator to get the rest of the values
  const { id: editId, ...editValues } = cabinToEdit;
  // Determine if we are editing a cabin
  const isEditSession = Boolean(editId);

  // Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isEditSession ? editValues : {}, // If we are editing a cabin, we need to pass the default values
  });

  // Custom hook to create a cabin
  const { isCreating, createCabin } = useCreateCabin();

  // Custom hook to edit a cabin
  const { isEditing, editCabin } = useEditCabin();

  // This is a ternary operator that will determine which mutation to use
  const isWorking = isCreating || isEditing;

  // This function will be called when the form is submitted
  function onSubmit(data) {
    // Check if the image is a string or an array
    // If it's an array, we need to get the first element
    // If it's a string, we can use it as is
    const image = typeof data.image === "string" ? data.image : data.image[0];

    // If we are editing a cabin, we need to call the edit mutation
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          // You you can use onSuccess here and in the useEditCabin hook
          // This will reset the form after the cabin is edited
          onSuccess: (data) => reset(),
        }
      );
    // else we need to call the create mutation
    else
      createCabin(
        { ...data, image: image },
        {
          // You you can use onSuccess here and in the useCreateCabin hook
          // This will reset the form after the cabin is created
          onSuccess: (data) => reset(),
        }
      );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* <FormRow>
        <Label htmlFor="name">Cabin name</Label>

        {errors?.name?.message && <Error>{errors.name.message}</Error>}
      </FormRow> */}

      <FormRow label={"Cabin name"} error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
          disabled={isWorking}
          style={
            errors.name ? { border: "3px solid var(--color-red-700)" } : {}
          }
        />
      </FormRow>

      <FormRow label={"Maximum capacity"} error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            max: {
              value: 20,
              message: "The maximum capacity is 20 people",
            },
          })}
          disabled={isWorking}
          style={
            errors.maxCapacity
              ? { border: "3px solid var(--color-red-700)" }
              : {}
          }
        />
      </FormRow>

      {/* ------------------------------------------------------------------- */}

      <FormRow label={"Regular price"} error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
          })}
          disabled={isWorking}
          style={
            errors.regularPrice
              ? { border: "3px solid var(--color-red-700)" }
              : {}
          }
        />
      </FormRow>

      <FormRow label={"Discount"} error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
          })}
          disabled={isWorking}
          style={
            errors.discount ? { border: "3px solid var(--color-red-700)" } : {}
          }
        />
      </FormRow>

      <FormRow
        label={"Description for website"}
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
          disabled={isWorking}
          style={
            errors.description
              ? { border: "3px solid var(--color-red-700)" }
              : {}
          }
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          disabled={isWorking}
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Cabin" : "Create new Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
