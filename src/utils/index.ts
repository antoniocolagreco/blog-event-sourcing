export function unsafeBrandId<T>(id: string): T {
	return id as T;
}

export function generateId<T>(): T {
	return crypto.randomUUID() as T;
}
