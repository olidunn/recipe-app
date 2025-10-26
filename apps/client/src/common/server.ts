import { treaty } from '@elysiajs/eden';
import type { Server } from '@recipe-app/server';
import { authenticatedKey } from '~/common/data/users';
import { queryClient } from '~/common/queryClient';

export const server = treaty<Server>(import.meta.env.VITE_SERVER_URL, {
  fetch: { mode: 'cors', credentials: 'include' },
  onResponse: async (response) => {
    if (response.status === 401) {
      await queryClient.cancelQueries();
      queryClient.setQueryData(authenticatedKey, false);
    }
  },
});
