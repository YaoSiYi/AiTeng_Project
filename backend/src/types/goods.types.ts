export interface GoodsListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  isOnSale?: number;
}

export interface CreateGoodsRequest {
  goodsName: string;
  categoryId: number;
  goodsSn: string;
  brandId?: number;
  shopPrice: number;
  marketPrice: number;
  costPrice: number;
  storeCount: number;
  goodsContent?: string;
  originalImg?: string;
  isOnSale?: number;
  isBest?: number;
  isNew?: number;
  isHot?: number;
  keywords?: string;
  goodsRemark?: string;
  sortOrder?: number;
}

export interface UpdateGoodsRequest extends Partial<CreateGoodsRequest> {}
