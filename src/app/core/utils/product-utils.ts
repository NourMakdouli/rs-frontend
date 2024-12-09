import { Product } from '../models/product';

// **Filter Products by Store**
export function filterProductsByStore(products: Product[], storeId?: string): Product[] {
  if (!storeId) return [...products];

  return products.filter(product => {
    const productStoreId = typeof product.store === 'object' ? product.store._id : product.store;
    return productStoreId === storeId;
  });
}

// **Filter Products by Search Term**
export function filterProductsBySearch(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm) return products;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(lowerSearchTerm) ||
    product.description.toLowerCase().includes(lowerSearchTerm)
  );
}

// **Sort Products Based on Criterion**
export function sortProducts(products: Product[], criterion: string): Product[] {
  const productsCopy = [...products];

  switch (criterion) {
    case 'NameAsc':
      productsCopy.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'NameDesc':
      productsCopy.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'PriceAsc':
      productsCopy.sort((a, b) => 
        (a.effectivePrice ?? a.priceExcludingFees) - 
        (b.effectivePrice ?? b.priceExcludingFees)
      );
      break;
    case 'PriceDesc':
      productsCopy.sort((a, b) => 
        (b.effectivePrice ?? b.priceExcludingFees) - 
        (a.effectivePrice ?? a.priceExcludingFees)
      );
      break;
    case 'Random':
      for (let i = productsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
      }
      break;
    default:
      // 'Relevance' or any default doesn't change order
      break;
  }

  return productsCopy;
}
