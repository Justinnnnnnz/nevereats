// Refresh NEXT_PUBLIC_CAD_TO_CNY when the exchange rate changes; this is an estimate.
const configured=Number(process.env.NEXT_PUBLIC_CAD_TO_CNY||5);
export const cadToCny=Number.isFinite(configured)&&configured>0?configured:5;
export const yuan=(cents:number)=>Math.round(cents*cadToCny/100);
export const orderDate=(date:string)=>new Intl.DateTimeFormat('zh-CN',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));
