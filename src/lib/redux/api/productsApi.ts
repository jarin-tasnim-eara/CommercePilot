import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "@/types";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
  brand?: string;
}

interface ProductOverrides {
  updated: Record<number, Partial<Product>>;
  deleted: number[];
  created: Product[];
  nextId: number;
}

const emptyOverrides: ProductOverrides = {
  updated: {},
  deleted: [],
  created: [],
  nextId: 100000,
};

function getOverrides(): ProductOverrides {
  return loadFromStorage<ProductOverrides>(STORAGE_KEYS.products, emptyOverrides);
}

function persistOverrides(overrides: ProductOverrides) {
  saveToStorage(STORAGE_KEYS.products, overrides);
}

function toProduct(source: DummyProduct): Product {
  const timestamp = new Date().toISOString();
  return {
    id: source.id,
    title: source.title,
    description: source.description,
    category: source.category,
    price: source.price,
    stock: source.stock,
    lowStockThreshold: 10,
    thumbnail: source.thumbnail,
    images: source.images,
    brand: source.brand,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products?limit=100",
      transformResponse: (response: { products: DummyProduct[] }) => {
        const overrides = getOverrides();
        const remoteProducts = response.products
          .filter((product) => !overrides.deleted.includes(product.id))
          .map((product) => ({ ...toProduct(product), ...overrides.updated[product.id] }));
        return [...overrides.created, ...remoteProducts];
      },
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation<Product, Omit<Product, "id" | "createdAt" | "updatedAt">>({
      queryFn: (newProduct) => {
        const overrides = getOverrides();
        const timestamp = new Date().toISOString();
        const product: Product = {
          ...newProduct,
          id: overrides.nextId,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        overrides.created.unshift(product);
        overrides.nextId += 1;
        persistOverrides(overrides);
        return { data: product };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<void, { id: number; changes: Partial<Product> }>({
      queryFn: ({ id, changes }) => {
        const overrides = getOverrides();
        const timestamp = new Date().toISOString();
        const createdIndex = overrides.created.findIndex((product) => product.id === id);
        if (createdIndex !== -1) {
          overrides.created[createdIndex] = {
            ...overrides.created[createdIndex],
            ...changes,
            updatedAt: timestamp,
          };
        } else {
          overrides.updated[id] = { ...overrides.updated[id], ...changes, updatedAt: timestamp };
        }
        persistOverrides(overrides);
        return { data: undefined };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, number>({
      queryFn: (id) => {
        const overrides = getOverrides();
        overrides.created = overrides.created.filter((product) => product.id !== id);
        if (!overrides.deleted.includes(id)) overrides.deleted.push(id);
        persistOverrides(overrides);
        return { data: undefined };
      },
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
