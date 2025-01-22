// components/admin/MerchManager.js
import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import MerchForm from "./MerchForm";
import { merchService } from "../../utils/merchService";

const ManagerContainer = styled.div``;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductImageThumb = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 4px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProductPrice = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Price = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const OriginalPrice = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  font-size: 0.9em;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ type, theme }) =>
    type === "stock"
      ? `${theme.colors.success}33`
      : `${theme.colors.accent}33`};
  color: ${({ type, theme }) =>
    type === "stock" ? theme.colors.success : theme.colors.accent};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  background: ${({ variant, theme }) =>
    variant === "delete"
      ? "#ff4444"
      : variant === "edit"
      ? theme.colors.primary
      : theme.colors.surface};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

function MerchManager() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await merchService.getAllMerch();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const formattedData = {
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await merchService.addMerch(formattedData);
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || "Failed to create product");
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      const formattedData = {
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      await merchService.updateMerch(selectedProduct.id, formattedData);
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await merchService.deleteMerch(productId);
      await fetchProducts();
      setIsDeleting(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleting(true);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <ManagerContainer>
      <div style={{ marginBottom: "20px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add New Product
        </Button>
      </div>

      <ProductList>
        {products.map((product) => (
          <ProductItem key={product.id}>
            <ProductImageThumb src={product.image} alt={product.title} />
            <ProductInfo>
              <ProductTitle>
                {product.title}
                {product.badge && <Badge type="badge">{product.badge}</Badge>}
                <Badge type="stock">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </ProductTitle>

              <ProductPrice>
                <Price>${product.price}</Price>
                {product.originalPrice && (
                  <OriginalPrice>${product.originalPrice}</OriginalPrice>
                )}
              </ProductPrice>

              <div
                style={{
                  fontSize: "0.9rem",
                  color: theme.colors.textSecondary,
                }}
              >
                {product.description}
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: theme.colors.textMuted,
                  marginTop: "4px",
                }}
              >
                Sizes: {product.sizes.join(", ")}
              </div>
            </ProductInfo>

            <ActionButtons>
              <ActionButton
                variant="edit"
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </ActionButton>
              <ActionButton
                variant="delete"
                onClick={() => confirmDelete(product)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </ActionButton>
            </ActionButtons>
          </ProductItem>
        ))}
        {products.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No products found. Create your first product!
          </p>
        )}
      </ProductList>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h2 style={{ marginBottom: "20px" }}>
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <MerchForm
                item={selectedProduct}
                onSubmit={
                  selectedProduct ? handleUpdateProduct : handleCreateProduct
                }
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
              />
            </ModalContent>
          </Modal>
        )}

        {isDeleting && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h2>Confirm Delete</h2>
              <p style={{ margin: "20px 0" }}>
                Are you sure you want to delete "{selectedProduct.title}"?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  onClick={() => handleDeleteProduct(selectedProduct.id)}
                  style={{ background: "#ff4444" }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setIsDeleting(false);
                    setSelectedProduct(null);
                  }}
                  style={{ background: "#666" }}
                >
                  Cancel
                </Button>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </ManagerContainer>
  );
}

export default MerchManager;
