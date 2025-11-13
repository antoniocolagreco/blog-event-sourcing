type Brand<T extends string> = { __brand: T }


type PostId = Brand<"PostId"> & string
type CorrelationId = Brand<"CorrelationId"> & string

function unsafeBrandId<T>(id: string): T { return id as T }

function generateId<T>(): T {
  return crypto.randomUUID() as T
}

