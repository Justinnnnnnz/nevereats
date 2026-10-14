import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {cartSubtotal,guestUuid,useStore} from './store';
import type {MenuItem,Restaurant} from './types';
const item:MenuItem={id:'dish',name_zh:'测试菜',name_en:'Test',description_zh:'',price_cents:1000,cny_reference_price:null,popular:false,option_groups:[]};
const restaurant:Restaurant={id:'one',name_zh:'虚构餐厅',name_en:'Fiction',cuisine:'中餐',category:'中餐',neighborhood:'Spadina',rating:4.5,eta_min:15,eta_max:25,delivery_fee_cents:299,late_night:true,sections:[]};
beforeEach(()=>useStore.getState().clear());
describe('cart',()=>{
 it('blocks another restaurant until replacement is confirmed',()=>{const line={key:'dish',item,options:[],quantity:1};expect(useStore.getState().add(restaurant,line)).toBe(true);expect(useStore.getState().add({...restaurant,id:'two'},line)).toBe(false);expect(useStore.getState().restaurant?.id).toBe('one');expect(useStore.getState().add({...restaurant,id:'two'},line,true)).toBe(true);expect(useStore.getState().cart).toHaveLength(1);});
 it('calculates option deltas and removes zero quantities',()=>{useStore.getState().add(restaurant,{key:'dish',item,options:[{id:'extra',name_zh:'加料',price_delta_cents:75}],quantity:2});expect(cartSubtotal(useStore.getState().cart)).toBe(2150);useStore.getState().setQuantity('dish',0);expect(cartSubtotal(useStore.getState().cart)).toBe(0);});
 it('keeps guest identity in memory when browser storage is absent',()=>{useStore.getState().initGuest();const id=useStore.getState().guestId;useStore.getState().initGuest();expect(useStore.getState().guestId).toBe(id);expect(id).toMatch(/^[\da-f-]{36}$/);});
});

afterEach(()=>vi.unstubAllGlobals());
it('generates RFC4122 v4 guest ids over non-secure LAN HTTP',()=>{vi.stubGlobal('crypto',{getRandomValues:(bytes:Uint8Array)=>bytes.fill(255)});expect(guestUuid()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');});
