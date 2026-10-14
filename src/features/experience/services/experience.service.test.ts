import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeRedisGet, safeRedisSet } from '../../../lib/redis';

import { fetchModules, fetchSlides } from './experience.service';

vi.mock('../../../lib/redis', () => ({
  safeRedisGet: vi.fn(),
  safeRedisSet: vi.fn(),
  safeRedisDel: vi.fn(),
  safeRedisKeys: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();

  const createMockQuery = (table: string) => {
    let mockData: Array<Record<string, unknown>> = [];
    if (table === 'experience_modules') {
        mockData = [{
          id: '01',
          title: 'College',
          subtitle: 'B.S. Computer Science',
          status: 'COMPLETED',
          eyebrow: 'Module 01',
          heading: 'College Years',
          summary: 'Foundation in CS fundamentals',
          highlights: ['Data Structures', 'Algorithms'],
          order_index: 1
        }];
    } else if (table === 'experience_slides') {
        mockData = [{
          id: 'slide-1',
          role: 'Software Engineer',
          organization: 'Aperture Labs',
          timeframe: '2023 - Present',
          summary: 'Building portals',
          tags: ['React', 'TypeScript'],
          module_id: '03',
          order_index: 1
        }];
    } else if (table === 'tech_bubbles') {
        mockData = [{
          id: 'bubble-1',
          label: 'React',
          top: '20%',
          right: '30%',
          delay: '0s',
          duration: '3s',
          module_id: '02'
        }];
    }

    const query = Promise.resolve({
      data: mockData,
      error: null
    });

    const finalQuery = Object.assign(query, {
      select: mockSelect,
      order: mockOrder,
      eq: mockEq
    });

    return finalQuery;
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn((table: string) => createMockQuery(table))
    }))
  };
});

describe('Experience Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchModules should return cached data if available', async () => {
    const cachedData = [{ id: 'cached-mod-1', title: 'Cached Mod' }];
    vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await fetchModules();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it('fetchModules should fetch from Supabase if cache misses', async () => {
    vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

    const result = await fetchModules();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(safeRedisSet).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('01');
  });

  it('fetchSlides should return cached data if available', async () => {
    const cachedData = [{ id: 'cached-slide-1', role: 'Cached Role' }];
    vi.mocked(safeRedisGet).mockResolvedValueOnce(JSON.stringify(cachedData));

    const result = await fetchSlides();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(result).toEqual(cachedData);
  });

  it('fetchSlides should fetch from Supabase if cache misses', async () => {
    vi.mocked(safeRedisGet).mockResolvedValueOnce(null);

    const result = await fetchSlides();

    expect(safeRedisGet).toHaveBeenCalled();
    expect(safeRedisSet).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('slide-1');
  });
});
