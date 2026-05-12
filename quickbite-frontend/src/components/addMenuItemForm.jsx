// AddMenuItemForm.jsx

import React, {
  useState,
  useEffect,
} from "react";

import "../styles/AddMenuItemForm.css";

const AddMenuItemForm = ({
  restaurantId,
  editItem,
  onMenuItemAdded,
  onCancel,
}) => {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     EDIT PREFILL
  ========================================= */

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || "");

      setDescription(
        editItem.description || ""
      );

      setPrice(editItem.price || "");

      setImage(editItem.image || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
    }
  }, [editItem]);

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert(
        "Please enter name and price"
      );

      return;
    }

    try {
      setLoading(true);

      await onMenuItemAdded({
        restaurantId,

        name,

        description,

        price: parseFloat(price),

        image,
      });

      if (!editItem) {
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-menu-item-form"
    >
      <h3>
        {editItem
          ? "Edit Menu Item"
          : "Add Menu Item"}
      </h3>

      {/* NAME */}

      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        required
      />

      {/* DESCRIPTION */}

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      {/* PRICE */}

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        required
      />

      {/* IMAGE */}

      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) =>
          setImage(e.target.value)
        }
      />

      {/* BUTTONS */}

      <div className="form-buttons">

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : editItem
            ? "Update Item"
            : "Add Item"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddMenuItemForm;
