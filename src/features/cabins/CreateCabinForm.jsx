import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";

const Label = styled.label`
  font-weight: 500;
`;

function CreateCabinForm() {
  // This is the hook that will help us handle the form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  // This is the hook that will help us refetch the data
  const queryClient = useQueryClient();
  // This is the hook that will help us send the data to the server
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
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
  // This function will be called when the form is submitted
  function onSubmit(data) {
    mutate(data); // This will send the data to the server
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
          {...register("image")}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
