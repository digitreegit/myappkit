/**
 * 데이터 소스 공통 인터페이스.
 * Supabase, REST, localStorage 등 어떤 백엔드든 이 모양만 맞추면
 * 동일한 react-query 훅을 그대로 쓸 수 있습니다.
 */
export interface Repository<T extends { id: string }, NewT = Omit<T, "id">> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(values: NewT): Promise<T>;
  update(id: string, values: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
}
