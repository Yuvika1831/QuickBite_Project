// VendorDashboard.jsx

import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import { UserContext } from "../context/UserContext";

import AddRestaurantForm from "../components/AddRestaurantForm";
import AddMenuItemForm from "../components/AddMenuItemForm";
import MenuItemCard from "../components/MenuItemCard";

import api from "../api/api";

import "../styles/Vendor.css";
import "../styles/MenuItemCard.css";

const VendorDashboard = () => {
  const { user, loading } =
    useContext(UserContext);

  const [restaurant, setRestaurant] =
    useState(null);

  const [fetching, setFetching] =
    useState(true);

  const [addingMenuItem, setAddingMenuItem] =
    useState(false);

  const [editingMenuItem, setEditingMenuItem] =
    useState(null);

  /* =========================================
     FETCH RESTAURANT
  ========================================= */

  useEffect(() => {
    if (!user) return;

    const fetchRestaurant = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const vendorId =
          user.id || user._id;

        const res = await api.get(
          `/vendor/dashboard?vendorId=${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          res.data.restaurants?.length > 0
        ) {
          const rest =
            res.data.restaurants[0];

          setRestaurant({
            ...rest,
            menuItems:
              rest.menuItems || [],
          });
        } else {
          setRestaurant(null);
        }
      } catch (err) {
        console.error(
          "Error fetching restaurant:",
          err
        );

        setRestaurant(null);
      } finally {
        setFetching(false);
      }
    };

    fetchRestaurant();
  }, [user]);

  /* =========================================
     ADD RESTAURANT
  ========================================= */

  const handleAddRestaurant = async (
    data
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const vendorId =
        user.id || user._id;

      const res = await api.post(
        "/vendor/restaurant",
        {
          ...data,
          ownerId: vendorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.restaurant) {
        setRestaurant({
          ...res.data.restaurant,
          menuItems: [],
        });

        alert(
          "Restaurant added successfully 🍕"
        );
      }
    } catch (err) {
      console.error(err);

      alert("Failed to add restaurant");
    }
  };

  /* =========================================
     ADD / EDIT MENU ITEM
  ========================================= */

  const handleMenuItemSubmit =
    async (itemData) => {
      try {
        const token =
          localStorage.getItem("token");

        const isEditing =
          !!editingMenuItem;

        const menuItemId =
          editingMenuItem?.id ||
          editingMenuItem?._id;

        const method = isEditing
          ? "put"
          : "post";

        const url = isEditing
          ? `/vendor/menu/${menuItemId}`
          : `/vendor/menu`;

        const body = {
          ...itemData,
          restaurantId:
            restaurant.id ||
            restaurant._id,
        };

        const res = await api[method](
          url,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const savedItem =
          res.data.menuItem ||
          res.data.updated;

        if (isEditing) {
          setRestaurant((prev) => ({
            ...prev,

            menuItems:
              prev.menuItems.map((i) =>
                (i.id || i._id) ===
                menuItemId
                  ? savedItem
                  : i
              ),
          }));

          setEditingMenuItem(null);
        } else {
          setRestaurant((prev) => {
            const exists =
              prev.menuItems.some(
                (i) =>
                  (i.id || i._id) ===
                  (savedItem.id ||
                    savedItem._id)
              );

            if (exists) return prev;

            return {
              ...prev,

              menuItems: [
                ...prev.menuItems,
                savedItem,
              ],
            };
          });
        }

        setAddingMenuItem(false);

        alert(
          isEditing
            ? "Menu item updated!"
            : "Menu item added!"
        );
      } catch (err) {
        console.error(err);

        alert(
          "Failed to save menu item"
        );
      }
    };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (menuItem) => {
    setEditingMenuItem(menuItem);

    setAddingMenuItem(true);

    window.scrollTo({
      top: 350,
      behavior: "smooth",
    });
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async (
    menuItemId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this item?"
      );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/vendor/menu/${menuItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurant((prev) => ({
        ...prev,

        menuItems:
          prev.menuItems.filter(
            (i) =>
              (i.id || i._id) !==
              menuItemId
          ),
      }));

      alert("Menu item deleted");
    } catch (err) {
      console.error(err);

      alert("Delete failed");
    }
  };

  /* =========================================
     AUTH
  ========================================= */

  if (!user) {
    return (
      <div className="vendor-message">
        Please login as vendor
      </div>
    );
  }

  if (
    user.role?.toUpperCase() !==
    "VENDOR"
  ) {
    return (
      <div className="vendor-message">
        Access denied
      </div>
    );
  }

  if (loading || fetching) {
    return (
      <div className="vendor-loader">
        <div className="loader-circle"></div>

        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">

      {/* HEADING */}

      <div className="vendor-heading-wrapper">
        <h1>Owner Dashboard</h1>

        <p>
          Manage your restaurant &
          menu 🚀
        </p>
      </div>

      {/* NO RESTAURANT */}

      {!restaurant && (
        <div className="empty-restaurant-box">
          <h2>
            Create Your Restaurant
          </h2>

          <p>
            Add your restaurant to
            start selling food.
          </p>

          <AddRestaurantForm
            onRestaurantAdded={
              handleAddRestaurant
            }
          />
        </div>
      )}

      {/* RESTAURANT */}

      {restaurant && (
        <>
          <div className="restaurant-info">

            {restaurant.image && (
              <img
                src={restaurant.image}
                alt={restaurant.name}
              />
            )}

            <h2>{restaurant.name}</h2>

            <p className="category">
              {restaurant.category}
            </p>

            <div className="checkout-time">
              ⏱ Checkout Time :
              <span>
                {" "}
                {restaurant.checkoutTime ||
                  "N/A"}{" "}
                mins
              </span>
            </div>

            {!addingMenuItem && (
              <button
                className="add-more-btn"
                onClick={() => {
                  setEditingMenuItem(
                    null
                  );

                  setAddingMenuItem(
                    true
                  );

                  window.scrollTo({
                    top: 350,
                    behavior:
                      "smooth",
                  });
                }}
              >
                + Add Menu Item
              </button>
            )}
          </div>

          {/* FORM SECTION */}

          {addingMenuItem && (
            <div className="menu-form-section">
              <AddMenuItemForm
                restaurantId={
                  restaurant.id ||
                  restaurant._id
                }
                editItem={
                  editingMenuItem
                }
                onMenuItemAdded={
                  handleMenuItemSubmit
                }
                onCancel={() => {
                  setAddingMenuItem(
                    false
                  );

                  setEditingMenuItem(
                    null
                  );
                }}
              />
            </div>
          )}

          {/* MENU SECTION */}

          <div className="menu-section">
            <h2 className="menu-heading">
              Your Menu
            </h2>

            <div className="menu-items-grid">
              {Array.isArray(
                restaurant.menuItems
              ) &&
              restaurant.menuItems
                .length > 0 ? (
                restaurant.menuItems.map(
                  (item) => (
                    <MenuItemCard
                      key={
                        item.id ||
                        item._id
                      }
                      menuItem={item}
                      isUserView={false}
                      onEdit={() =>
                        handleEdit(item)
                      }
                      onDelete={() =>
                        handleDelete(
                          item.id ||
                            item._id
                        )
                      }
                    />
                  )
                )
              ) : (
                <div className="empty-menu">
                  <h3>
                    No menu items yet 🍽
                  </h3>

                  <p>
                    Add your first
                    delicious item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;