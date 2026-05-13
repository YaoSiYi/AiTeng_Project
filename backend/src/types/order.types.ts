export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  orderNo?: string;
  orderStatus?: number;
  payStatus?: number;
  shippingStatus?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus?: number;
  payStatus?: number;
  shippingStatus?: number;
  remark?: string;
}

export interface ShipOrderRequest {
  expressCode: string;
  expressNo: string;
  shippingName: string;
}
