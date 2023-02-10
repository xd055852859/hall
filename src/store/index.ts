import { authStore } from "@/store/auth";
import { commonStore } from "@/store/common";
import { hallStore } from "@/store/hall";

import { createPinia } from "pinia";
export interface IAppStore {
  authStore: ReturnType<typeof authStore>;
  commonStore: ReturnType<typeof commonStore>;
  hallStore: ReturnType<typeof hallStore>;
}

const appStore: IAppStore = {} as IAppStore;
/**
 * 注册app状态库
 */

export const registerStore = () => {
  appStore.authStore = authStore();
  appStore.commonStore = commonStore();
  appStore.hallStore = hallStore();
};

export default appStore;
