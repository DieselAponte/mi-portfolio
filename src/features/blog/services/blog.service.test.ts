import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRedisGet, safeRedisSet } from '../../../lib/redis';

import { fetchArticles } from './blog.service';

// Mock the redis client
vi.mock('../../../lib/redis', () => ({
  safeRedisGet: vi.fn(),
  safeRedisSet: vi.fn(),
  safeRedisDel: vi.fn(),
  safeRedisKeys: vi.fn(),
}));

// Mock the supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockReturnThis();

  const createMockQuery = () => {
    const query = Promise.resolve({
      data: [{
        id: 'test-1',
        title: 'Test Title',
        date: '2024-01-01',
        description: 'Test Description',
        thumbnail: '/test.jpg',
        tags: ['test'],
        content: 'Test content',
        is_featured: false
      }],
      error: null
    });

    const finalQuery = Object.assign(query, {
        select: mockSelect,
        order: mockOrder,
        eq: mockEq,
        limit: mockLimit,
        contains: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis()
    });

    return finalQuery;
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => createMockQuery())
    }))
  };
});

describe('Blog Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchArticles should return cached data if available', async () => {
    const cachedData = [{ id: 'cached-1', title: 'Cached Title' }];
    vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await fetchArticles();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it('fetchArticles should fetch from Supabase if cache misses', async () => {
    vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

    const result = await fetchArticles();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(safeRedisSet).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('test-1');
  });
});
