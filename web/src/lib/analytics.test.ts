import {afterEach,expect,it,vi} from 'vitest';
const capture=vi.fn();const init=vi.fn();
vi.mock('posthog-js',()=>({default:{capture,init}}));
import {track} from './analytics';
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
it('respects Do Not Track and excludes private properties',async()=>{vi.stubGlobal('window',{});vi.stubGlobal('navigator',{doNotTrack:'1'});vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY','test-key');track('address_selected',{type:'quick_pick',address:'private',coordinates:'private'});expect(init).not.toHaveBeenCalled();vi.stubGlobal('navigator',{doNotTrack:'0'});track('address_selected',{type:'quick_pick',address:'private',coordinates:'private'});await vi.waitFor(()=>expect(capture).toHaveBeenCalledWith('address_selected',{type:'quick_pick'}));expect(init.mock.calls[0][1].disable_session_recording).toBe(true);expect(init.mock.calls[0][1].autocapture).toBe(false);});
