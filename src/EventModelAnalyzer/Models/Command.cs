using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class Command
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "command";
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("tick")]
    public int Tick { get; set; }
    
    [JsonPropertyName("example")]
    public object? Example { get; set; }
}