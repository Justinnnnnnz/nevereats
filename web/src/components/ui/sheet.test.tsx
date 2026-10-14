// @vitest-environment jsdom
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import messages from '@/messages/zh-CN.json';
import {Sheet} from './sheet';
afterEach(cleanup);
it('exposes an accessible modal title and close control',()=>{const onOpenChange=vi.fn();render(<NextIntlClientProvider locale="zh-CN" messages={messages}><Sheet open onOpenChange={onOpenChange} title="送到哪里？"><button>快捷地址</button></Sheet></NextIntlClientProvider>);expect(screen.getByRole('dialog').getAttribute('aria-labelledby')).toBeTruthy();expect(screen.getByRole('heading',{name:'送到哪里？'})).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'关闭'}));expect(onOpenChange).toHaveBeenCalledWith(false);});
