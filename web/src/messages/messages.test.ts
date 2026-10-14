import {describe,it,expect} from "vitest";
import messages from "./zh-CN.json";
describe("中文界面字典", () => { it("提供四个导航入口与模拟体验说明", () => { expect(Object.keys(messages.tabs)).toEqual(["home","search","orders","profile"]); expect(messages.shell.notice).toContain("不会扣任何钱"); }); });
