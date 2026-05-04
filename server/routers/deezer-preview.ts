import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

export const deezerPreviewRouter = router({
  getPreview: publicProcedure
    .input(z.object({ deezerId: z.number() }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(`https://api.deezer.com/track/${input.deezerId}`);
        if (!response.ok) {
          throw new Error(`Deezer API error: ${response.status}`);
        }
        const data = await response.json();
        return {
          preview: data.preview || null,
          title: data.title || '',
          artist: data.artist?.name || '',
          albumCover: data.album?.cover_medium || '',
        };
      } catch (error) {
        console.error('Deezer preview fetch error:', error);
        return { preview: null, title: '', artist: '', albumCover: '' };
      }
    }),
});
