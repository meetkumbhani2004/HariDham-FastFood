// import { render, screen, fireEvent } from '@testing-library/react';
// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import CartPage from './CartPage';
// import { BrowserRouter } from 'react-router-dom';
// import {CartContext} from './CartContext';
// import '@testing-library/jest-dom';

// // Helper function to wrap with router and context
// const mockCartItem = {
//   id: 1,
//   name: 'Cheese Pizza',
//   price: 200,
//   quantity: 2,
//   image: 'cheese-pizza.jpg',
// };

// const mockContextValue = {
//   cartItems: [mockCartItem],
//   increaseQuantity: vi.fn(),
//   decreaseQuantity: vi.fn(),
//   removeItem: vi.fn(),
// };

// const renderWithProvider = () =>
//   render(
//     <CartContext.Provider value={mockContextValue}>
//       <BrowserRouter>
//         <CartPage />
//       </BrowserRouter>
//     </CartContext.Provider>
//   );

// describe('CartPage Component', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('renders title and subtext', () => {
//     renderWithProvider();
//     expect(screen.getByText(/your shopping cart/i)).toBeInTheDocument();
//     expect(screen.getByText(/home • your shopping cart/i)).toBeInTheDocument();
//   });

//   it('renders cart item row correctly', () => {
//     renderWithProvider();
//     expect(screen.getByText(/cheese pizza/i)).toBeInTheDocument();
//     expect(screen.getByText('₹200')).toBeInTheDocument();
//     expect(screen.getByText('2')).toBeInTheDocument(); // quantity
//   });

//   it('calls increaseQuantity when + is clicked', () => {
//     renderWithProvider();
//     const plusButton = screen.getByText('+');
//     fireEvent.click(plusButton);
//     expect(mockContextValue.increaseQuantity).toHaveBeenCalledWith(1);
//   });

//   it('calls decreaseQuantity when - is clicked', () => {
//     renderWithProvider();
//     const minusButton = screen.getByText('-');
//     fireEvent.click(minusButton);
//     expect(mockContextValue.decreaseQuantity).toHaveBeenCalledWith(1);
//   });

//   it('calls removeItem when 🗑️ is clicked', () => {
//     renderWithProvider();
//     const deleteButton = screen.getByText('🗑️');
//     fireEvent.click(deleteButton);
//     expect(mockContextValue.removeItem).toHaveBeenCalledWith(1);
//   });

//   it('displays correct total price', () => {
//     renderWithProvider();
//     expect(screen.getByText(/total:\s*₹400/i)).toBeInTheDocument();
//   });

//   it('renders refund note', () => {
//     renderWithProvider();
//     expect(screen.getByText(/order cancle to 50% refundable/i)).toBeInTheDocument();
//   });

//   it('renders CheckoutPage inside', () => {
//     renderWithProvider();
//     expect(screen.getByText(/checkout/i)).toBeInTheDocument(); // You should ensure CheckoutPage has this word
//   });
// });
