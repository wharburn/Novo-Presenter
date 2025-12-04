import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function saveToRedis(key: string, value: any, ttl?: number) {
  try {
    if (ttl) {
      await redis.setex(key, ttl, JSON.stringify(value))
    } else {
      await redis.set(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error('Redis save error:', error)
  }
}

export async function getFromRedis(key: string) {
  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value as string) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function deleteFromRedis(key: string) {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}
