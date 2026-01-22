using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class EventModel
{
    [JsonPropertyName("$schema")]
    public string? Schema { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("version")]
    public string? Version { get; set; }
    
    [JsonPropertyName("timeline")]
    [JsonConverter(typeof(TimelineConverter))]
    public Timeline Timeline { get; set; } = new();
}