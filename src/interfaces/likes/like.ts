export interface LikeDTO {
  affectedRows: number;
  user_id: number;
  liked_book_id: number;
}

export interface InsertResult {
  affectedRows: number;
  insertId: number;
}
