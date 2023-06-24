package it.polimit.tiw.asta.utils;

import java.lang.reflect.Type;
import java.time.Duration;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class DurationSerializer implements JsonSerializer<Duration>{

	@Override
	public JsonElement serialize(Duration duration, Type type, JsonSerializationContext jsonSerializationContext) {
		long millis = duration.toMillis();
        // 创建一个 JSON 友好的表示形式，例如字符串或数值
        return new JsonPrimitive(millis);
	}
}
