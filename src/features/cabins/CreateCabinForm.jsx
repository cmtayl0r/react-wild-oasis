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

  // This is the hook that will help us refetch the data
  const queryClient = useQueryClient();

  // CREATE MUTATION
  // This is the hook that will help us send the data to the server
  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("Cabin created successfully"); // This will show a success message
      queryClient.invalidateQueries(["cabins"]); // This will refetch the data
      reset(); // This will reset the form
    },
    onError: (error) => {
      console.error("Error creating cabin", error.message);
      toast.error("Error creating cabin");
    },
  });

  // EDIT MUTATION
  // This is the hook that will help us send the data to the server
  const { mutate: editMutate, isLoading: isEditing } = useMutation({
    // We need to pass the id of the cabin we are editing
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin edited successfully"); // This will show a success message
      queryClient.invalidateQueries(["cabins"]); // This will refetch the data
      reset(); // This will reset the form
    },
    onError: (error) => {
      console.error("Error editing cabin", error.message);
      toast.error("Error editing cabin");
    },
  });

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
      editMutate({ newCabinData: { ...data, image }, id: editId });
    // else we need to call the create mutation
    else createMutate({ ...data, image: image });
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
