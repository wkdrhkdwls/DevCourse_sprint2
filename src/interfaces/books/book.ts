export interface BookDTO {
  id: number;
  title: string;
  img: number;
  category_id: number;
  form: string;
  isbn: string;
  summary: string;
  detail: string;
  author: string;
  page: number;
  contents: string;
  price: number;
  likes: number;
  liked: boolean;
  pub_date: Date;
}
export interface QueryParamsDTO {
  category_id?: string;
  news?: string;
  limit?: string;
  currentPage?: string;
}
