// <reference types="vite/client" />
type Nullable<T> = T | null;

type NonNullableObj<T> = {
  [K in keyof T]-?: T[K];
};

type DataMap<T> = {
  data: T;
};

interface IParentComponentProps {
  className?: string;
  children: ReactChild;
}

interface Klaytn {
  on: (eventName: string, callback: () => void) => void;
  enable: () => Promise<Array<string>>;
  selectedAddress: string;
  networkVersion: number;
  publicConfigStore: Store;
}

declare global {
  interface Window {
    klaytn: Klaytn;
  }
}

interface ImportMeta {
  env: {
    VITE_URL: string;
  };
}
