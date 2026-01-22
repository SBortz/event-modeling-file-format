namespace EventModelAnalyzer.Models;

public class Timeline
{
    public List<Event> Events { get; } = new();
    public List<State> StateViews { get; } = new();
    public List<Actor> Actors { get; } = new();
    public List<Command> Commands { get; } = new();
    
    public IEnumerable<object> All => 
        Events.Cast<object>()
            .Concat(StateViews)
            .Concat(Actors)
            .Concat(Commands)
            .OrderBy(e => e switch
            {
                Event ev => ev.Tick,
                State sv => sv.Tick,
                Actor a => a.Tick,
                Command c => c.Tick,
                _ => 0
            });
}