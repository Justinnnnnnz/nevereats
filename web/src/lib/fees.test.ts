import {describe,expect,it} from 'vitest';
import cases from '../../../shared/fee-cases.json';
import {fees,parseCents} from './fees';
describe('shared fee cases',()=>{for(const c of cases)it(`subtotal ${c.subtotal}`,()=>expect(fees(c.subtotal,c.delivery,c.express,c.tip_mode,c.custom)).toEqual(c.expected));});
it('parses custom tip without floating point rounding',()=>{expect(parseCents('12.34')).toBe(1234);expect(parseCents('0.1')).toBe(10);expect(parseCents('-1')).toBeNull();expect(parseCents('1.234')).toBeNull();});
it('applies the half-off threshold and cap',()=>{expect(fees(1999,399,false,'0',0,13,'half_off').discount_cents).toBe(0);expect(fees(5000,399,false,'0',0,13,'half_off').discount_cents).toBe(1500);});
it('shows the waived delivery charge in the promotion savings line',()=>{const total=fees(5000,399,false,'0',0,13,'free_delivery');expect(total.delivery_fee_cents).toBe(0);expect(total.discount_cents).toBe(399);});
it('combines member delivery and service benefits before the half-off promotion',()=>{const total=fees(5000,399,false,'0',0,13,'half_off',true);expect(total.delivery_fee_cents).toBe(0);expect(total.service_fee_cents).toBe(350);expect(total.discount_cents).toBe(1500);});
