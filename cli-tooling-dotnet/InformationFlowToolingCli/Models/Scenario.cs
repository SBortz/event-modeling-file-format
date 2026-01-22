using System.Text.Json.Serialization;

namespace InformationFlowToolingCli.Models;

/// <summary>
/// A reference to an event with optional example data for scenarios
/// </summary>
public record EventReference(
    [property: JsonPropertyName("event")] string Event,
    [property: JsonPropertyName("data")] object? Data = null
);

/// <summary>
/// The "then" part of a command scenario - either produces events or fails
/// </summary>
public record CommandScenarioOutcome(
    [property: JsonPropertyName("produces")] List<EventReference>? Produces = null,
    [property: JsonPropertyName("fails")] string? Fails = null
);

/// <summary>
/// A Given-When-Then scenario for a command
/// </summary>
public record CommandScenario(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("given")] List<EventReference> Given,
    [property: JsonPropertyName("when")] object? When,
    [property: JsonPropertyName("then")] CommandScenarioOutcome Then
);

/// <summary>
/// A Given-Then scenario for a state view
/// </summary>
public record StateViewScenario(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("given")] List<EventReference> Given,
    [property: JsonPropertyName("then")] object? Then
);
