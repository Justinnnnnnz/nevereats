export const percent=(cents:number,rate:number)=>Math.floor((cents*rate+50)/100);
export function fees(subtotal:number,delivery:number,express:boolean,tipMode:string,custom=0,taxRate=13){
 const service=Math.min(700,Math.max(200,percent(subtotal,15)));const small=subtotal<1500?250:0;const rush=express?299:0;
 const tax=percent(subtotal+delivery+service+small+rush,taxRate);const tip=tipMode==='custom'?custom:percent(subtotal,Number(tipMode));
 return {subtotal_cents:subtotal,delivery_fee_cents:delivery,service_fee_cents:service,small_order_fee_cents:small,express_fee_cents:rush,tax_cents:tax,tip_cents:tip,total_cents:subtotal+delivery+service+small+rush+tax+tip};
}
export function parseCents(value:string):number|null {if(!/^\d{1,4}(\.\d{0,2})?$/.test(value))return null;const [whole,fraction='']=value.split('.');return Number(whole)*100+Number(fraction.padEnd(2,'0'));}
