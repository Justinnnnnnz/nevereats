import {describe,expect,it} from 'vitest';
import cases from '../../../shared/fee-cases.json';
import {fees,parseCents} from './fees';
describe('shared fee cases',()=>{for(const c of cases)it(`subtotal ${c.subtotal}`,()=>expect(fees(c.subtotal,c.delivery,c.express,c.tip_mode,c.custom)).toEqual(c.expected));});
it('parses custom tip without floating point rounding',()=>{expect(parseCents('12.34')).toBe(1234);expect(parseCents('0.1')).toBe(10);expect(parseCents('-1')).toBeNull();expect(parseCents('1.234')).toBeNull();});
