using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class Event
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "event";
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("tick")]
    public int Tick { get; set; }
    
    [JsonPropertyName("producedBy")]
    public string? ProducedBy { get; set; }
    
    [JsonPropertyName("externalSource")]
    public string? ExternalSource { get; set; }
    
    [JsonPropertyName("example")]
    public object? Example { get; set; }
}