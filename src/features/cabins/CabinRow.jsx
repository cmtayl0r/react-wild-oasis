import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeleteCabin";
import { Copy, FilePenLine, Trash2 } from "lucide-react";
import { useCreateCabin } from "./useCreateCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  // Custom hook to delete a cabin
  const { isDeleting, deleteCabin } = useDeleteCabin();
  // Custom hook to create a cabin
  const { isCreating, createCabin } = useCreateCabin();

  // // Handle the duplication of a cabin
  // function handleDuplicateCabin() {

  //   createCabin({
  //     name: `${cabin.name} (Copy)`,
  //     maxCapacity: cabin.maxCapacity,
  //     regularPrice: cabin.regularPrice,
  //     discount: cabin.discount,
  //     image: cabin.image,
  //   });
  // }

  // const {
  //   id: cabinId,
  //   name,
  //   maxCapacity,
  //   regularPrice,
  //   discount,
  //   image,
  // } = cabin;

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  function handleDuplicate() {
    // Duplicate the cabin by creating a new one with the same values
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  return (
    <Table.Row>
      <Img src={image} alt={name} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity}</div>
      <Price>{formatCurrency(regularPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}%</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            {/* The three dots button */}
            <Menus.Toggle id={cabinId} />
            {/* The dropdown menu */}
            {/* Shared id between the toggle and the list so know which list to open */}
            <Menus.List id={cabinId}>
              {/* Menu buttons go here */}
              {/* Regular menu button */}
              <Menus.Button
                icon={<Copy />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>
              {/* Menu button that opens a modal */}
              <Modal.Open opens="edit">
                <Menus.Button icon={<FilePenLine />}>Edit</Menus.Button>
              </Modal.Open>
              {/* Menu button that opens a modal */}
              <Modal.Open opens="delete">
                <Menus.Button icon={<Trash2 />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
            <Modal.Overlay name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Overlay>
            <Modal.Overlay name="delete">
              <ConfirmDelete
                resourceName="cabins"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Overlay>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CabinRow;
