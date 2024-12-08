import { Product } from '../types/Product';

export const ProductService = {
  getProducts(): Promise<Product[]> {
    // Generate more sample data for scrolling
    const baseProducts = [
      {
        id: 1,
        code: "f230fh0g3",
        name: "Bamboo Watch",
        description: "Product Description",
        price: 65,
        category: "Accessories",
        quantity: 24,
        inventoryStatus: "INSTOCK",
        rating: 5
      },
      {
        id: 2,
        code: "nvklal433",
        name: "Black Watch",
        description: "Product Description",
        price: 72,
        category: "Accessories",
        quantity: 61,
        inventoryStatus: "INSTOCK",
        rating: 4
      },
      {
        id: 3,
        code: "zz21cz3c1",
        name: "Blue Band",
        description: "Product Description",
        price: 79,
        category: "Fitness",
        quantity: 2,
        inventoryStatus: "LOWSTOCK",
        rating: 3
      },
      {
        id: 4,
        code: "244wgerg2",
        name: "Blue T-Shirt",
        description: "Product Description",
        price: 29,
        category: "Clothing",
        quantity: 25,
        inventoryStatus: "INSTOCK",
        rating: 5
      },
      {
        id: 5,
        code: "h456wer53",
        name: "Bracelet",
        description: "Product Description",
        price: 15,
        category: "Accessories",
        quantity: 73,
        inventoryStatus: "INSTOCK",
        rating: 4
      }
    ];

    // Generate more products for demonstration
    const products: Product[] = [];
    for (let i = 0; i < 5; i++) {
      baseProducts.forEach((product, index) => {
        products.push({
          ...product,
          id: product.id + i * baseProducts.length,
          code: `${product.code}-${i}`,
          name: `${product.name} ${i + 1}`
        });
      });
    }

    return Promise.resolve(products);
  }
};