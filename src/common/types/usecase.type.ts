export interface UseCase<R, P> {
	invoke(params: P): Promise<R>
}