import React, { useState } from 'react';
import { IProduct } from '@/models/Products';
import { useSession } from 'next-auth/react';
import useDBOrderStore from "@/store/dbOrders";
import { OrderItem } from "@/models/Orders";


const ProductCard: React.FC < {product: IProduct}  > = ( {product} ) => {

  const addItemsToOrder = (items: OrderItem[], totalAmount: number) => {
      const setItems = useDBOrderStore((state) => state.setItems);
      setItems(items, totalAmount);
  };
  
  const {data : session} = useSession ();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    setIsPanelOpen(true); // Open the size selection panel
  };

  const handleConfirmSize = async() => {
    if (!size) {
      alert('Please select a size before proceeding.');
      return;
    }
    setIsPanelOpen(false); // Close the size selection panel

    // console.log(session?.user?.id);
    
    // Add the product to the cart
    const response = await fetch(`/api/addCartItems`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: session?.user?.id, image: product.images[0], productId: product._id, name: product.title, price: (product.discountedPrice?product.discountedPrice:product.price)*quantity, quantity, size }),
    })
    
    if (!response.ok) {
        throw new Error('Failed to add product to cart');
    }
    else{
        console.log('Product added to cart successfully');
        alert(`Added ${quantity} ${product.title}(s) of size ${size} to cart!`);
    }
  };

  return (
    <div className="product-card border rounded-lg p-4 shadow-md max-w-sm relative">
      {/* Product Image */}
      <div className="image-container">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>

      {/* Product Name */}
      <h2 className="product-name text-lg font-semibold mt-4">{product.title}</h2>

      {/* Product Price */}
      <div className="product-price mt-2">
        {product.discountedPrice ? (
          <>
            <span className="line-through text-gray-500 mr-2">${product.price}</span>
            <span className="text-green-600 font-bold">${product.discountedPrice}</span>
          </>
        ) : (
          <span className="text-gray-800 font-bold">${product.price}</span>
        )}
      </div>

     
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="add-to-cart-btn mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>

      {/* Sliding Side Panel */}
      {isPanelOpen && session && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Select Size</h3>
            <div className="size-options mb-4">
              {product.sizes.map((availableSize) => (
                <button
                  key={availableSize.size}
                  onClick={() => setSize(availableSize.size)}
                  className={`px-4 py-2 border rounded-md mr-2 ${
                    size === availableSize.size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {availableSize.size}
                </button>
              ))}
            </div>

            {/* Quantity Controls */}
            <div className="quantity-controls flex items-center mt-4">
                <button
                onClick={handleDecrease}
                className="px-2 py-1 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                >
                -
                </button>
                <span className="px-4 py-1 border-t border-b">{quantity}</span>
                <button
                onClick={handleIncrease}
                className="px-2 py-1 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                >
                +
                </button>
            </div>

            <button
              onClick={handleConfirmSize}
              className="confirm-btn w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Confirm
            </button>

            <button
              onClick={() => setIsPanelOpen(false)}
              className="cancel-btn w-full bg-red-600 text-white py-2 rounded-md mt-4 hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
