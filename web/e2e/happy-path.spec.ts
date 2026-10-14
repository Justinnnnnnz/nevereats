import {test,expect} from '@playwright/test';
test('quick address → options → pretend pay → tracking → savings → reorder',async({page},testInfo)=>{
 await page.route('https://api.mapbox.com/**',route=>route.abort());
 let requestBody:Record<string,unknown>|undefined;
 page.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/v1/orders'))requestBody=request.postDataJSON();});
 await page.goto('/');
 await page.getByRole('button',{name:'📚 Robarts 图书馆',exact:true}).click();
 for(const width of [375,430]){await page.setViewportSize({width,height:850});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.getByRole('link').filter({has:page.getByRole('heading',{name:'Spadina 云朵麻辣烫',exact:true})}).first().click();
 await page.getByRole('button',{name:/麻辣烫 Malatang/}).click();
 await page.getByLabel('大份').check();
 await page.getByRole('button',{name:/加入购物车 ·/}).click();
 await page.getByRole('link',{name:/去结算/}).click();
 await expect(page.getByText('这是模拟体验：不会配送真实食物，也不会扣任何钱。')).toBeVisible();
 await page.getByRole('button',{name:'0%',exact:true}).click();
 await expect(page.getByText('😢 骑手：没关系的…（假装不在意）')).toBeVisible();
 await page.getByLabel('优惠码',{exact:true}).fill('NEVER');
 await page.getByRole('button',{name:'试试优惠码'}).evaluate(el=>el.scrollIntoView({block:'center'}));
 await page.getByRole('button',{name:'试试优惠码'}).click();
 await expect(page.getByText('这个券已过期（它从来就没生效过）')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:/空气支付 CA/}).evaluate(el=>el.scrollIntoView({block:'center'}));
 await page.getByRole('button',{name:/空气支付 CA/}).click();
 await page.waitForURL(/\/orders\/[\da-f-]+$/);
 expect(requestBody).toBeDefined();expect(Object.keys(requestBody!)).toEqual(expect.arrayContaining(['client_total_cents']));
 expect(Object.keys(requestBody!)).not.toEqual(expect.arrayContaining(['address']));
 await page.goto(page.url()+'?speed=60');
 await expect(page.getByRole('progressbar')).toBeVisible();
 await expect(page.getByRole('heading',{name:/这一单你省下了/})).toBeVisible({timeout:20000});
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片'}).click();
 const download=await downloadPromise;expect(download.suggestedFilename()).toMatch(/^NeverEats-.*\.png$/);await download.saveAs(`.cache.nosync/share-${testInfo.project.name}.png`);const box=await page.locator('.share-card').boundingBox();expect(box).not.toBeNull();expect(Math.abs(box!.width/box!.height-.75)).toBeLessThan(.01);
 await page.getByRole('button',{name:'再来一单（假的）'}).click();await page.waitForURL('**/checkout');
 await expect(page.getByText('Spadina 云朵麻辣烫',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'我的',exact:true}).click();await expect(page.getByText('累计省钱',{exact:true})).toBeVisible();
});
test('WeChat banner, dark mode and reduced motion',async({browser})=>{
 const context=await browser.newContext({userAgent:'Mozilla/5.0 MicroMessenger',colorScheme:'dark',reducedMotion:'reduce',viewport:{width:375,height:812}});const page=await context.newPage();await page.goto('/');await expect(page.getByText('建议用浏览器打开，体验更完整')).toBeVisible();await page.getByRole('button',{name:'🗼 CN Tower',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
