using System.Text.Json.Serialization;

namespace EventModelAnalyzer.Models;

public class Actor
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "actor";
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("tick")]
    public int Tick { get; set; }
    
    [JsonPropertyName("readsView")]
    public string ReadsView { get; set; } = string.Empty;
    
    [JsonPropertyName("sendsCommand")]
    public string SendsCommand { get; set; } = string.Empty;
}