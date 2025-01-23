// pages/Merch/Merch.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { useTheme } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { merchService } from "../../utils/merchService";
import { userService } from "../../utils/userService";

const MerchContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 100px 20px 60px;
`;

const PageHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const ProductImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  z-index: 1;
`;

const ProductContent = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .price {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  .original-price {
    text-decoration: line-through;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-right: 8px;
  }
`;

const SizeSelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

function Merch() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [products, setProducts] = useState([]);
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

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    });
  };

  const handleAddToCart = async (product) => {
    const size = selectedSizes[product.id];

    if (!currentUser) {
      // Redirect to login with return state
      navigate("/login", {
        state: {
          returnTo: "/merch",
          action: "addToCart",
          productId: product.id,
          size: size,
          quantity: 1,
        },
      });
      return;
    }

    try {
      // Add to cart in Firestore
      await userService.addToCart(currentUser.uid, {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: size,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });

      alert("Successfully added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No products available.
      </div>
    );
  }

  return (
    <MerchContainer>
      <PageHeader>
        <h1 style={{ marginBottom: "20px" }}>Rambler Merchandise</h1>
        <p style={{ color: "#B0B0B0" }}>
          Rep your favorite $3K racing series with our official merchandise. All
          products feature premium materials and original designs.
        </p>
      </PageHeader>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductImage>
              {product.badge && <ProductBadge>{product.badge}</ProductBadge>}
              <img src={product.image} alt={product.title} />
            </ProductImage>
            <ProductContent>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductDescription>{product.description}</ProductDescription>
              <ProductPrice>
                <span>
                  {product.originalPrice && (
                    <span className="original-price">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="price">${product.price}</span>
                </span>
                {!product.inStock && (
                  <span style={{ color: theme.colors.textMuted }}>
                    Out of Stock
                  </span>
                )}
              </ProductPrice>

              <SizeSelect
                value={selectedSizes[product.id] || ""}
                onChange={(e) => handleSizeChange(product.id, e.target.value)}
                disabled={!product.inStock}
              >
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </SizeSelect>

              <AddToCartButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!product.inStock || !selectedSizes[product.id]}
                onClick={() => handleAddToCart(product)}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </AddToCartButton>
            </ProductContent>
          </ProductCard>
        ))}
      </ProductGrid>
    </MerchContainer>
  );
}

export default Merch;
