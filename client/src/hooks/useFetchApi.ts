import { useEffect, useState } from 'react';

import type { BookDocument, UserDocument } from '../types';

type Data = BookDocument | BookDocument[] | UserDocument | UserDocument[] | null;

function useCountries(fetchFunc: () => Promise<any>) {
  const [data, setData] = useState<Data>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchFunc()
      .then((data: Data) => setData(data))
      .catch((err: Error) => setError(err));
    setIsLoading(false);
  }, [fetchFunc]);

  return [data, isLoading, error];
}

export { useCountries };
