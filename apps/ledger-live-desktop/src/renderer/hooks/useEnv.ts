import { useEffect, useState } from "react";
import { changes, getEnv, EnvValue } from "@ledgerhq/live-common/env";
const useEnv = <Name extends string>(type: Name): EnvValue<Name> => {
  const [env, setEnv] = useState(() => getEnv(type));
  useEffect(() => {
    const sub = changes.subscribe(({ name, value }) => {
      if (type === name) {
        setEnv(value);
      }
    });
    return () => sub.unsubscribe();
  }, [type]);
  return env;
};
export default useEnv;
