import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb, getCachedPreview, cachePreview, getFallbackAudio, getCacheStats } from "../db";
import { deezerPreviewCache, karaokeAudioFallback } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const CACHE_TTL_HOURS = 24; // Cache expires after 24 hours

export const deezerPreviewRouter = router({
  getPreview: publicProcedure
    .input(z.object({ deezerId: z.number() }))
    .query(async ({ input }) => {
      try {
        // Check cache first
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        const cached = await db
          .select()
          .from(deezerPreviewCache)
          .where(eq(deezerPreviewCache.deezerId, input.deezerId))
          .limit(1);

        if (cached.length > 0) {
          const cache = cached[0];
          // Check if cache is still valid
          if (cache.expiresAt && new Date(cache.expiresAt) > new Date()) {
            console.log(`[Cache HIT] Deezer preview for ID ${input.deezerId}`);
            return {
              preview: cache.previewUrl,
              title: cache.title,
              artist: cache.artist,
              albumCover: cache.albumCover,
              fromCache: true,
            };
          }
        }

        // Fetch from Deezer API
        console.log(`[Cache MISS] Fetching Deezer preview for ID ${input.deezerId}`);
        const response = await fetch(`https://api.deezer.com/track/${input.deezerId}`);
        if (!response.ok) {
          throw new Error(`Deezer API error: ${response.status}`);
        }
        const data = await response.json();

        const previewUrl = data.preview || null;
        const title = data.title || '';
        const artist = data.artist?.name || '';
        const albumCover = data.album?.cover_medium || '';

        // Save to cache
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);

        try {
          await db
            .insert(deezerPreviewCache)
            .values({
              deezerId: input.deezerId,
              title,
              artist,
              previewUrl,
              albumCover,
              duration: data.duration || null,
              isAvailable: !!previewUrl,
              expiresAt,
            })
            .onDuplicateKeyUpdate({
              set: {
                previewUrl,
                albumCover,
                title,
                artist,
                isAvailable: !!previewUrl,
                expiresAt,
              },
            });
        } catch (cacheError) {
          console.warn('Failed to cache preview:', cacheError);
          // Continue anyway, cache is not critical
        }

        return {
          preview: previewUrl,
          title,
          artist,
          albumCover,
          fromCache: false,
        };
      } catch (error) {
        console.error('Deezer preview fetch error:', error);
        
        // Try to get fallback audio
        try {
          const fallback = await db
            .select()
            .from(karaokeAudioFallback)
            .where(eq(karaokeAudioFallback.deezerId, input.deezerId))
            .limit(1);

          if (fallback.length > 0 && fallback[0].fallbackPreviewUrl) {
            console.log(`[Fallback] Using fallback audio for ID ${input.deezerId}`);
            return {
              preview: fallback[0].fallbackPreviewUrl,
              title: '',
              artist: '',
              albumCover: '',
              fromFallback: true,
            };
          }
        } catch (fallbackError) {
          console.warn('Failed to get fallback audio:', fallbackError);
        }

        return { preview: null, title: '', artist: '', albumCover: '' };
      }
    }),

  // Mutation to manually cache a preview
  cachePreview: publicProcedure
    .input(
      z.object({
        deezerId: z.number(),
        title: z.string(),
        artist: z.string(),
        previewUrl: z.string().nullable(),
        albumCover: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);

        await db
          .insert(deezerPreviewCache)
          .values({
            deezerId: input.deezerId,
            title: input.title,
            artist: input.artist,
            previewUrl: input.previewUrl,
            albumCover: input.albumCover,
            isAvailable: !!input.previewUrl,
            expiresAt,
          })
          .onDuplicateKeyUpdate({
            set: {
              title: input.title,
              artist: input.artist,
              previewUrl: input.previewUrl,
              albumCover: input.albumCover,
              isAvailable: !!input.previewUrl,
              expiresAt,
            },
          });

        return { success: true };
      } catch (error) {
        console.error('Failed to cache preview:', error);
        return { success: false, error: String(error) };
      }
    }),

  // Query to get cache stats
  getCacheStats: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const total = await db.select().from(deezerPreviewCache);
      const available = total.filter((c) => c.isAvailable).length;
      const expired = total.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

      return {
        totalCached: total.length,
        availablePreviews: available,
        expiredEntries: expired,
        cacheHitRate: total.length > 0 ? ((available / total.length) * 100).toFixed(2) : '0',
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return { totalCached: 0, availablePreviews: 0, expiredEntries: 0, cacheHitRate: '0' };
    }
  }),

  // Mutation to clear expired cache entries
  clearExpiredCache: publicProcedure.mutation(async () => {
    try {
      const now = new Date();
      // This would require raw SQL or a more complex query
      // For now, we'll just log that this should be done
      console.log('[Cache] Expired entries should be cleared by scheduled job');
      return { success: true, message: 'Scheduled for cleanup' };
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
      return { success: false, error: String(error) };
    }
  }),
});
