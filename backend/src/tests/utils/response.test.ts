import { success, error, paginate } from '../../utils/response';

describe('Response Utils', () => {
  describe('success', () => {
    it('should return success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = success(data);

      expect(result).toEqual({
        code: 200,
        message: '成功',
        data,
      });
    });

    it('should return success response with custom message', () => {
      const data = { id: 1 };
      const result = success(data, '操作成功');

      expect(result).toEqual({
        code: 200,
        message: '操作成功',
        data,
      });
    });

    it('should handle null data', () => {
      const result = success(null);

      expect(result).toEqual({
        code: 200,
        message: '成功',
        data: null,
      });
    });
  });

  describe('error', () => {
    it('should return error response with default values', () => {
      const result = error();

      expect(result).toEqual({
        code: 500,
        message: '失败',
        data: null,
      });
    });

    it('should return error response with custom message and code', () => {
      const result = error('自定义错误', 400);

      expect(result).toEqual({
        code: 400,
        message: '自定义错误',
        data: null,
      });
    });
  });

  describe('paginate', () => {
    it('should return paginated response', () => {
      const list = [{ id: 1 }, { id: 2 }];
      const total = 10;
      const page = 1;
      const pageSize = 2;

      const result = paginate(list, total, page, pageSize);

      expect(result).toEqual({
        code: 200,
        message: '成功',
        data: {
          list,
          total,
          page,
          pageSize,
          totalPages: 5,
        },
      });
    });

    it('should calculate totalPages correctly', () => {
      const list = [{ id: 1 }];
      const result = paginate(list, 10, 1, 3);

      expect(result.data?.totalPages).toBe(4); // Math.ceil(10/3)
    });

    it('should handle empty list', () => {
      const result = paginate([], 0, 1, 10);

      expect(result).toEqual({
        code: 200,
        message: '成功',
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        },
      });
    });
  });
});
