import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRedisGet, safeRedisSet } from '../../../lib/redis';

import { fetchProjects } from './projects.service';

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
  const mockRange = vi.fn().mockReturnThis();
  const mockContains = vi.fn().mockReturnThis();

  const createMockQuery = () => {
    const query = Promise.resolve({
      data: [{
        id: 'proj-1',
        title: 'Project Title',
        description: 'Project Desc',
        date: '2024-01-01',
        tech_stack: ['React'],
        github_url: 'http://git',
        image_url: '/img.jpg'
      }],
      error: null
    });

    const finalQuery = Object.assign(query, {
      select: mockSelect,
      order: mockOrder,
      limit: mockLimit,
      range: mockRange,
      contains: mockContains
    });

    return finalQuery;
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => createMockQuery())
    }))
  };
});

describe('Projects Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchProjects should return cached data if available', async () => {
    const cachedData = [{ id: 'cached-proj-1', title: 'Cached Proj' }];
    vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await fetchProjects();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it('fetchProjects should fetch from Supabase if cache misses', async () => {
    vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

    const result = await fetchProjects();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(safeRedisSet).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('proj-1');
  });
});
