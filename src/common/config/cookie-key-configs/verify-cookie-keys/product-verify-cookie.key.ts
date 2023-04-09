export interface ProductVerifyCookieKey {
  is_exist: {
    id_executed: string;
  };
  is_not_exist: {
    name_executed: string;
  };
}

export const productVerifyCookieKey = {
  is_exist: {
    id_executed: "is_exist_product_id_executed",
  },
  is_not_exist: {
    name_executed: "is_not_exist_product_name_executed",
  },
};
