// pages/Merch/Merch.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { useTheme } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { merchService } from "../../utils/merchService";
import { userService } from "../../utils/userService";
import { useInView } from "react-intersection-observer";
import { Helmet } from "react-helmet-async";

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
`;

const LazyImage = ({ src, alt, onClick, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "100px",
  });

  return (
    <div ref={ref} style={{ height: "100%", width: "100%" }} onClick={onClick}>
      {inView && (
        <>
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              transform: `scale(${isLoaded ? 1.0 : 1.1})`,
            }}
            {...props}
          />
          {!isLoaded && <LoadingPlaceholder />}
        </>
      )}
      {!inView && <LoadingPlaceholder />}
    </div>
  );
};

const LoadingPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h3`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.2rem;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 15px;
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin: 20px auto;
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

const ComingSoonOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
`;

const ComingSoonCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: 20px;
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchedRef = useRef(new Set());
  const ITEMS_PER_PAGE = 12;

  const fetchProducts = useCallback(async (pageNum) => {
    if (fetchedRef.current.has(pageNum)) {
      return;
    }

    try {
      setIsLoading(true);
      const newProducts = await merchService.getAllMerch(
        pageNum,
        ITEMS_PER_PAGE
      );

      setProducts((prevProducts) => {
        const newProductIds = new Set(newProducts.map((product) => product.id));
        const filteredPrevProducts = prevProducts.filter(
          (product) => !newProductIds.has(product.id)
        );
        return [...filteredPrevProducts, ...newProducts];
      });

      setHasMore(newProducts.length === ITEMS_PER_PAGE);
      fetchedRef.current.add(pageNum);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (loadMoreInView && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  }, [loadMoreInView, hasMore, isLoading, page]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    });
  };

  const handleAddToCart = useCallback(
    async (product) => {
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
    },
    [currentUser, selectedSizes, navigate]
  );

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
    <>
      <Helmet>
        <title>Rocky Mountain Rambler 500 | Merchandise</title>
        <meta
          name="description"
          content="Shop official Rocky Mountain Rambler 500 merchandise. Show your support with our collection of apparel, accessories, and memorabilia from the ultimate beater car event."
        />
        <meta
          property="og:title"
          content="Rocky Mountain Rambler 500 | Merchandise"
        />
        <meta
          property="og:description"
          content="Shop official Rocky Mountain Rambler 500 merchandise. Show your support with our collection of apparel, accessories, and memorabilia from the ultimate beater car event."
        />
        <meta
          property="og:url"
          content="https://rockymountainrambler500.com/merch"
        />
        <meta
          property="twitter:title"
          content="Rocky Mountain Rambler 500 | Merchandise"
        />
        <meta
          property="twitter:description"
          content="Shop official Rocky Mountain Rambler 500 merchandise. Show your support with our collection of apparel, accessories, and memorabilia from the ultimate beater car event."
        />
      </Helmet>
      <MerchContainer>
        <PageHeader>
          <h1 style={{ marginBottom: "20px" }}>Rambler Merchandise</h1>
          <p style={{ color: "#B0B0B0" }}>
            Rep your favorite $3K racing series with our official merchandise.
            All products feature premium materials and original designs.
          </p>
        </PageHeader>

        <ProductGrid>
          <AnimatePresence>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductImage>
                  {product.badge && (
                    <ProductBadge>{product.badge}</ProductBadge>
                  )}
                  <LazyImage
                    src={product.image}
                    alt={product.title}
                    onClick={() => handleAddToCart(product)}
                  />
                </ProductImage>
                <ProductInfo>
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
                    onChange={(e) =>
                      handleSizeChange(product.id, e.target.value)
                    }
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
                </ProductInfo>
              </ProductCard>
            ))}
          </AnimatePresence>
        </ProductGrid>

        <div ref={loadMoreRef}>
          {isLoading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        <ComingSoonOverlay>
          <ComingSoonCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2>Coming Soon</h2>
            <p>
              Our merchandise store is currently under construction. Get ready
              to rep your favorite $3K racing series with our official gear.
              Sign up for our newsletter to be notified when we launch!
            </p>
            <AddToCartButton
              as="a"
              href="mailto:rockymountainrambler500@gmail.com"
              style={{ display: "inline-block", textDecoration: "none" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Notified
            </AddToCartButton>
          </ComingSoonCard>
        </ComingSoonOverlay>
      </MerchContainer>
    </>
  );
}

export default Merch;
