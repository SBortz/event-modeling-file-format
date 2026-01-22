using System.Text.Json;
using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class TimelineConverter : JsonConverter<Timeline>
{
    public override Timeline Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var timeline = new Timeline();
        
        if (reader.TokenType != JsonTokenType.StartArray)
            throw new JsonException("Expected array");
        
        while (reader.Read() && reader.TokenType != JsonTokenType.EndArray)
        {
            using var doc = JsonDocument.ParseValue(ref reader);
            var root = doc.RootElement;
            
            if (!root.TryGetProperty("type", out var typeProp))
                throw new JsonException("Missing 'type' property");
            
            var type = typeProp.GetString();
            var json = root.GetRawText();
            
            switch (type)
            {
                case "event":
                    timeline.Events.Add(JsonSerializer.Deserialize<Event>(json, options)!);
                    break;
                case "stateview":
                    timeline.StateViews.Add(JsonSerializer.Deserialize<State>(json, options)!);
                    break;
                case "actor":
                    timeline.Actors.Add(JsonSerializer.Deserialize<Actor>(json, options)!);
                    break;
                case "command":
                    timeline.Commands.Add(JsonSerializer.Deserialize<Command>(json, options)!);
                    break;
                default:
                    throw new JsonException($"Unknown type: {type}");
            }
        }
        
        return timeline;
    }

    public override void Write(Utf8JsonWriter writer, Timeline value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        foreach (var item in value.All)
        {
            JsonSerializer.Serialize(writer, item, item.GetType(), options);
        }
        writer.WriteEndArray();
    }
}