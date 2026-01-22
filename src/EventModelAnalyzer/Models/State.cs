using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class State
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "stateview";
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("tick")]
    public int Tick { get; set; }
    
    [JsonPropertyName("subscribesTo")]
    public List<string> SubscribesTo { get; set; } = new();
    
    [JsonPropertyName("example")]
    public object? Example { get; set; }
}