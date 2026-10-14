export type Option = {id:string; name_zh:string; price_delta_cents:number};
export type OptionGroup = {id:string; name_zh:string; min_select:number; max_select:number; options:Option[]};
export type MenuItem = {id:string; name_zh:string; name_en:string; image_url:string; description_zh:string; price_cents:number; cny_reference_price:number|null; popular:boolean; option_groups:OptionGroup[]};
export type Restaurant = {id:string; name_zh:string; name_en:string; image_url:string; cuisine:string; category:string; neighborhood:string; rating:number; eta_min:number; eta_max:number; delivery_fee_cents:number; late_night:boolean; sections:{id:string;name_zh:string;items:MenuItem[]}[]};
export type Address = {name:string; coordinates:[number,number]};
export type CartLine = {key:string; item:MenuItem; options:Option[]; quantity:number};
export type Order = {id:string;restaurant_id:string;restaurant:Restaurant;placed_at:string;timeline:{status:string;offset_seconds:number}[];status:string;courier_id:string;subtotal_cents:number;delivery_fee_cents:number;service_fee_cents:number;small_order_fee_cents:number;express_fee_cents:number;tax_cents:number;tip_cents:number;total_cents:number;items:{menu_item_id:string;name_zh_snapshot:string;quantity:number;unit_price_cents:number;selected_options:Option[]}[]};
export type Stats={saved_cents:number;order_count:number;favorite_restaurant:string|null;top_hour:number|null};
