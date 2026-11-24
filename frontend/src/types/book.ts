export interface Book {
  id: number;
  category_id: number;
  category_name?: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
}
