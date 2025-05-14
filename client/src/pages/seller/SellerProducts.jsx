import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {   fetchSellerProducts} from "../../features/products/productSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const SellerProducts = ({ sellerId  }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);


  useEffect(() => {
    if (sellerId) dispatch(fetchSellerProducts(sellerId));
  }, [dispatch, sellerId]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop
              autoPlay
              interval={3000}
              className="w-full max-w-md mx-auto rounded-lg shadow"
            >
              {product.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    className="h-64 object-cover rounded"
                  />
                </div>
              ))}
            </Carousel>

            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-sm text-gray-500">{product.description}</p>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;
