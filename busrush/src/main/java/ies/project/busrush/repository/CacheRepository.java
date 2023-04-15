package ies.project.busrush.repository;

import ies.project.busrush.dto.cache.NextScheduleDtoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class CacheRepository {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void save(String s,Object object) {
        redisTemplate.opsForValue().set(s, object);
    }

    public Object get(String s) {
        return redisTemplate.opsForValue().get(s);
    }

    public Set<Object> getAll(String s) {
        return redisTemplate.opsForSet().members(s);
    }

    public boolean exists(String s) {
        return redisTemplate.hasKey(s);
    }

    public void add(String s, NextScheduleDtoc object) {
        redisTemplate.opsForSet().add(s, object);
    }
}
