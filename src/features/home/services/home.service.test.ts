import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRedisGet, safeRedisSet } from '../../../lib/redis';

import { fetchCasesOfStudy, fetchHomeServices, fetchHomeAbout } from './home.service';

vi.mock('../../../lib/redis', () => ({
  safeRedisGet: vi.fn(),
  safeRedisSet: vi.fn(),
  safeRedisDel: vi.fn(),
  safeRedisKeys: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockReturnThis();

  const createMockQuery = (table: string) => {
    let mockData: unknown = [];
    if (table === 'home_services') {
      mockData = [{
        id: 'svc-1',
        title: 'Full-Stack Development',
        description: 'End-to-end web application development',
        highlights: ['React', 'Node.js', 'PostgreSQL'],
        order_index: 1
      }];
    } else if (table === 'home_cases_of_study') {
      mockData = [{
        id: 'case-1',
        title: 'Enterprise Dashboard',
        description: 'Real-time analytics platform for logistics',
        tags: ['React', 'D3.js'],
        order_index: 1
      }];
    } else if (table === 'home_about') {
      mockData = {
        id: 1,
        image_url: 'https://example.com/about.jpg',
        bio: 'Bio test',
      };
    }

    const maybeSingle = vi.fn().mockResolvedValue({
      data: mockData,
      error: null,
    });

    const query = Promise.resolve({
      data: mockData,
      error: null
    });

    return Object.assign(query, {
      select: mockSelect,
      order: mockOrder,
      limit: mockLimit,
      maybeSingle,
    });
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn((table: string) => createMockQuery(table))
    }))
  };
});

describe('Home Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchHomeServices', () => {
    it('should return cached data if available', async () => {
      const cachedData = [{ id: 'cached-svc-1', title: 'Cached Service' }];
      vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await fetchHomeServices();

      expect(safeRedisGet).toHaveBeenCalledWith('home_services');
      expect(result).toEqual(cachedData);
    });

    it('should fetch from Supabase if cache misses', async () => {
      vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

      const result = await fetchHomeServices();

      expect(safeRedisGet).toHaveBeenCalledWith('home_services');
      expect(safeRedisSet).toHaveBeenCalledWith(
        'home_services',
        3600,
        expect.any(String)
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('svc-1');
    });
  });

  describe('fetchCasesOfStudy', () => {
    it('should return cached data if available', async () => {
      const cachedData = [{ id: 'cached-case-1', title: 'Cached Case' }];
      vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await fetchCasesOfStudy();

      expect(safeRedisGet).toHaveBeenCalledWith('home_cases_of_study');
      expect(result).toEqual(cachedData);
    });

    it('should fetch from Supabase if cache misses', async () => {
      vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

      const result = await fetchCasesOfStudy();

      expect(safeRedisGet).toHaveBeenCalledWith('home_cases_of_study');
      expect(safeRedisSet).toHaveBeenCalledWith(
        'home_cases_of_study',
        3600,
        expect.any(String)
      );
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('case-1');
    });
  });

  describe('fetchHomeAbout', () => {
    it('should return cached about data if available', async () => {
      const cachedData = { id: 1, image_url: 'https://example.com/cached.jpg' };
      vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await fetchHomeAbout();

      expect(safeRedisGet).toHaveBeenCalledWith('home_about');
      expect(result).toEqual(cachedData);
    });

    it('should fetch about from Supabase if cache misses', async () => {
      vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

      const result = await fetchHomeAbout();

      expect(safeRedisGet).toHaveBeenCalledWith('home_about');
      expect(safeRedisSet).toHaveBeenCalledWith(
        'home_about',
        3600,
        expect.any(String)
      );
      expect(result.image_url).toBe('https://example.com/about.jpg');
    });
  });
});
