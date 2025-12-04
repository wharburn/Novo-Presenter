import { Redis } from '@upstash/redis'

let redis: Redis | null = null

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

export async function saveToRedis(key: string, value: any, ttl?: number) {
  try {
    const client = getRedis()
    if (ttl) {
      await client.setex(key, ttl, JSON.stringify(value))
    } else {
      await client.set(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Redis save error:', error)
  }
}

export async function getFromRedis(key: string) {
  try {
    const client = getRedis()
    const value = await client.get(key)
    return value ? JSON.parse(value as string) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function deleteFromRedis(key: string) {
  try {
    const client = getRedis()
    await client.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}
